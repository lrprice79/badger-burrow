import type { BurrowTokens } from '@badger-burrow/tokens'
import type { ColorMode } from './resolver'
import { buildBoxStyles, buildTextStyles } from './buildStyles'
import type { BurrowBoxVisualProps, BurrowTextVisualProps, PseudoBoxProps, PseudoTextProps, RV } from './props'

// ─── Shade stepping ───────────────────────────────────────────────────────────

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
type Shade = typeof SHADES[number]

/**
 * Step a shade one increment darker (toward 900).
 * Clamps at 900 — if already at darkest, returns 900.
 * Returns the original value unchanged if it is not a recognised shade.
 */
export function stepShade(shade: number, steps = 1): number {
    const idx = SHADES.indexOf(shade as Shade)
    if (idx === -1) return shade
    return SHADES[Math.min(idx + steps, SHADES.length - 1)]
}

// ─── Primitive bg path parsing ────────────────────────────────────────────────

/**
 * Parses a primitive colour token path of the form "color.{scale}.{shade}".
 * Returns { scale, shade } if matched, null otherwise.
 *
 * @example
 * parsePrimitiveBgPath('color.primary.500')  // → { scale: 'primary', shade: 500 }
 * parsePrimitiveBgPath('color.bg.surface')   // → null (semantic, not primitive)
 */
function parsePrimitiveBgPath(bg: string | number): { scale: string; shade: number } | null {
    if (typeof bg !== 'string') return null
    const parts = bg.split('.')
    // Accept short form "{scale}.{shade}" (e.g. 'primary.500') and the tolerant
    // full form "color.{scale}.{shade}". Semantic paths (e.g. 'bg.surface',
    // 'text.primary') fall out because their last segment isn't a valid shade.
    let scale: string
    let shadeStr: string
    if (parts.length === 2) {
        ;[scale, shadeStr] = parts
    } else if (parts.length === 3 && parts[0] === 'color') {
        scale = parts[1]
        shadeStr = parts[2]
    } else {
        return null
    }
    const shade = parseInt(shadeStr, 10)
    if (!SHADES.includes(shade as Shade)) return null
    return { scale, shade }
}

// ─── Hover bg resolution ──────────────────────────────────────────────────────

/**
 * Resolves the auto hover background colour based on:
 * - `bg`         — current background token path
 * - `hoverScale` — name of a primitive colour scale (e.g. 'primary'), or false to disable
 * - `hoverShade` — explicit shade (50–900); if omitted, auto-steps one darker from bg shade
 *
 * Priority:
 *   1. hoverScale=false                       → undefined (disabled)
 *   2. hoverScale + hoverShade                → tokens.primitive.color[hoverScale][hoverShade]
 *   3. hoverScale + primitive bg path         → step bg shade on hoverScale
 *   4. hoverScale (no bg)                     → step 500 on hoverScale
 *   5. primitive bg path (no hoverScale)      → auto-detect scale and step
 *   6. semantic bg or no bg, no hoverScale    → undefined
 */
export function resolveHoverBg(
    bg: string | number | undefined,
    hoverScale: string | false | undefined,
    hoverShade: number | undefined,
    tokens: BurrowTokens,
    _mode: ColorMode,
): string | undefined {
    // Explicitly disabled
    if (hoverScale === false) return undefined

    // Explicit scale + explicit shade
    if (hoverScale && hoverShade !== undefined) {
        return tokens.primitive.color[hoverScale]?.[hoverShade] as string | undefined
    }

    // Explicit scale — auto-step
    if (hoverScale) {
        const parsed = bg !== undefined ? parsePrimitiveBgPath(bg) : null
        const currentShade = parsed?.shade ?? 500
        const nextShade = stepShade(currentShade)
        return tokens.primitive.color[hoverScale]?.[nextShade] as string | undefined
    }

    // Auto-detect from primitive bg path
    if (bg !== undefined) {
        const parsed = parsePrimitiveBgPath(bg)
        if (!parsed) return undefined
        const nextShade = stepShade(parsed.shade)
        return tokens.primitive.color[parsed.scale]?.[nextShade] as string | undefined
    }

    return undefined
}

// ─── Pseudo style builders ────────────────────────────────────────────────────

export type ResolvedPseudoStyles = Record<string, Record<string, string | number | undefined>>

/**
 * Builds resolved style objects for each pseudo state on a box (Chamber).
 *
 * Returns an object with keys: hover | focus | active | focusVisible | disabled
 * Only keys that have at least one style are included.
 *
 * The hover key also incorporates any auto hover bg from `bg` / `hoverScale` / `hoverShade`.
 */
export function buildPseudoStyles(
    props: PseudoBoxProps & { bg?: RV },
    tokens: BurrowTokens,
    mode: ColorMode,
): ResolvedPseudoStyles {
    const { _hover, _focus, _active, _focusVisible, _disabled, hoverScale, hoverShade, bg } = props
    const result: ResolvedPseudoStyles = {}

    // Resolve auto hover bg — only for plain string/number bg values (not responsive objects)
    const plainBg = typeof bg === 'object' ? undefined : bg
    const autoBg = resolveHoverBg(plainBg, hoverScale, hoverShade, tokens, mode)
    const hoverInput: BurrowBoxVisualProps = {
        ...(_hover ?? {}),
        ...(!_hover?.bg && autoBg ? { bg: autoBg } : {}),
    }
    if (Object.keys(hoverInput).length > 0) {
        result.hover = buildBoxStyles(hoverInput, tokens, mode)
    }

    if (_focus && Object.keys(_focus).length > 0) {
        result.focus = buildBoxStyles(_focus, tokens, mode)
    }
    if (_active && Object.keys(_active).length > 0) {
        result.active = buildBoxStyles(_active, tokens, mode)
    }
    if (_focusVisible && Object.keys(_focusVisible).length > 0) {
        result.focusVisible = buildBoxStyles(_focusVisible, tokens, mode)
    }
    if (_disabled && Object.keys(_disabled).length > 0) {
        result.disabled = buildBoxStyles(_disabled, tokens, mode)
    }

    return result
}

/**
 * Builds resolved style objects for each pseudo state on a text element (Tunnel).
 * Same shape as buildPseudoStyles but uses buildTextStyles internally.
 */
export function buildTextPseudoStyles(
    props: PseudoTextProps,
    tokens: BurrowTokens,
    mode: ColorMode,
): ResolvedPseudoStyles {
    const { _hover, _focus, _active, _focusVisible, _disabled } = props
    const result: ResolvedPseudoStyles = {}

    if (_hover && Object.keys(_hover).length > 0) {
        result.hover = buildTextStyles(_hover as BurrowTextVisualProps, tokens, mode)
    }
    if (_focus && Object.keys(_focus).length > 0) {
        result.focus = buildTextStyles(_focus as BurrowTextVisualProps, tokens, mode)
    }
    if (_active && Object.keys(_active).length > 0) {
        result.active = buildTextStyles(_active as BurrowTextVisualProps, tokens, mode)
    }
    if (_focusVisible && Object.keys(_focusVisible).length > 0) {
        result.focusVisible = buildTextStyles(_focusVisible as BurrowTextVisualProps, tokens, mode)
    }
    if (_disabled && Object.keys(_disabled).length > 0) {
        result.disabled = buildTextStyles(_disabled as BurrowTextVisualProps, tokens, mode)
    }

    return result
}
