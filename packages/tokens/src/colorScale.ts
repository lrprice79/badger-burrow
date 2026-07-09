import type { PrimitiveColorScale } from './schema'

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch'

export interface GenerateScaleOptions {
  anchor?: number
  format?: ColorFormat
}

const VALID_ANCHORS = new Set([50, 100, 200, 300, 400, 500, 600, 700, 800, 900])

// Lightness targets in OKLCH (0–1) for each shade key.
// 50 is near-white, 900 is near-black. These are tuned to produce
// perceptually even steps matching well-known design system scales.
const LIGHTNESS_MAP: Record<number, number> = {
  50:  0.975,
  100: 0.940,
  200: 0.880,
  300: 0.790,
  400: 0.700,
  500: 0.600,
  600: 0.510,
  700: 0.420,
  800: 0.320,
  900: 0.230,
}

// ─── Colour conversion math ───────────────────────────────────────────────────

/**
 * Normalise a hex colour string to a lowercase 6-digit body (no `#`).
 * Accepts `#rgb` / `rgb` shorthand (expanded by doubling each nibble),
 * `#rrggbb` / `rrggbb`, with or without the leading `#` and any surrounding
 * whitespace. Throws a clear error on anything else.
 *
 * @example
 * normalizeHex('#f0a')      // → 'ff00aa'
 * normalizeHex('  744577 ') // → '744577'
 */
export function normalizeHex(hex: string): string {
  const clean = hex.trim().replace(/^#/, '').toLowerCase()
  if (/^[0-9a-f]{3}$/.test(clean)) {
    return clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
  }
  if (/^[0-9a-f]{6}$/.test(clean)) return clean
  throw new Error(`BadgerBurrow: invalid hex colour "${hex}". Expected #rgb or #rrggbb format.`)
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = normalizeHex(hex)
  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ]
}

function linearise(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function delinearise(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  // sRGB → linear RGB
  const lr = linearise(r)
  const lg = linearise(g)
  const lb = linearise(b)

  // linear RGB → XYZ (D65)
  const x = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const y = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const z = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  // XYZ → Oklab cube-root compression
  const l_ = Math.cbrt(x)
  const m_ = Math.cbrt(y)
  const s_ = Math.cbrt(z)

  // Oklab
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bOk = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

  // Oklab → OKLCH
  const C = Math.sqrt(a * a + bOk * bOk)
  const H = (Math.atan2(bOk, a) * 180) / Math.PI
  return [L, C, H < 0 ? H + 360 : H]
}

function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  // OKLCH → Oklab
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  // Oklab → XYZ
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const lc = l_ * l_ * l_
  const mc = m_ * m_ * m_
  const sc = s_ * s_ * s_

  // XYZ → linear RGB
  const lr =  4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc
  const lg = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc
  const lb = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc

  // linear RGB → sRGB, clamped
  return [
    Math.max(0, Math.min(1, delinearise(lr))),
    Math.max(0, Math.min(1, delinearise(lg))),
    Math.max(0, Math.min(1, delinearise(lb))),
  ]
}

// ─── Format converters ────────────────────────────────────────────────────────

function toHex(r: number, g: number, b: number): string {
  const ch = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0')
  return `#${ch(r)}${ch(g)}${ch(b)}`
}

function toRgb(r: number, g: number, b: number): string {
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function toHsl(r: number, g: number, b: number): string {
  const [h, s, l] = rgbToHsl(r, g, b)
  return `hsl(${h}, ${s}%, ${l}%)`
}

function toOklch(L: number, C: number, H: number): string {
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateScale(
  hex: string,
  options: GenerateScaleOptions = {}
): PrimitiveColorScale {
  const { anchor = 500, format = 'hex' } = options

  if (!VALID_ANCHORS.has(anchor)) {
    throw new Error(
      `BadgerBurrow: invalid anchor "${anchor}". Must be one of: ${[...VALID_ANCHORS].join(', ')}.`
    )
  }

  const [r, g, b] = hexToRgb(hex)
  const [L, C, H] = rgbToOklch(r, g, b)

  // Determine the lightness offset: shift the whole scale so the anchor
  // shade's lightness target aligns with the input colour's actual lightness.
  const anchorTarget = LIGHTNESS_MAP[anchor]
  const lightnessOffset = L - anchorTarget

  const scale: PrimitiveColorScale = {}

  for (const shade of VALID_ANCHORS) {
    const targetL = Math.max(0, Math.min(1, LIGHTNESS_MAP[shade] + lightnessOffset))
    const [sr, sg, sb] = oklchToRgb(targetL, C, H)

    let value: string
    switch (format) {
      case 'rgb':
        value = toRgb(sr, sg, sb)
        break
      case 'hsl':
        value = toHsl(sr, sg, sb)
        break
      case 'oklch':
        value = toOklch(targetL, C, H)
        break
      default:
        value = toHex(sr, sg, sb)
    }

    scale[shade] = value
  }

  return scale
}
