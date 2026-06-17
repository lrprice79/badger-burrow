import { generateScale, generateHarmonics } from '@purple-brock/burrow-tokens'
import type { PrimitiveColorScale } from '@purple-brock/burrow-tokens'
import { extendBurrow, BadgerBase } from '@purple-brock/burrow-core'
import type { ColorMode } from '@purple-brock/burrow-core'

/**
 * Storybook themes — each is a single brand hex plus a colour-harmony strategy.
 * This mirrors the SETUP-GUIDE's recommended setup: build a coordinated palette
 * from one hex with `generateScale` + `generateHarmonics`, then let the default
 * semantic tokens (which reference `{color.primary.*}` / `{color.secondary.*}`)
 * cascade — so interactive, surface and border colours all follow automatically.
 */

export type Harmony = 'complementary' | 'analogous' | 'triadic' | 'splitComplementary'

export interface BurrowTheme {
    key: string
    title: string
    /** Brand hex — becomes the `primary` scale (also the base for the Harmonics story) */
    base: string
    /** How the `secondary` scale is derived from the base via generateHarmonics */
    harmony?: Harmony
    /** When true, apply the shipped BadgerBurrow defaults unchanged (no regeneration) */
    defaults?: boolean
}

export const THEMES: BurrowTheme[] = [
    { key: 'default', title: 'BadgerBurrow defaults', base: '#8B5CF6', defaults: true },
    { key: 'badger', title: 'Badger · complementary', base: '#8B5CF6', harmony: 'complementary' },
    { key: 'ocean', title: 'Ocean · analogous', base: '#0EA5E9', harmony: 'analogous' },
    { key: 'forest', title: 'Forest · complementary', base: '#16A34A', harmony: 'complementary' },
    { key: 'sunset', title: 'Sunset · analogous', base: '#F97316', harmony: 'analogous' },
    { key: 'berry', title: 'Berry · triadic', base: '#DB2777', harmony: 'triadic' },
    { key: 'royal', title: 'Royal · split-complementary', base: '#4F46E5', harmony: 'splitComplementary' },
    { key: 'rose', title: 'Rose · triadic', base: '#F43F5E', harmony: 'triadic' },
    { key: 'mono', title: 'Mono · analogous', base: '#64748B', harmony: 'analogous' },
]

export function getTheme(key: string): BurrowTheme {
    return THEMES.find((t) => t.key === key) ?? THEMES[0]
}

/** Derive the `secondary` scale from the base hex using the theme's harmony. */
function secondaryScale(theme: BurrowTheme): PrimitiveColorScale {
    const h = generateHarmonics(theme.base)
    switch (theme.harmony) {
        case 'analogous':
            return h.analogous[1] as PrimitiveColorScale
        case 'triadic':
            return h.triadic[0] as PrimitiveColorScale
        case 'splitComplementary':
            return h.splitComplementary[0] as PrimitiveColorScale
        case 'complementary':
        default:
            return h.complementary as PrimitiveColorScale
    }
}

/**
 * Apply a theme + mode to the global store — exactly the shape an app would use
 * at entry. Regenerates the `primary` and (harmonic) `secondary` scales; the
 * semantic layer cascades, so no per-token wiring is needed.
 *
 * The `default` theme passes an empty override, which resets the store to the
 * shipped BadgerBurrow defaults (violet primary + teal secondary).
 */
export function applyTheme(themeKey: string, mode: ColorMode): void {
    const theme = getTheme(themeKey)
    extendBurrow(
        theme.defaults
            ? {}
            : {
                  primitive: {
                      color: {
                          primary: generateScale(theme.base),
                          secondary: secondaryScale(theme),
                      },
                  },
              },
    )
    BadgerBase.setMode(mode)
}
