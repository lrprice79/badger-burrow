import { generateTheme } from '../theme'
import type { PrimitiveColorScale } from '../schema'

// ─── WCAG contrast helper (independent re-impl so tests don't trust the source) ──

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

// Resolve a `{color.<scale>.<shade>}` reference (or a raw hex) against a theme's
// primitive colour scales.
function resolve(theme: ReturnType<typeof generateTheme>, value: string): string {
  const m = value.match(/^\{color\.(\w+)\.(\d+)\}$/)
  if (!m) return value
  const scale = theme.primitive!.color![m[1]] as PrimitiveColorScale
  return scale[m[2]]
}

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']

describe('generateTheme', () => {
  it('produces a full 50–900 primary scale from the brand hex', () => {
    const theme = generateTheme('#8B5CF6')
    const primary = theme.primitive!.color!.primary
    expect(Object.keys(primary).sort()).toEqual([...SHADES].sort())
  })

  it('derives a secondary scale (complementary by default) distinct from primary', () => {
    const theme = generateTheme('#8B5CF6')
    const { primary, secondary } = theme.primitive!.color!
    expect(Object.keys(secondary).sort()).toEqual([...SHADES].sort())
    expect(secondary['500']).not.toBe(primary['500'])
  })

  it('honours an explicit secondary hex over the harmony', () => {
    const theme = generateTheme('#8B5CF6', { secondary: '#10B981' })
    const fromHarmony = generateTheme('#8B5CF6').primitive!.color!.secondary
    expect(theme.primitive!.color!.secondary['500']).not.toBe(fromHarmony['500'])
  })

  it('uses the chosen harmony to pick the secondary hue', () => {
    const comp = generateTheme('#8B5CF6', { harmony: 'complementary' })
    const tri = generateTheme('#8B5CF6', { harmony: 'triadic' })
    expect(tri.primitive!.color!.secondary['500']).not.toBe(
      comp.primitive!.color!.secondary['500']
    )
  })

  it('includes neutral and ink scales, with overridable seeds', () => {
    const theme = generateTheme('#8B5CF6')
    expect(Object.keys(theme.primitive!.color!.neutral).sort()).toEqual([...SHADES].sort())
    expect(Object.keys(theme.primitive!.color!.ink).sort()).toEqual([...SHADES].sort())

    const custom = generateTheme('#8B5CF6', { neutral: '#71839B' })
    expect(custom.primitive!.color!.neutral['500']).not.toBe(
      theme.primitive!.color!.neutral['500']
    )
  })

  it('emits interactive semantic tokens for both light and dark', () => {
    const theme = generateTheme('#8B5CF6')
    for (const mode of ['light', 'dark'] as const) {
      const s = theme.semantic![mode]
      expect(s['color.interactive.primary']).toBeDefined()
      expect(s['color.interactive.primary.hover']).toBeDefined()
      expect(s['color.interactive.secondary']).toBeDefined()
      expect(s['color.interactive.secondary.hover']).toBeDefined()
      expect(s['color.text.inverse']).toBeDefined()
    }
  })

  // The whole point of generateTheme: AA-readable buttons for ANY brand hue.
  it.each([
    ['violet', '#8B5CF6'],
    ['yellow', '#F5D90A'],
    ['lime', '#84CC16'],
    ['cyan', '#06B6D4'],
    ['red', '#EF4444'],
    ['dark navy', '#1E293B'],
    ['near-white', '#F8FAFC'],
  ])('keeps the primary button label AA-readable for %s (%s)', (_name: string, hex: string) => {
    const theme = generateTheme(hex)
    const s = theme.semantic!.light
    const bg = resolve(theme, s['color.interactive.primary'])
    const label = resolve(theme, s['color.text.inverse'])
    expect(contrast(bg, label)).toBeGreaterThanOrEqual(4.5)
  })

  it.each([
    ['violet', '#8B5CF6'],
    ['yellow', '#F5D90A'],
    ['cyan', '#06B6D4'],
  ])('keeps the secondary button label AA-readable for %s (%s)', (_name: string, hex: string) => {
    const theme = generateTheme(hex)
    const s = theme.semantic!.light
    const bg = resolve(theme, s['color.interactive.secondary'])
    const label = resolve(theme, s['color.text.inverse'])
    expect(contrast(bg, label)).toBeGreaterThanOrEqual(4.5)
  })

  it('throws on an invalid brand hex', () => {
    expect(() => generateTheme('not-a-colour')).toThrow()
  })
})
