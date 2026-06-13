import { createVariants } from '../variants'
import { defaultTokens } from '@badger-burrow/tokens'

// ─── createVariants return type ───────────────────────────────────────────────

describe('createVariants', () => {
    it('returns a function', () => {
        const v = createVariants({ sm: {}, md: {} })
        expect(typeof v).toBe('function')
    })
})

// ─── resolving raw values ─────────────────────────────────────────────────────

describe('raw values', () => {
    it('returns a raw string value unchanged', () => {
        const v = createVariants({
            primary: { color: '#ff0000' },
        })
        expect(v('primary', defaultTokens).color).toBe('#ff0000')
    })

    it('returns a raw number value unchanged', () => {
        const v = createVariants({
            base: { opacity: 0.5 },
        })
        expect(v('base', defaultTokens).opacity).toBe(0.5)
    })
})

// ─── resolving token paths ────────────────────────────────────────────────────

describe('token path resolution', () => {
    it('resolves a primitive space token path', () => {
        const v = createVariants({
            md: { padding: 'space.4' },
        })
        expect(v('md', defaultTokens).padding).toBe(16)
    })

    it('resolves a primitive radius token path', () => {
        const v = createVariants({
            rounded: { borderRadius: 'radius.md' },
        })
        expect(v('rounded', defaultTokens).borderRadius).toBe(8)
    })

    it('resolves a primitive fontSize token path', () => {
        const v = createVariants({
            body: { fontSize: 'fontSize.md' },
        })
        expect(v('body', defaultTokens).fontSize).toBe(16)
    })

    it('resolves a primitive color token path', () => {
        const v = createVariants({
            brand: { color: 'color.primary.500' },
        })
        const result = v('brand', defaultTokens)
        expect(typeof result.color).toBe('string')
        expect(result.color).toBeTruthy()
    })

    it('resolves a semantic token path in light mode', () => {
        const v = createVariants({
            interactive: { color: 'color.interactive.primary' },
        })
        const result = v('interactive', defaultTokens, 'light')
        expect(typeof result.color).toBe('string')
        expect(result.color).toBeTruthy()
    })

    it('resolves a semantic token path in dark mode', () => {
        const v = createVariants({
            interactive: { color: 'color.text.primary' },
        })
        const light = v('interactive', defaultTokens, 'light')
        const dark  = v('interactive', defaultTokens, 'dark')
        expect(light.color).not.toBe(dark.color)
    })

    it('leaves unresolvable token path as-is', () => {
        const v = createVariants({
            ghost: { color: 'color.does.not.exist' },
        })
        expect(v('ghost', defaultTokens).color).toBe('color.does.not.exist')
    })
})

// ─── multiple props per variant ───────────────────────────────────────────────

describe('multiple props', () => {
    it('resolves all props in a variant', () => {
        const v = createVariants({
            lg: {
                padding: 'space.6',
                fontSize: 'fontSize.lg',
                borderRadius: 'radius.lg',
            },
        })
        const result = v('lg', defaultTokens)
        expect(result.padding).toBe(24)
        expect(result.fontSize).toBe(20)
        expect(result.borderRadius).toBe(16)
    })
})

// ─── multiple variants ────────────────────────────────────────────────────────

describe('multiple variants', () => {
    it('resolves the correct variant by key', () => {
        const v = createVariants({
            sm: { padding: 'space.2' },
            md: { padding: 'space.4' },
            lg: { padding: 'space.6' },
        })
        expect(v('sm', defaultTokens).padding).toBe(8)
        expect(v('md', defaultTokens).padding).toBe(16)
        expect(v('lg', defaultTokens).padding).toBe(24)
    })
})

// ─── unknown variant key ──────────────────────────────────────────────────────

describe('unknown variant key', () => {
    it('returns an empty object for an unknown key', () => {
        const v = createVariants({
            md: { padding: 'space.4' },
        })
        expect(v('xl' as never, defaultTokens)).toEqual({})
    })
})

// ─── default mode ─────────────────────────────────────────────────────────────

describe('default mode', () => {
    it('defaults to light mode when mode is omitted', () => {
        const v = createVariants({
            brand: { color: 'color.interactive.primary' },
        })
        const withMode    = v('brand', defaultTokens, 'light')
        const withDefault = v('brand', defaultTokens)
        expect(withDefault.color).toBe(withMode.color)
    })
})
