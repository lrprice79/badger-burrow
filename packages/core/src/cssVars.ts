import type { BurrowTokens } from '@badger-burrow/tokens'
import { resolveToken } from './resolver'
import type { ColorMode } from './resolver'

/**
 * Convert a dot-separated token path or arbitrary string to a CSS custom
 * property name, prefixed with --badger-.
 *
 * @example
 * toCssVar('color.primary.500')        // → '--badger-color-primary-500'
 * toCssVar('color.interactive.primary') // → '--badger-color-interactive-primary'
 * toCssVar('space.4')                  // → '--badger-space-4'
 */
export function toCssVar(path: string): string {
    return `--badger-${path.replace(/\./g, '-')}`
}

/**
 * Flatten a nested object into dot-separated key → value pairs.
 *
 * @example
 * flattenObject({ color: { primary: { '500': '#744577' } } })
 * // → { 'color.primary.500': '#744577' }
 */
function flattenObject(
    obj: Record<string, unknown>,
    prefix = ''
): Record<string, string | number> {
    const result: Record<string, string | number> = {}

    for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value as Record<string, unknown>, path))
        } else if (typeof value === 'string' || typeof value === 'number') {
            result[path] = value
        }
        // Skip non-primitive values (arrays, nested objects that don't resolve)
    }

    return result
}

/**
 * Build a flat map of CSS var name → value for the entire token set.
 *
 * Includes:
 *   - All primitive tokens (colour scales, space, radius, typography…)
 *   - All resolved semantic tokens for the given mode
 *   - All motion tokens (duration, easing — not spring, which is for Reanimated)
 *
 * Shadow tokens are skipped — they have a web/native split and are handled
 * separately by the web package.
 *
 * @example
 * buildCssVarMap(tokens, 'light')
 * // → {
 * //   '--badger-color-primary-500': '#8B5CF6',
 * //   '--badger-space-4': 16,
 * //   '--badger-color-interactive-primary': '#8B5CF6',
 * //   '--badger-duration-fast': 150,
 * //   ...
 * // }
 */
export function buildCssVarMap(
    tokens: BurrowTokens,
    mode: ColorMode = 'light'
): Record<string, string | number> {
    const vars: Record<string, string | number> = {}

    // ── Primitive tokens (everything except shadow) ──────────────────────────
    const { shadow: _shadow, ...primitivesWithoutShadow } = tokens.primitive
    const flatPrimitives = flattenObject(
        primitivesWithoutShadow as unknown as Record<string, unknown>
    )
    for (const [path, value] of Object.entries(flatPrimitives)) {
        vars[toCssVar(path)] = value
    }

    // ── Semantic tokens (resolved for the current mode) ───────────────────────
    for (const path of Object.keys(tokens.semantic[mode])) {
        const resolved = resolveToken(path, tokens, mode)
        if (resolved !== undefined) {
            vars[toCssVar(path)] = resolved
        }
    }

    // ── Motion tokens (duration + easing only — spring goes to Reanimated) ───
    const { spring: _spring, ...motionWithoutSpring } = tokens.motion
    const flatMotion = flattenObject(
        motionWithoutSpring as unknown as Record<string, unknown>
    )
    for (const [path, value] of Object.entries(flatMotion)) {
        vars[toCssVar(path)] = value
    }

    return vars
}

/**
 * Inject all token values as CSS custom properties on a DOM element.
 * Defaults to :root (document.documentElement).
 *
 * Safe to call multiple times — subsequent calls update existing vars in place.
 * No-op in non-browser environments (SSR safe).
 *
 * @example
 * injectCssVars(tokens, 'light')
 * // → sets --badger-* on :root
 *
 * injectCssVars(tokens, 'dark', document.getElementById('app'))
 * // → scoped to a specific element
 */
export function injectCssVars(
    tokens: BurrowTokens,
    mode: ColorMode = 'light',
    target?: HTMLElement
): void {
    if (typeof document === 'undefined') return

    const el = target ?? document.documentElement
    const vars = buildCssVarMap(tokens, mode)

    for (const [name, value] of Object.entries(vars)) {
        el.style.setProperty(name, String(value))
    }
}

/**
 * Remove all --badger-* custom properties from a DOM element.
 * Useful in tests or when unmounting a scoped theme.
 *
 * No-op in non-browser environments.
 */
export function removeCssVars(target?: HTMLElement): void {
    if (typeof document === 'undefined') return

    const el = target ?? document.documentElement
    const toRemove: string[] = []

    for (let i = 0; i < el.style.length; i++) {
        const prop = el.style.item(i)
        if (prop.startsWith('--badger-')) toRemove.push(prop)
    }

    for (const prop of toRemove) {
        el.style.removeProperty(prop)
    }
}
