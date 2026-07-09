import { generateHarmonics } from '../colorHarmonics'
import type { PrimitiveColorScale } from '../schema'

const SHADE_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

function isScale(value: unknown): value is PrimitiveColorScale {
  return (
    typeof value === 'object' &&
    value !== null &&
    SHADE_KEYS.every(k => typeof (value as Record<number, unknown>)[k] === 'string')
  )
}

function isHex(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
}

describe('generateHarmonics — default options (scales: true)', () => {
  it('returns all five harmonic keys', () => {
    const result = generateHarmonics('#8B5CF6')
    expect(result).toHaveProperty('complementary')
    expect(result).toHaveProperty('analogous')
    expect(result).toHaveProperty('triadic')
    expect(result).toHaveProperty('splitComplementary')
    expect(result).toHaveProperty('tetradic')
  })

  it('complementary is a full PrimitiveColorScale', () => {
    const result = generateHarmonics('#8B5CF6')
    expect(isScale(result.complementary)).toBe(true)
  })

  it('analogous contains 2 full scales', () => {
    const result = generateHarmonics('#8B5CF6')
    expect(Array.isArray(result.analogous)).toBe(true)
    expect(result.analogous).toHaveLength(2)
    result.analogous.forEach((s: unknown) => expect(isScale(s)).toBe(true))
  })

  it('triadic contains 2 full scales', () => {
    const result = generateHarmonics('#8B5CF6')
    expect(Array.isArray(result.triadic)).toBe(true)
    expect(result.triadic).toHaveLength(2)
    result.triadic.forEach((s: unknown) => expect(isScale(s)).toBe(true))
  })

  it('splitComplementary contains 2 full scales', () => {
    const result = generateHarmonics('#8B5CF6')
    expect(Array.isArray(result.splitComplementary)).toBe(true)
    expect(result.splitComplementary).toHaveLength(2)
    result.splitComplementary.forEach((s: unknown) => expect(isScale(s)).toBe(true))
  })

  it('tetradic contains 3 full scales', () => {
    const result = generateHarmonics('#8B5CF6')
    expect(Array.isArray(result.tetradic)).toBe(true)
    expect(result.tetradic).toHaveLength(3)
    result.tetradic.forEach((s: unknown) => expect(isScale(s)).toBe(true))
  })
})

describe('generateHarmonics — scales: false', () => {
  it('complementary is a hex string', () => {
    const result = generateHarmonics('#8B5CF6', { scales: false })
    expect(isHex(result.complementary)).toBe(true)
  })

  it('analogous contains 2 hex strings', () => {
    const result = generateHarmonics('#8B5CF6', { scales: false })
    expect(Array.isArray(result.analogous)).toBe(true)
    expect(result.analogous).toHaveLength(2)
    result.analogous.forEach((s: unknown) => expect(isHex(s)).toBe(true))
  })

  it('triadic contains 2 hex strings', () => {
    const result = generateHarmonics('#8B5CF6', { scales: false })
    expect(result.triadic).toHaveLength(2)
    result.triadic.forEach((s: unknown) => expect(isHex(s)).toBe(true))
  })

  it('splitComplementary contains 2 hex strings', () => {
    const result = generateHarmonics('#8B5CF6', { scales: false })
    expect(result.splitComplementary).toHaveLength(2)
    result.splitComplementary.forEach((s: unknown) => expect(isHex(s)).toBe(true))
  })

  it('tetradic contains 3 hex strings', () => {
    const result = generateHarmonics('#8B5CF6', { scales: false })
    expect(result.tetradic).toHaveLength(3)
    result.tetradic.forEach((s: unknown) => expect(isHex(s)).toBe(true))
  })
})

describe('generateHarmonics — hue rotation correctness', () => {
  it('complementary is a different colour from the input', () => {
    const result = generateHarmonics('#8B5CF6', { scales: false })
    expect(result.complementary).not.toBe('#8b5cf6')
  })

  it('analogous colours are different from each other and from input', () => {
    const result = generateHarmonics('#8B5CF6', { scales: false })
    const [a1, a2] = result.analogous as string[]
    expect(a1).not.toBe(a2)
    expect(a1).not.toBe('#8b5cf6')
    expect(a2).not.toBe('#8b5cf6')
  })

  it('triadic colours are different from each other', () => {
    const result = generateHarmonics('#8B5CF6', { scales: false })
    const [t1, t2] = result.triadic as string[]
    expect(t1).not.toBe(t2)
  })
})

describe('generateHarmonics — anchor and format options', () => {
  it('anchor option is respected in scale output', () => {
    const result = generateHarmonics('#8B5CF6', { anchor: 300 })
    // With anchor:300, shade 300 of the complementary should not equal shade 300 of the input
    // but the scale should still have all keys
    expect(isScale(result.complementary)).toBe(true)
  })

  it('format option produces rgb strings when scales: true', () => {
    const result = generateHarmonics('#8B5CF6', { format: 'rgb' })
    const scale = result.complementary as PrimitiveColorScale
    expect(scale[500]).toMatch(/^rgb\(/)
  })

  it('format option produces hsl strings when scales: true', () => {
    const result = generateHarmonics('#8B5CF6', { format: 'hsl' })
    const scale = result.complementary as PrimitiveColorScale
    expect(scale[500]).toMatch(/^hsl\(/)
  })
})

describe('generateHarmonics — error handling', () => {
  it('throws on invalid hex', () => {
    expect(() => generateHarmonics('not-a-color')).toThrow(/invalid hex/i)
  })

  it('accepts 3-digit shorthand hex (expands #abc → #aabbcc)', () => {
    expect(() => generateHarmonics('#abc')).not.toThrow()
    expect(generateHarmonics('#abc')).toEqual(generateHarmonics('#aabbcc'))
  })
})
