import type { BurrowTokens } from '@badger-burrow/tokens'

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
    const semanticValue = tokens.semantic[mode][path]

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
