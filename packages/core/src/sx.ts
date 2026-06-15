import type { BurrowTokens } from '@badger-eco/burrow-tokens'
import { resolveToken } from './resolver'
import type { ColorMode } from './resolver'

/** A token-aware style object — any CSS property, values can be token paths */
export type SxProp = Record<string, string | number>

const UNITLESS_PROPS = new Set([
    'opacity',
    'flex',
    'flexGrow',
    'flexShrink',
    'zIndex',
    'fontWeight',
    'lineHeight',
    'order',
    'tabSize',
    'orphans',
    'widows',
    'scale',
    'rotate',
    'fillOpacity',
    'strokeOpacity',
    'strokeWidth',
])

function withPx(prop: string, value: string | number): string | number {
    if (typeof value === 'string') return value
    return UNITLESS_PROPS.has(prop) ? value : `${value}px`
}

/**
 * Resolve an sx object — each value is attempted as a token path first,
 * then returned as-is if unresolvable. Numbers get px appended unless
 * the property is known to be unitless.
 *
 * @example
 * resolveSx({ padding: 'space.4', cursor: 'pointer' }, tokens, 'light')
 * // → { padding: '16px', cursor: 'pointer' }
 */
export function resolveSx(
    sx: SxProp,
    tokens: BurrowTokens,
    mode: ColorMode = 'light'
): Record<string, string | number> {
    const result: Record<string, string | number> = {}

    for (const [prop, value] of Object.entries(sx)) {
        if (typeof value === 'number') {
            result[prop] = withPx(prop, value)
            continue
        }

        const resolved = resolveToken(value, tokens, mode)
        if (resolved !== undefined) {
            result[prop] = withPx(prop, resolved)
        } else {
            result[prop] = value
        }
    }

    return result
}
