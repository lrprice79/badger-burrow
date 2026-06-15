import type { PrimitiveColorScale, PrimitiveTokens, SemanticTokens } from './schema'
import { generateScale } from './colorScale'
import { generateHarmonics } from './colorHarmonics'

// generateTheme — one brand hex → a complete, AA-checked light + dark theme.
//
// Pure token generation: no React, no DOM. Returns a partial token set you pass
// straight to `extendBurrow()` once at app startup. Works identically with or
// without SSR — it just produces data; the SSR style registry is a separate
// concern. The default semantic layer cascades for everything not emitted here
// (backgrounds, text, borders, feedback all reference the scales we provide).
//
// The value it adds over raw `generateScale`: the interactive button shade and
// its label colour are picked per-brand so a button stays WCAG-AA readable for
// ANY hue — including light/warm brands (yellow, lime, cyan) where a white label
// would fail. For those, the label flips to dark rather than muddying the brand
// colour.

export type ThemeHarmony =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'splitComplementary'

export interface GenerateThemeOptions {
  /** How the secondary hue is derived from the brand. Default `complementary`. */
  harmony?: ThemeHarmony
  /** Explicit secondary brand hex — overrides `harmony`. */
  secondary?: string
  /** Seed for the neutral (surfaces/borders) scale. Default `#808080`. */
  neutral?: string
  /** Seed for the ink (text) scale. Default `#71717A`. */
  ink?: string
}

export interface GeneratedTheme {
  primitive: Pick<PrimitiveTokens, 'color'>
  semantic: SemanticTokens
}

const WHITE = '#ffffff'
const BLACK = '#111118'
const AA = 4.5
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']

// ─── WCAG contrast ──────────────────────────────────────────────────────────

function lin(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function lum(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(a: string, b: string): number {
  const la = lum(a)
  const lb = lum(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

// ─── Shade selection ──────────────────────────────────────────────────────────

// Pick the interactive shade + label. Keeps the brand at 600 whenever possible —
// only flipping the white label to dark for light brands — and goes darker only
// in the rare case neither label works at 600.
function pickInteractive(scale: PrimitiveColorScale): { shade: string; label: string } {
  if (contrast(scale['600'], WHITE) >= AA) return { shade: '600', label: WHITE }
  if (contrast(scale['600'], BLACK) >= AA) return { shade: '600', label: BLACK }
  for (const s of ['700', '800', '900']) {
    if (contrast(scale[s], WHITE) >= AA) return { shade: s, label: WHITE }
  }
  return { shade: '900', label: WHITE }
}

// Pick a secondary shade that meets AA with the SAME label as primary, so both
// buttons share one label colour.
function pickShadeFor(scale: PrimitiveColorScale, label: string): string {
  const order =
    label === WHITE
      ? ['600', '700', '800', '900']
      : ['600', '500', '400', '300', '200', '100', '50']
  for (const s of order) {
    if (contrast(scale[s], label) >= AA) return s
  }
  return label === WHITE ? '900' : '50'
}

// Hover steps two shades toward MORE contrast with the label: darker for a white
// label, lighter for a dark one.
function hoverShade(shade: string, label: string): string {
  const i = SHADES.indexOf(shade)
  const dir = label === WHITE ? 2 : -2
  return SHADES[Math.max(0, Math.min(SHADES.length - 1, i + dir))]
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function generateTheme(
  brand: string,
  options: GenerateThemeOptions = {}
): GeneratedTheme {
  const { harmony = 'complementary', secondary, neutral = '#808080', ink = '#71717A' } =
    options

  const primary = generateScale(brand)

  let secondaryScale: PrimitiveColorScale
  if (secondary) {
    secondaryScale = generateScale(secondary)
  } else {
    const harmonics = generateHarmonics(brand)
    const picked = harmonics[harmony]
    secondaryScale = (Array.isArray(picked) ? picked[0] : picked) as PrimitiveColorScale
  }

  const neutralScale = generateScale(neutral)
  const inkScale = generateScale(ink)

  const pri = pickInteractive(primary)
  const secShade = pickShadeFor(secondaryScale, pri.label)

  const interactive: Record<string, string> = {
    'color.interactive.primary': `{color.primary.${pri.shade}}`,
    'color.interactive.primary.hover': `{color.primary.${hoverShade(pri.shade, pri.label)}}`,
    'color.interactive.secondary': `{color.secondary.${secShade}}`,
    'color.interactive.secondary.hover': `{color.secondary.${hoverShade(secShade, pri.label)}}`,
    'color.text.inverse': pri.label,
  }

  return {
    primitive: {
      color: {
        primary,
        secondary: secondaryScale,
        neutral: neutralScale,
        ink: inkScale,
      },
    },
    // Interactive colours stay consistent across modes (B2): same brand shade and
    // label whether light or dark, so a button never flips identity on toggle.
    semantic: {
      light: { ...interactive },
      dark: { ...interactive },
    },
  }
}
