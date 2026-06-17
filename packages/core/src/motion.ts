import type { BurrowTokens } from '@purple-brock/burrow-tokens'

/**
 * Motion token resolution for the `transition` / `animation` props.
 *
 * Lets you write motion-token keywords instead of raw CSS:
 *   transition="fast"                 → 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)'
 *   transitionDuration="fast"         → '150ms'
 *   transitionTimingFunction="sharp"  → 'cubic-bezier(0.4, 0, 0.6, 1)'
 *
 * Anything that isn't a known token key is passed through untouched, so raw CSS
 * (`transition="opacity 0.2s ease"`, `transitionDuration="200ms"`) still works.
 */

/**
 * Resolve a duration token key (`fast`, `normal`, …) to a `Nms` string.
 * A raw number becomes `${n}ms`; an existing CSS time string passes through.
 */
export function resolveDuration(
    value: string | number,
    tokens: BurrowTokens,
): string {
    if (typeof value === 'number') return `${value}ms`

    const ms = tokens.motion.duration[value]
    if (ms !== undefined) return `${ms}ms`

    return value
}

/**
 * Resolve an easing token key (`standard`, `decelerate`, …) to its timing
 * function. Unknown values (raw keywords, `cubic-bezier(…)`) pass through.
 */
export function resolveEasing(value: string, tokens: BurrowTokens): string {
    const easing = tokens.motion.easing[value]
    return easing !== undefined ? easing : value
}

/**
 * Resolve the `transition` shorthand. A bare duration token key expands to a
 * sensible `all <duration> <standard easing>` shorthand; any other string
 * (already a full transition declaration) passes through unchanged.
 */
export function resolveTransition(value: string, tokens: BurrowTokens): string {
    const ms = tokens.motion.duration[value]
    if (ms === undefined) return value

    const easing = tokens.motion.easing.standard
    return easing !== undefined ? `all ${ms}ms ${easing}` : `all ${ms}ms`
}
