import type { BurrowTokens } from '@purple-brock/burrow-tokens'

export type ColorMode = 'light' | 'dark'

/** Matches {color.primary.500} style references */
const REFERENCE_RE = /^\{([^}]+)\}$/

/**
 * Walk a nested object by dot-separated path segments.
 * Returns the value at that path, or undefined if not found.
 *
 * @example
 * walkPath({ color: { primary: { '500': '#744577' } } }, ['color', 'primary', '500'])
 * // → '#744577'
 */
function walkPath(obj: Record<string, unknown>, segments: string[]): unknown {
    let current: unknown = obj
    for (const seg of segments) {
        if (current == null || typeof current !== 'object') return undefined
        current = (current as Record<string, unknown>)[seg]
    }
    return current
}

/**
 * Resolve a primitive reference string like "{color.primary.500}" against
 * the primitive token tree. Returns the raw value or undefined if not found.
 *
 * @example
 * resolvePrimitive('{color.primary.500}', tokens)  // → '#744577'
 * resolvePrimitive('{space.4}', tokens)             // → 16
 */
export function resolvePrimitive(
    ref: string,
    tokens: BurrowTokens
): string | number | undefined {
    const match = ref.match(REFERENCE_RE)
    if (!match) return undefined

    const segments = match[1].split('.')
    const value = walkPath(tokens.primitive as unknown as Record<string, unknown>, segments)

    if (typeof value === 'string' || typeof value === 'number') return value
    return undefined
}

/**
 * Resolve a semantic token path to its final raw value.
 *
 * Resolution order:
 *   1. Look up path in semantic[mode]
 *   2a. If value is a {reference} → resolve against primitive
 *   2b. If value is a raw string (hex, rgba, etc.) → return as-is
 *   3. If not in semantic → try resolving directly against primitive
 *
 * Returns undefined if the path cannot be resolved.
 *
 * @example
 * resolveToken('color.interactive.primary', tokens, 'light')
 * // → '#8B5CF6'  (via semantic → {color.primary.500} → primitive)
 *
 * resolveToken('color.bg.elevated', tokens, 'light')
 * // → '#ffffff'  (raw value in semantic, returned directly)
 *
 * resolveToken('space.4', tokens, 'light')
 * // → 16  (direct primitive lookup)
 */
export function resolveToken(
    path: string,
    tokens: BurrowTokens,
    mode: ColorMode = 'light'
): string | number | undefined {
    // An unknown mode falls back to light rather than throwing on `semantic[mode]`.
    const semanticValue = (tokens.semantic[mode] ?? tokens.semantic.light)[path]

    if (semanticValue !== undefined) {
        // It's a {reference} — resolve against primitive
        if (REFERENCE_RE.test(semanticValue)) {
            return resolvePrimitive(semanticValue, tokens)
        }
        // It's a raw value — return directly
        return semanticValue
    }

    // Not in semantic — try primitive directly
    const segments = path.split('.')
    const primitiveValue = walkPath(
        tokens.primitive as unknown as Record<string, unknown>,
        segments
    )

    if (typeof primitiveValue === 'string' || typeof primitiveValue === 'number') {
        return primitiveValue
    }

    return undefined
}

// ─── scoped (short-form) resolution ───────────────────────────────────────────

const _warnedPrefixes = new Set<string>()

/**
 * Dev-only nudge when a value carries the redundant category prefix the prop
 * already implies (e.g. `p="space.4"` instead of `p="4"`). Fires once per unique
 * value, only when NODE_ENV === 'development' (silent in test and production).
 */
function warnRedundantPrefix(category: string, value: string): void {
    // Read NODE_ENV via globalThis so core needs no node types (it targets the
    // browser / React Native).
    const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } })
        .process?.env?.NODE_ENV
    if (env !== 'development') return
    const key = `${category}|${value}`
    if (_warnedPrefixes.has(key)) return
    _warnedPrefixes.add(key)
    const short = value.slice(category.length + 1)
    // eslint-disable-next-line no-console
    console.warn(
        `[BadgerBurrow] "${value}" has a redundant "${category}." prefix — ` +
        `the prop already implies it. Write "${short}" instead.`,
    )
}

/**
 * Resolve a short-form token value within a category. The prop name supplies the
 * category, so the value omits it — `resolveScoped('space', '4', …)` resolves
 * `space.4`, `resolveScoped('color', 'text.primary', …)` resolves
 * `color.text.primary`.
 *
 * Tolerant of a redundant full prefix (`'space.4'`) for back-compat, but nudges
 * in development. Unresolvable values (raw CSS like `'#fff'`, `'100%'`) pass
 * through unchanged.
 */
export function resolveScoped(
    category: string,
    value: string,
    tokens: BurrowTokens,
    mode: ColorMode = 'light',
): string | number | undefined {
    let path: string
    if (value.startsWith(`${category}.`)) {
        warnRedundantPrefix(category, value)
        path = value
    } else {
        path = `${category}.${value}`
    }

    const resolved = resolveToken(path, tokens, mode)
    if (resolved === undefined && TOKEN_PATH_RE.test(value)) warnUnknownToken(category, value)
    return resolved !== undefined ? resolved : value
}

/** A dotted identifier like "text.primary" — looks like a token path, not raw CSS. */
const TOKEN_PATH_RE = /^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$/
const _warnedUnknown = new Set<string>()

/** Dev-only, once per value: a token path that resolves to nothing is almost always a typo, and
 * would otherwise be passed through as an invalid CSS value (a red-box colour error on native). */
function warnUnknownToken(category: string, value: string): void {
    const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } })
        .process?.env?.NODE_ENV
    if (env !== 'development') return
    const key = `${category}|${value}`
    if (_warnedUnknown.has(key)) return
    _warnedUnknown.add(key)
    // eslint-disable-next-line no-console
    console.warn(
        `[BadgerBurrow] Unknown ${category} token "${value}" — no such token, so it was passed ` +
        `through as a raw value. Check for a typo.`,
    )
}
