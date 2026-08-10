/**
 * FNV-1a 32-bit hash — fast, stable, non-cryptographic.
 *
 * Used to generate short unique className suffixes from serialised
 * prop combinations, e.g. { p: 4, mt: 2 } → "bb-3kqx9a"
 *
 * Algorithm:
 *   1. Start with the FNV offset basis
 *   2. For each byte: XOR with the hash, then multiply by the FNV prime
 *   3. Keep everything in unsigned 32-bit integer space
 *   4. Return as a base-36 string for compact, URL-safe output
 */

const FNV_OFFSET_BASIS = 2166136261
const FNV_PRIME = 16777619

/**
 * Hash a string to a compact base-36 string.
 *
 * @example
 * fnv1a('p:4|mt:2')   // → "3kqx9a"
 * fnv1a('')            // → "2p0u5n" (hash of empty string — not empty string)
 * fnv1a('p:4|mt:2')   // → same result every time (stable)
 */
export function fnv1a(str: string): string {
    let hash = FNV_OFFSET_BASIS

    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i)
        // Multiply by FNV prime in true 32-bit space. Math.imul avoids the
        // float64 precision loss of `hash * FNV_PRIME` (whose product exceeds
        // 2^53 for most inputs), keeping the hash a faithful FNV-1a with full
        // 32-bit distribution — so distinct style combos don't collide onto the
        // same className (which would silently drop the second one's styles).
        hash = Math.imul(hash, FNV_PRIME) >>> 0
    }

    return hash.toString(36)
}

/**
 * Generate a full BadgerBurrow className from a serialised prop string.
 * Prefixes with "bb-" to namespace it away from user classes.
 *
 * @example
 * toClassName('p:4|mt:2')  // → "bb-3kqx9a"
 */
export function toClassName(key: string): string {
    return `bb-${fnv1a(key)}`
}
