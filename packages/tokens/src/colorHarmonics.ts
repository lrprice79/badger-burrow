import type { PrimitiveColorScale } from './schema'
import { generateScale, hexToRgb, type ColorFormat } from './colorScale'

export interface HarmonicsOptions {
  scales?: boolean
  anchor?: number
  format?: ColorFormat
}

type ScaleOrHex<S extends boolean> = S extends false ? string : PrimitiveColorScale

export interface HarmonicsResult<S extends boolean = true> {
  complementary: ScaleOrHex<S>
  analogous: ScaleOrHex<S>[]
  triadic: ScaleOrHex<S>[]
  splitComplementary: ScaleOrHex<S>[]
  tetradic: ScaleOrHex<S>[]
}

// ─── Internal OKLCH utilities (hex parsing shared from colorScale.ts) ──────────

function linearise(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function delinearise(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lr = linearise(r)
  const lg = linearise(g)
  const lb = linearise(b)

  const x = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const y = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const z = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l_ = Math.cbrt(x)
  const m_ = Math.cbrt(y)
  const s_ = Math.cbrt(z)

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bOk = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

  const C = Math.sqrt(a * a + bOk * bOk)
  const H = (Math.atan2(bOk, a) * 180) / Math.PI
  return [L, C, H < 0 ? H + 360 : H]
}

function oklchToHex(L: number, C: number, H: number): string {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const lc = l_ * l_ * l_
  const mc = m_ * m_ * m_
  const sc = s_ * s_ * s_

  const lr =  4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc
  const lg = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc
  const lb = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc

  const r = Math.max(0, Math.min(1, delinearise(lr)))
  const g = Math.max(0, Math.min(1, delinearise(lg)))
  const bl = Math.max(0, Math.min(1, delinearise(lb)))

  const ch = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0')
  return `#${ch(r)}${ch(g)}${ch(bl)}`
}

function rotateHue(H: number, degrees: number): number {
  return (H + degrees) % 360
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateHarmonics(
  hex: string,
  options: HarmonicsOptions = {}
): HarmonicsResult<boolean> {
  const { scales = true, anchor = 500, format = 'hex' } = options

  const [r, g, b] = hexToRgb(hex)
  const [L, C, H] = rgbToOklch(r, g, b)

  const hues = {
    complementary:      [rotateHue(H, 180)],
    analogous:          [rotateHue(H, 30),  rotateHue(H, -30)],
    triadic:            [rotateHue(H, 120), rotateHue(H, 240)],
    splitComplementary: [rotateHue(H, 150), rotateHue(H, 210)],
    tetradic:           [rotateHue(H, 90),  rotateHue(H, 180), rotateHue(H, 270)],
  }

  function toOutput(hue: number): string | PrimitiveColorScale {
    const rotatedHex = oklchToHex(L, C, hue)
    if (!scales) return rotatedHex
    return generateScale(rotatedHex, { anchor, format })
  }

  return {
    complementary:      toOutput(hues.complementary[0]),
    analogous:          hues.analogous.map(toOutput),
    triadic:            hues.triadic.map(toOutput),
    splitComplementary: hues.splitComplementary.map(toOutput),
    tetradic:           hues.tetradic.map(toOutput),
  }
}
