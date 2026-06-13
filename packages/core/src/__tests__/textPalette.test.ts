import { defaultTokens } from '@badger-burrow/tokens'
import { resolveToken } from '../resolver'

const ink = defaultTokens.primitive.color.ink
const neutral = defaultTokens.primitive.color.neutral

function lum(hex: string): number {
    const c = hex.replace('#', '')
    const v = [0, 2, 4].map((i) => {
        const x = parseInt(c.slice(i, i + 2), 16) / 255
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
}
function ratio(a: string, b: string): number {
    const la = lum(a), lb = lum(b)
    const hi = Math.max(la, lb), lo = Math.min(la, lb)
    return (hi + 0.05) / (lo + 0.05)
}

// ─── dedicated ink scale ──────────────────────────────────────────────────────

describe('ink — dedicated text palette', () => {
    it('exists as a full 50–900 scale', () => {
        expect(ink).toBeDefined()
        for (const shade of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
            expect(typeof ink[shade]).toBe('string')
        }
    })

    it('is a separate scale from neutral', () => {
        expect(ink[900]).not.toBe(neutral[900])
        expect(ink[500]).not.toBe(neutral[500])
    })

    it('text.primary resolves from ink (dark in light mode, light in dark mode)', () => {
        expect(resolveToken('color.text.primary', defaultTokens, 'light')).toBe(ink[900])
        expect(resolveToken('color.text.primary', defaultTokens, 'dark')).toBe(ink[50])
    })

    it('text.secondary (light) resolves from ink and meets AA on the page surface', () => {
        const light = resolveToken('color.text.secondary', defaultTokens, 'light') as string
        const surface = resolveToken('color.bg.surface', defaultTokens, 'light') as string
        expect(light).toBe(ink[600])
        expect(ratio(light, surface)).toBeGreaterThanOrEqual(4.5)
    })
})

// ─── neutral cleaned up for surfaces ──────────────────────────────────────────

describe('neutral — clean surfaces with visible card lift', () => {
    it('bg.surface (light) is a clean, untinted light grey', () => {
        const surface = resolveToken('color.bg.surface', defaultTokens, 'light') as string
        expect(surface).toBe(neutral[100])
        expect(lum(surface)).toBeGreaterThan(0.75)   // light grey, not dingy
        const c = surface.replace('#', '')
        const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16))
        expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThanOrEqual(2)   // no tint
    })

    it('elevated (white) lifts clearly above the surface in light mode', () => {
        const surface = resolveToken('color.bg.surface', defaultTokens, 'light') as string
        const elevated = resolveToken('color.bg.elevated', defaultTokens, 'light') as string
        expect(lum(elevated) - lum(surface)).toBeGreaterThan(0.1)   // a visible pop, not just shadow
    })

    it('dark keeps a deep page that still lifts cards', () => {
        const surface = resolveToken('color.bg.surface', defaultTokens, 'dark') as string
        const elevated = resolveToken('color.bg.elevated', defaultTokens, 'dark') as string
        expect(lum(surface)).toBeLessThan(0.05)              // deep, not a flat mid-grey
        expect(lum(elevated)).toBeGreaterThan(lum(surface))  // cards lighter
    })
})
