// Audit B7: behaviour the existing suites never exercised — text pseudo states, hover-bg parsing
// edge cases, and the "off"/stray-value branches of the style table.
import { defaultTokens } from '@purple-brock/burrow-tokens'
import { buildBoxStyles, buildTextStyles } from '../buildStyles'
import { buildPseudoStyles, buildTextPseudoStyles, resolveHoverBg } from '../pseudo'

const t = defaultTokens

describe('buildTextPseudoStyles', () => {
    it('builds every text pseudo state that has props, and resolves tokens', () => {
        const r = buildTextPseudoStyles(
            { _hover: { color: 'text.secondary' }, _focus: { fontWeight: 'bold' }, _active: { color: 'text.primary' },
              _focusVisible: { textDecoration: 'underline' }, _disabled: { color: 'text.secondary' } },
            t, 'light')
        expect(r.hover?.color).toMatch(/^#/)
        expect(r.focus?.fontWeight).toBeDefined()
        expect(r.active?.color).toMatch(/^#/)
        expect(r.focusVisible?.textDecoration).toBe('underline')
        expect(r.disabled?.color).toMatch(/^#/)
    })

    it('omits empty or missing states entirely', () => {
        expect(buildTextPseudoStyles({ _hover: {}, _focus: undefined }, t, 'light')).toEqual({})
    })
})

describe('buildPseudoStyles (box)', () => {
    it('builds focus / active / focusVisible / disabled states', () => {
        const r = buildPseudoStyles(
            { _focus: { bg: 'bg.elevated' }, _active: { p: '2' }, _focusVisible: { borderColor: 'border.default' }, _disabled: { opacity: 0.5 } },
            t, 'light')
        expect(r.focus?.backgroundColor).toBeDefined()
        expect(r.active?.padding).toBe('8px')
        expect(r.focusVisible).toBeDefined()
        expect(r.disabled?.opacity).toBe(0.5)
    })

    it('an explicit _hover.bg wins over the auto hover shade', () => {
        const r = buildPseudoStyles({ bg: 'primary.500', _hover: { bg: 'bg.surface' } }, t, 'light')
        expect(r.hover?.backgroundColor).toBe(buildBoxStyles({ bg: 'bg.surface' }, t, 'light').backgroundColor)
    })

    it('a responsive-object bg gets no auto hover', () => {
        expect(buildPseudoStyles({ bg: { base: 'primary.500' } as never }, t, 'light').hover).toBeUndefined()
    })
})

describe('resolveHoverBg edge cases', () => {
    it('accepts the tolerant full form "color.primary.500"', () => {
        expect(resolveHoverBg('color.primary.500', undefined, undefined, t, 'light'))
            .toBe(resolveHoverBg('primary.500', undefined, undefined, t, 'light'))
    })
    it('explicit hoverScale with a semantic bg steps from 500', () => {
        expect(resolveHoverBg('bg.surface', 'primary', undefined, t, 'light')).toMatch(/^#/)
    })
    it('unknown scales and non-shade paths give nothing', () => {
        expect(resolveHoverBg('nope.500', undefined, undefined, t, 'light')).toBeUndefined()
        expect(resolveHoverBg('primary.555', undefined, undefined, t, 'light')).toBeUndefined()
        expect(resolveHoverBg('a.b.c.d', undefined, undefined, t, 'light')).toBeUndefined()
        expect(resolveHoverBg(42, undefined, undefined, t, 'light')).toBeUndefined()
        expect(resolveHoverBg(undefined, 'nope', 600, t, 'light')).toBeUndefined()
    })
})

describe('style table off / stray branches', () => {
    it('boolean helpers set to false add nothing', () => {
        expect(buildTextStyles({ italic: false, truncate: false, nowrap: false }, t, 'light')).toEqual({})
    })
    it('a stray responsive object on a token prop or enum prop is dropped, not output', () => {
        const s = buildBoxStyles({ p: { base: '2' } as never, display: { base: 'flex' } as never }, t, 'light')
        expect(s.padding).toBeUndefined()
        expect(s.display).toBeUndefined()
    })
    it('undefined props are skipped and numbers pass through as px', () => {
        expect(buildBoxStyles({ p: undefined, m: 12 }, t, 'light')).toEqual({ margin: '12px' })
    })
    it('an unknown shadow key emits nothing', () => {
        expect(buildBoxStyles({ shadow: 'nope' as never }, t, 'light').boxShadow).toBeUndefined()
    })
})
