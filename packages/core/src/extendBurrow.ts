import { defaultTokens } from '@purple-brock/burrow-tokens'
import type { BurrowTokens } from '@purple-brock/burrow-tokens'
import { BadgerBase } from './store'

type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

/**
 * Deep-merge a partial token override onto defaultTokens, store the result
 * in BadgerBase, and return the merged token set.
 *
 * - Never mutates defaultTokens
 * - Subsequent calls always merge against defaultTokens (not the previous result)
 * - Notifies all BadgerBase subscribers after the merge
 *
 * @example
 * // BadgerBudget entry file
 * extendBurrow({
 *   primitive: { color: { primary: { 500: '#744577' } } },
 * })
 */
export function extendBurrow(override: DeepPartial<BurrowTokens>): BurrowTokens {
    const merged = deepMerge(defaultTokens, override) as BurrowTokens
    BadgerBase.setTokens(merged)
    return merged
}

/**
 * Deep-merge a partial token override onto the CURRENT token set (not
 * defaultTokens). Use this for layering — e.g. the app sets its brand with
 * extendBurrow, then a feature module adds its own tokens with mergeBurrow
 * without wiping the brand.
 *
 * Runs the same one-shot deep merge as extendBurrow — call-time cost only,
 * zero per-render overhead.
 *
 * @example
 * extendBurrow({ primitive: { color: { primary: brandScale } } })   // app entry
 * mergeBurrow({ primitive: { color: { chartAccent: accentScale } } }) // feature module
 */
export function mergeBurrow(override: DeepPartial<BurrowTokens>): BurrowTokens {
    const merged = deepMerge(BadgerBase.getTokens(), override) as BurrowTokens
    BadgerBase.setTokens(merged)
    return merged
}

function deepMerge<T>(base: T, override: DeepPartial<T>): T {
    if (
        override === null ||
        override === undefined ||
        typeof override !== 'object' ||
        Array.isArray(override)
    ) {
        return override as unknown as T ?? base
    }

    const result = { ...base } as Record<string, unknown>

    for (const key of Object.keys(override as object)) {
        const baseVal = (base as Record<string, unknown>)[key]
        const overrideVal = (override as Record<string, unknown>)[key]

        if (
            overrideVal !== null &&
            overrideVal !== undefined &&
            typeof overrideVal === 'object' &&
            !Array.isArray(overrideVal) &&
            typeof baseVal === 'object' &&
            baseVal !== null &&
            !Array.isArray(baseVal)
        ) {
            result[key] = deepMerge(baseVal, overrideVal as DeepPartial<typeof baseVal>)
        } else if (overrideVal !== undefined) {
            result[key] = overrideVal
        }
    }

    return result as T
}
