import type { BurrowTokens } from '@badger-eco/burrow-tokens'
import { resolveToken } from './resolver'
import type { ColorMode } from './resolver'

type StyleValue = string | number

/** A single variant definition — prop names mapped to token paths or raw values */
type VariantStyles = Record<string, StyleValue>

/** Map of variant key → style definition */
type VariantMap<K extends string> = Record<K, VariantStyles>

/** Resolved style object — same shape as the definition but with token paths replaced by values */
type ResolvedStyles<S extends VariantStyles> = { [K in keyof S]: StyleValue }

/**
 * Define a set of named style variants backed by token paths or raw values.
 * Returns a resolver function you call with a key + tokens to get a plain
 * style object ready to spread.
 *
 * Token paths are resolved via `resolveToken` — semantic paths are
 * mode-aware, primitive paths resolve directly.
 * Unresolvable paths are returned as-is so nothing silently breaks.
 *
 * @example
 * const size = createVariants({
 *   sm: { padding: 'space.2', fontSize: 'fontSize.sm' },
 *   md: { padding: 'space.4', fontSize: 'fontSize.md' },
 *   lg: { padding: 'space.6', fontSize: 'fontSize.lg' },
 * })
 *
 * // In a component:
 * const styles = size('md', tokens, mode)
 * // → { padding: 16, fontSize: 14 }
 */
export function createVariants<K extends string>(
    map: VariantMap<K>
): (key: K, tokens: BurrowTokens, mode?: ColorMode) => ResolvedStyles<VariantStyles> {
    return function resolve(key, tokens, mode = 'light') {
        const definition = map[key]
        if (!definition) return {}

        const result: Record<string, StyleValue> = {}

        for (const [prop, value] of Object.entries(definition)) {
            if (typeof value === 'number') {
                result[prop] = value
                continue
            }

            // Attempt token resolution — fall back to raw value if nothing resolves
            const resolved = resolveToken(value, tokens, mode)
            result[prop] = resolved !== undefined ? resolved : value
        }

        return result
    }
}
