import { resolveToken, resolvePrimitive } from '../resolver'
import { defaultTokens } from '@badger-burrow/tokens'

// ─── resolvePrimitive ────────────────────────────────────────────────────────

describe('resolvePrimitive', () => {
    it('resolves a colour shade reference', () => {
        const result = resolvePrimitive('{color.primary.500}', defaultTokens)
        expect(typeof result).toBe('string')
        expect(result).toMatch(/^#/)
    })

    it('resolves a space token reference', () => {
        const result = resolvePrimitive('{space.4}', defaultTokens)
        expect(result).toBe(16)
    })

    it('resolves a radius reference', () => {
        const result = resolvePrimitive('{radius.md}', defaultTokens)
        expect(result).toBe(8)
    })

    it('resolves a fontSize reference', () => {
        const result = resolvePrimitive('{fontSize.md}', defaultTokens)
        expect(result).toBe(16)
    })

    it('returns undefined for a non-existent path', () => {
        expect(resolvePrimitive('{color.primary.999}', defaultTokens)).toBeUndefined()
        expect(resolvePrimitive('{space.999}', defaultTokens)).toBeUndefined()
    })

    it('returns undefined if the value is not a string or number', () => {
        // {color.primary} resolves to an object (the scale), not a raw value
        expect(resolvePrimitive('{color.primary}', defaultTokens)).toBeUndefined()
    })

    it('returns undefined for a plain string (not a reference)', () => {
        expect(resolvePrimitive('#ffffff', defaultTokens)).toBeUndefined()
        expect(resolvePrimitive('rgba(0,0,0,0.5)', defaultTokens)).toBeUndefined()
    })

    it('returns undefined for an empty reference', () => {
        expect(resolvePrimitive('{}', defaultTokens)).toBeUndefined()
    })
})

// ─── resolveToken ────────────────────────────────────────────────────────────

describe('resolveToken — semantic references', () => {
    it('resolves a semantic reference in light mode', () => {
        const result = resolveToken('color.interactive.primary', defaultTokens, 'light')
        expect(typeof result).toBe('string')
        expect(result).toMatch(/^#/)
    })

    it('resolves a semantic reference in dark mode', () => {
        const result = resolveToken('color.interactive.primary', defaultTokens, 'dark')
        expect(typeof result).toBe('string')
        expect(result).toMatch(/^#/)
    })

    it('light and dark resolve to different values for mode-specific tokens', () => {
        const light = resolveToken('color.text.primary', defaultTokens, 'light')
        const dark  = resolveToken('color.text.primary', defaultTokens, 'dark')
        expect(light).not.toBe(dark)
    })

    it('returns a raw value directly when semantic value is not a reference', () => {
        // 'color.bg.elevated' is '#ffffff' in light — a raw string, not a reference
        const result = resolveToken('color.bg.elevated', defaultTokens, 'light')
        expect(result).toBe('#ffffff')
    })

    it('resolves rgba raw semantic value', () => {
        const result = resolveToken('color.bg.overlay', defaultTokens, 'light')
        expect(result).toBe('rgba(0,0,0,0.5)')
    })
})

describe('resolveToken — direct primitive fallback', () => {
    it('resolves a primitive space value directly', () => {
        expect(resolveToken('space.4', defaultTokens, 'light')).toBe(16)
    })

    it('resolves a primitive radius value directly', () => {
        expect(resolveToken('radius.md', defaultTokens, 'light')).toBe(8)
    })

    it('resolves a primitive fontSize value directly', () => {
        expect(resolveToken('fontSize.lg', defaultTokens, 'light')).toBe(20)
    })

    it('resolves a primitive fontWeight value directly', () => {
        expect(resolveToken('fontWeight.bold', defaultTokens, 'light')).toBe(700)
    })
})

describe('resolveToken — defaults', () => {
    it('defaults to light mode when no mode is provided', () => {
        const withMode    = resolveToken('color.interactive.primary', defaultTokens, 'light')
        const withDefault = resolveToken('color.interactive.primary', defaultTokens)
        expect(withDefault).toBe(withMode)
    })
})

describe('resolveToken — unknown paths', () => {
    it('returns undefined for an unknown semantic path', () => {
        expect(resolveToken('color.does.not.exist', defaultTokens, 'light')).toBeUndefined()
    })

    it('returns undefined for an unknown primitive path', () => {
        expect(resolveToken('space.999', defaultTokens, 'light')).toBeUndefined()
    })

    it('returns undefined for an empty string', () => {
        expect(resolveToken('', defaultTokens, 'light')).toBeUndefined()
    })
})
