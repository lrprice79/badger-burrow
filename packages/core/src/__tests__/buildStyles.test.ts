import { defaultTokens } from '@badger-eco/burrow-tokens'
import { buildBoxStyles, buildTextStyles } from '../buildStyles'

// ─── #7 explicit props win over boolean helpers ──────────────────────────────

describe('boolean helpers yield to explicit props', () => {
    it('explicit overflow wins over truncate', () => {
        const s = buildTextStyles({ truncate: true, overflow: 'visible' }, defaultTokens, 'light')
        expect(s.overflow).toBe('visible')
    })

    it('explicit whiteSpace wins over truncate', () => {
        const s = buildTextStyles({ truncate: true, whiteSpace: 'normal' }, defaultTokens, 'light')
        expect(s.whiteSpace).toBe('normal')
    })

    it('explicit textOverflow wins over truncate', () => {
        const s = buildTextStyles({ truncate: true, textOverflow: 'clip' }, defaultTokens, 'light')
        expect(s.textOverflow).toBe('clip')
    })

    it('explicit whiteSpace wins over nowrap', () => {
        const s = buildTextStyles({ nowrap: true, whiteSpace: 'normal' }, defaultTokens, 'light')
        expect(s.whiteSpace).toBe('normal')
    })

    it('explicit fontStyle wins over italic', () => {
        const s = buildTextStyles({ italic: true, fontStyle: 'normal' }, defaultTokens, 'light')
        expect(s.fontStyle).toBe('normal')
    })

    it('truncate still applies when no explicit props conflict', () => {
        const s = buildTextStyles({ truncate: true }, defaultTokens, 'light')
        expect(s.overflow).toBe('hidden')
        expect(s.whiteSpace).toBe('nowrap')
        expect(s.textOverflow).toBe('ellipsis')
    })

    it('italic still applies when no explicit fontStyle', () => {
        const s = buildTextStyles({ italic: true }, defaultTokens, 'light')
        expect(s.fontStyle).toBe('italic')
    })
})

// ─── motion token resolution ──────────────────────────────────────────────────

describe('motion props resolve tokens', () => {
    it('expands a transition duration keyword', () => {
        const s = buildBoxStyles({ transition: 'fast' }, defaultTokens, 'light')
        expect(s.transition).toBe('all 150ms cubic-bezier(0.4, 0, 0.2, 1)')
    })

    it('resolves transitionDuration / transitionTimingFunction tokens', () => {
        const s = buildBoxStyles(
            { transitionDuration: 'normal', transitionTimingFunction: 'decelerate' },
            defaultTokens,
            'light',
        )
        expect(s.transitionDuration).toBe('300ms')
        expect(s.transitionTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)')
    })

    it('resolves animationDuration / animationDelay tokens', () => {
        const s = buildBoxStyles(
            { animationDuration: 'slow', animationDelay: 'fast' },
            defaultTokens,
            'light',
        )
        expect(s.animationDuration).toBe('600ms')
        expect(s.animationDelay).toBe('150ms')
    })

    it('passes a raw transition string through', () => {
        const s = buildBoxStyles({ transition: 'opacity 0.2s ease' }, defaultTokens, 'light')
        expect(s.transition).toBe('opacity 0.2s ease')
    })
})

// ─── #9 invalid shadow key does not throw ─────────────────────────────────────

describe('shadow key guard', () => {
    it('does not throw on an out-of-range shadow key', () => {
        expect(() =>
            buildBoxStyles({ shadow: 'xl' as never }, defaultTokens, 'light'),
        ).not.toThrow()
    })

    it('omits boxShadow for an unknown shadow key', () => {
        const s = buildBoxStyles({ shadow: 'xl' as never }, defaultTokens, 'light')
        expect('boxShadow' in s).toBe(false)
    })

    it('still resolves a valid shadow key', () => {
        const s = buildBoxStyles({ shadow: 'md' }, defaultTokens, 'light')
        expect(s.boxShadow).toBeTruthy()
    })
})

// ─── border width implies a visible border-style ──────────────────────────────
// CSS border-style defaults to `none`, so width+color alone renders no border.
// A utility box prop should make a border visible without forcing borderStyle.

describe('border width defaults border-style to solid', () => {
    it('borderWidth alone gets borderStyle: solid', () => {
        const s = buildBoxStyles({ borderWidth: 1 }, defaultTokens, 'light')
        expect(s.borderWidth).toBe('1px')
        expect(s.borderStyle).toBe('solid')
    })

    it('borderWidth + borderColor gets borderStyle: solid', () => {
        const s = buildBoxStyles({ borderWidth: 1, borderColor: 'border.default' }, defaultTokens, 'light')
        expect(s.borderStyle).toBe('solid')
    })

    it('explicit borderStyle is not overridden', () => {
        const s = buildBoxStyles({ borderWidth: 2, borderStyle: 'dashed' }, defaultTokens, 'light')
        expect(s.borderStyle).toBe('dashed')
    })

    it('borderWidth: 0 does not add a border-style', () => {
        const s = buildBoxStyles({ borderWidth: 0 }, defaultTokens, 'light')
        expect('borderStyle' in s).toBe(false)
    })

    it('per-side width gets a matching per-side style', () => {
        const s = buildBoxStyles({ borderLeftWidth: 4 }, defaultTokens, 'light')
        expect(s.borderLeftWidth).toBe('4px')
        expect(s.borderLeftStyle).toBe('solid')
    })

    it('explicit per-side style is not overridden', () => {
        const s = buildBoxStyles({ borderLeftWidth: 4, borderLeftStyle: 'dotted' }, defaultTokens, 'light')
        expect(s.borderLeftStyle).toBe('dotted')
    })

    it('border shorthand suppresses the auto style default', () => {
        const s = buildBoxStyles({ border: '1px solid red', borderWidth: 2 }, defaultTokens, 'light')
        expect('borderStyle' in s).toBe(false)
    })

    it('no border props means no border-style is emitted', () => {
        const s = buildBoxStyles({ bg: 'primary.500' }, defaultTokens, 'light')
        expect('borderStyle' in s).toBe(false)
    })
})
