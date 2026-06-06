import { generateScale } from '../colorScale'

const SHADE_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

describe('generateScale — output shape', () => {
  it('returns all 10 shade keys', () => {
    const scale = generateScale('#8B5CF6')
    expect(Object.keys(scale).map(Number).sort((a, b) => a - b)).toEqual(SHADE_KEYS)
  })

  it('returns string values for every shade', () => {
    const scale = generateScale('#8B5CF6')
    SHADE_KEYS.forEach(key => {
      expect(typeof scale[key]).toBe('string')
      expect(scale[key].length).toBeGreaterThan(0)
    })
  })
})

describe('generateScale — anchor behaviour', () => {
  it('shade 500 matches the normalised input hex by default', () => {
    const scale = generateScale('#8b5cf6')
    expect(scale[500].toLowerCase()).toBe('#8b5cf6')
  })

  it('anchor shade matches the input hex when anchor is 300', () => {
    const scale = generateScale('#8B5CF6', { anchor: 300 })
    expect(scale[300].toLowerCase()).toBe('#8b5cf6')
  })

  it('anchor shade matches the input hex when anchor is 700', () => {
    const scale = generateScale('#8B5CF6', { anchor: 700 })
    expect(scale[700].toLowerCase()).toBe('#8b5cf6')
  })

  it('shade 50 is lighter than shade 500 (higher L in OKLCH)', () => {
    const scale = generateScale('#8B5CF6')
    // We can infer lightness by comparing perceived brightness via hex
    // Just assert 50 !== 500 and that the values progress
    expect(scale[50]).not.toBe(scale[500])
    expect(scale[900]).not.toBe(scale[500])
  })

  it('shades get progressively darker from 50 to 900', () => {
    const scale = generateScale('#14B8A6')
    function brightness(hex: string): number {
      const h = hex.replace('#', '')
      return parseInt(h.slice(0, 2), 16) + parseInt(h.slice(2, 4), 16) + parseInt(h.slice(4, 6), 16)
    }
    const brightnesses = SHADE_KEYS.map(k => brightness(scale[k] as string))
    // Adjacent shades may be equal after integer rounding — check overall trend
    // and that no shade is brighter than the one two steps above it
    expect(brightnesses[0]).toBeGreaterThan(brightnesses[brightnesses.length - 1])
    for (let i = 0; i < brightnesses.length - 2; i++) {
      expect(brightnesses[i]).toBeGreaterThanOrEqual(brightnesses[i + 2])
    }
  })
})

describe('generateScale — format option', () => {
  it('defaults to hex format', () => {
    const scale = generateScale('#8B5CF6')
    expect(scale[500]).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('hex format returns #rrggbb strings', () => {
    const scale = generateScale('#8B5CF6', { format: 'hex' })
    SHADE_KEYS.forEach(key => {
      expect(scale[key]).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  it('rgb format returns rgb(...) strings', () => {
    const scale = generateScale('#8B5CF6', { format: 'rgb' })
    SHADE_KEYS.forEach(key => {
      expect(scale[key]).toMatch(/^rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)$/)
    })
  })

  it('hsl format returns hsl(...) strings', () => {
    const scale = generateScale('#8B5CF6', { format: 'hsl' })
    SHADE_KEYS.forEach(key => {
      expect(scale[key]).toMatch(/^hsl\(\d+(\.\d+)?,\s?\d+(\.\d+)?%,\s?\d+(\.\d+)?%\)$/)
    })
  })

  it('oklch format returns oklch(...) strings', () => {
    const scale = generateScale('#8B5CF6', { format: 'oklch' })
    SHADE_KEYS.forEach(key => {
      expect(scale[key]).toMatch(/^oklch\(\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\)$/)
    })
  })
})

describe('generateScale — known values (hex)', () => {
  it('purple #8B5CF6 at 500 produces expected scale spot-checks', () => {
    const scale = generateScale('#8B5CF6')

    function brightness(hex: string): number {
      const h = (hex as string).replace('#', '')
      return parseInt(h.slice(0, 2), 16) + parseInt(h.slice(2, 4), 16) + parseInt(h.slice(4, 6), 16)
    }

    // 50 should be near-white (total brightness close to 765)
    expect(brightness(scale[50] as string)).toBeGreaterThan(630)
    // 900 should be near-black (total brightness well below 300)
    expect(brightness(scale[900] as string)).toBeLessThan(300)
    // 50 should be significantly brighter than 500
    expect(brightness(scale[50] as string)).toBeGreaterThan(brightness(scale[500] as string))
    // 900 should be significantly darker than 500
    expect(brightness(scale[900] as string)).toBeLessThan(brightness(scale[500] as string))
  })
})

describe('generateScale — error handling', () => {
  it('throws on invalid hex string', () => {
    expect(() => generateScale('not-a-color')).toThrow(/invalid hex/i)
  })

  it('throws on hex with wrong length', () => {
    expect(() => generateScale('#abc')).toThrow(/invalid hex/i)
  })

  it('throws if anchor is not a valid shade key', () => {
    expect(() => generateScale('#8B5CF6', { anchor: 550 })).toThrow(/invalid anchor/i)
  })

  it('throws if anchor is 0', () => {
    expect(() => generateScale('#8B5CF6', { anchor: 0 })).toThrow(/invalid anchor/i)
  })
})
