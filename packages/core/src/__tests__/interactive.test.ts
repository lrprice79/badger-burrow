import { defaultTokens } from '@badger-burrow/tokens'
import { resolveToken } from '../resolver'

const primary = defaultTokens.primitive.color.primary
const secondary = defaultTokens.primitive.color.secondary

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

// ─── B2: consistent white button label, AA in both modes ──────────────────────

describe('interactive primary button — unified across modes', () => {
    it('text.inverse is white in both light and dark (no flip)', () => {
        expect(resolveToken('color.text.inverse', defaultTokens, 'light')).toBe('#ffffff')
        expect(resolveToken('color.text.inverse', defaultTokens, 'dark')).toBe('#ffffff')
    })

    it('interactive.primary is the same shade (primary.600) in both modes', () => {
        expect(resolveToken('color.interactive.primary', defaultTokens, 'light')).toBe(primary[600])
        expect(resolveToken('color.interactive.primary', defaultTokens, 'dark')).toBe(primary[600])
    })

    it('white label on the primary button meets AA (>= 4.5) in both modes', () => {
        for (const mode of ['light', 'dark'] as const) {
            const bg = resolveToken('color.interactive.primary', defaultTokens, mode) as string
            const fg = resolveToken('color.text.inverse', defaultTokens, mode) as string
            expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5)
        }
    })

    it('primary/secondary hover darken two shades to 800 in both modes', () => {
        for (const mode of ['light', 'dark'] as const) {
            expect(resolveToken('color.interactive.primary.hover', defaultTokens, mode)).toBe(primary[800])
            expect(resolveToken('color.interactive.secondary.hover', defaultTokens, mode)).toBe(secondary[800])
        }
    })
})
