import { defaultTokens } from '@purple-brock/burrow-tokens'
import { buildBoxStyles, buildTextStyles } from '../buildStyles'
import { buildPseudoStyles } from '../pseudo'

// ─── short-form box props ─────────────────────────────────────────────────────

describe('short-form box token props', () => {
    it('bg resolves a primitive colour without the color. prefix', () => {
        const s = buildBoxStyles({ bg: 'primary.500' }, defaultTokens, 'light')
        expect(s.backgroundColor).toBe(defaultTokens.primitive.color.primary[500])
    })

    it('bg resolves a semantic colour without the color. prefix', () => {
        const s = buildBoxStyles({ bg: 'bg.surface' }, defaultTokens, 'light')
        expect(s.backgroundColor).toBeTruthy()
        expect(s.backgroundColor).not.toBe('bg.surface')
    })

    it('p resolves a numeric space key', () => {
        const s = buildBoxStyles({ p: '4' }, defaultTokens, 'light')
        expect(s.padding).toBe('16px')
    })

    it('p resolves a named space key', () => {
        const s = buildBoxStyles({ p: 'md' }, defaultTokens, 'light')
        expect(s.padding).toBe('16px')
    })

    it('radius resolves a named radius key', () => {
        const s = buildBoxStyles({ radius: 'md' }, defaultTokens, 'light')
        expect(s.borderRadius).toBe('8px')
    })

    it('w resolves a named space key', () => {
        const s = buildBoxStyles({ w: 'sm' }, defaultTokens, 'light')
        expect(s.width).toBe('8px')
    })
})

// ─── short-form text props ────────────────────────────────────────────────────

describe('short-form text token props', () => {
    it('color resolves a semantic colour', () => {
        const s = buildTextStyles({ color: 'text.primary' }, defaultTokens, 'light')
        expect(s.color).toBeTruthy()
        expect(s.color).not.toBe('text.primary')
    })

    it('fontSize resolves a size key', () => {
        const s = buildTextStyles({ fontSize: 'lg' }, defaultTokens, 'light')
        expect(s.fontSize).toBe('20px')
    })

    it('fontWeight resolves a weight key', () => {
        const s = buildTextStyles({ fontWeight: 'bold' }, defaultTokens, 'light')
        expect(s.fontWeight).toBe('700')
    })

    it('lineHeight resolves a key', () => {
        const s = buildTextStyles({ lineHeight: 'normal' }, defaultTokens, 'light')
        expect(s.lineHeight).toBe('1.5')
    })

    it('letterSpacing resolves a key', () => {
        const s = buildTextStyles({ letterSpacing: 'wide' }, defaultTokens, 'light')
        expect(s.letterSpacing).toBe('0.5px')
    })

    it('fontFamily resolves a key', () => {
        const s = buildTextStyles({ fontFamily: 'mono' }, defaultTokens, 'light')
        expect(s.fontFamily).toBe('monospace')
    })
})

// ─── raw values still pass through ────────────────────────────────────────────

describe('raw values pass through', () => {
    it('a raw hex colour', () => {
        const s = buildBoxStyles({ bg: '#ff0000' }, defaultTokens, 'light')
        expect(s.backgroundColor).toBe('#ff0000')
    })

    it('a percentage width', () => {
        const s = buildBoxStyles({ w: '100%' }, defaultTokens, 'light')
        expect(s.width).toBe('100%')
    })

    it('a raw number is px', () => {
        const s = buildBoxStyles({ p: 32 }, defaultTokens, 'light')
        expect(s.padding).toBe('32px')
    })
})

// ─── tolerant: old full paths still resolve ───────────────────────────────────

describe('tolerant of full paths (back-compat)', () => {
    it('p still resolves the full space. path', () => {
        const s = buildBoxStyles({ p: 'space.4' }, defaultTokens, 'light')
        expect(s.padding).toBe('16px')
    })

    it('bg still resolves the full color. path', () => {
        const s = buildBoxStyles({ bg: 'color.primary.500' }, defaultTokens, 'light')
        expect(s.backgroundColor).toBe(defaultTokens.primitive.color.primary[500])
    })
})

// ─── smart hover works with short form ────────────────────────────────────────

describe('smart hover with short-form bg', () => {
    it('auto-steps a short primitive bg two shades darker', () => {
        const result = buildPseudoStyles({ bg: 'primary.500' }, defaultTokens, 'light')
        expect(result.hover?.backgroundColor).toBe(defaultTokens.primitive.color.primary[700])
    })
})

// ─── dev nudge warning ────────────────────────────────────────────────────────

describe('redundant-prefix dev warning', () => {
    const proc = (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process
    const realEnv = proc.env.NODE_ENV
    let warn: jest.SpyInstance

    beforeEach(() => {
        warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => {
        warn.mockRestore()
        proc.env.NODE_ENV = realEnv
    })

    it('warns in development when a redundant prefix is used', () => {
        proc.env.NODE_ENV = 'development'
        buildBoxStyles({ m: 'space.6' }, defaultTokens, 'light')
        expect(warn).toHaveBeenCalled()
        expect(warn.mock.calls[0][0]).toContain('space.6')
    })

    it('does not warn for the short form', () => {
        proc.env.NODE_ENV = 'development'
        buildBoxStyles({ m: '6' }, defaultTokens, 'light')
        expect(warn).not.toHaveBeenCalled()
    })

    it('does not warn in production', () => {
        proc.env.NODE_ENV = 'production'
        buildBoxStyles({ pt: 'space.2' }, defaultTokens, 'light')
        expect(warn).not.toHaveBeenCalled()
    })
})
