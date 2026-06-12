import { defaultTokens } from '@badger-burrow/tokens'
import { stepShade, resolveHoverBg, buildPseudoStyles } from '../pseudo'
import { resolveToken } from '../resolver'

// ─── stepShade ────────────────────────────────────────────────────────────────

describe('stepShade', () => {
    it('steps 500 → 600', () => {
        expect(stepShade(500)).toBe(600)
    })
    it('steps 50 → 100', () => {
        expect(stepShade(50)).toBe(100)
    })
    it('steps 400 → 500', () => {
        expect(stepShade(400)).toBe(500)
    })
    it('clamps at 900 (darkest)', () => {
        expect(stepShade(900)).toBe(900)
    })
    it('steps 100 → 200', () => {
        expect(stepShade(100)).toBe(200)
    })
    it('ignores unrecognised shade', () => {
        expect(stepShade(999)).toBe(999)
    })
})

// ─── resolveHoverBg ───────────────────────────────────────────────────────────

describe('resolveHoverBg', () => {
    it('returns undefined when no bg and no hoverScale', () => {
        expect(resolveHoverBg(undefined, undefined, undefined, defaultTokens, 'light')).toBeUndefined()
    })

    it('auto-steps a primitive bg path two shades darker (default)', () => {
        // color.primary.500 → should return color.primary.700 (2-shade default)
        const result = resolveHoverBg('color.primary.500', undefined, undefined, defaultTokens, 'light')
        expect(result).toBe(defaultTokens.primitive.color.primary[700])
    })

    it('auto-steps from shade 50', () => {
        const result = resolveHoverBg('color.neutral.50', undefined, undefined, defaultTokens, 'light')
        expect(result).toBe(defaultTokens.primitive.color.neutral[200])
    })

    it('uses hoverScale with auto-step from bg shade', () => {
        // bg is primary.500 but hoverScale is secondary → step on secondary at shade 700
        const result = resolveHoverBg('color.primary.500', 'secondary', undefined, defaultTokens, 'light')
        expect(result).toBe(defaultTokens.primitive.color.secondary[700])
    })

    it('uses hoverScale + explicit hoverShade exactly', () => {
        const result = resolveHoverBg('color.primary.500', 'secondary', 400, defaultTokens, 'light')
        expect(result).toBe(defaultTokens.primitive.color.secondary[400])
    })

    it('uses hoverScale with explicit hoverShade even when no bg', () => {
        const result = resolveHoverBg(undefined, 'primary', 300, defaultTokens, 'light')
        expect(result).toBe(defaultTokens.primitive.color.primary[300])
    })

    it('returns undefined for semantic bg without hoverScale', () => {
        // semantic paths like 'color.bg.surface' cannot be auto-stepped without hoverScale
        const result = resolveHoverBg('color.bg.surface', undefined, undefined, defaultTokens, 'light')
        expect(result).toBeUndefined()
    })

    it('returns undefined when hoverScale is false', () => {
        const result = resolveHoverBg('color.primary.500', false, undefined, defaultTokens, 'light')
        expect(result).toBeUndefined()
    })

    it('returns undefined for unknown scale in hoverScale', () => {
        const result = resolveHoverBg('color.primary.500', 'nonexistent', undefined, defaultTokens, 'light')
        expect(result).toBeUndefined()
    })
})

// ─── buildPseudoStyles ────────────────────────────────────────────────────────

describe('buildPseudoStyles', () => {
    it('returns empty object when no pseudo props given', () => {
        const result = buildPseudoStyles({}, defaultTokens, 'light')
        expect(result).toEqual({})
    })

    it('builds hover styles from _hover prop', () => {
        const result = buildPseudoStyles(
            { _hover: { bg: 'color.primary.600' } },
            defaultTokens,
            'light'
        )
        expect(result.hover).toBeDefined()
        expect(result.hover?.backgroundColor).toBeTruthy()
    })

    it('auto-adds hover bg from a primitive bg path', () => {
        const result = buildPseudoStyles(
            { bg: 'color.primary.500' },
            defaultTokens,
            'light'
        )
        expect(result.hover).toBeDefined()
        expect(result.hover?.backgroundColor).toBe(defaultTokens.primitive.color.primary[700])
    })

    it('_hover.bg overrides the auto bg', () => {
        const explicit = defaultTokens.primitive.color.secondary[300]
        const result = buildPseudoStyles(
            { bg: 'color.primary.500', _hover: { bg: 'color.secondary.300' } },
            defaultTokens,
            'light'
        )
        expect(result.hover?.backgroundColor).toBe(explicit)
    })

    it('builds focus styles from _focus', () => {
        const result = buildPseudoStyles(
            { _focus: { outlineColor: '#ff0000', outlineStyle: 'solid', outlineWidth: '2px' } },
            defaultTokens,
            'light'
        )
        expect(result.focus).toBeDefined()
        expect(result.focus?.outlineStyle).toBe('solid')
    })

    it('builds active styles from _active', () => {
        const result = buildPseudoStyles(
            { _active: { opacity: 0.8 } },
            defaultTokens,
            'light'
        )
        expect(result.active).toBeDefined()
        expect(result.active?.opacity).toBe(0.8)
    })

    it('builds focusVisible styles from _focusVisible', () => {
        const result = buildPseudoStyles(
            { _focusVisible: { outlineColor: 'color.interactive.primary' } },
            defaultTokens,
            'light'
        )
        expect(result.focusVisible).toBeDefined()
        expect(result.focusVisible?.outlineColor).toBeTruthy()
    })

    it('builds disabled styles from _disabled', () => {
        const result = buildPseudoStyles(
            { _disabled: { opacity: 0.4, cursor: 'not-allowed' } },
            defaultTokens,
            'light'
        )
        expect(result.disabled).toBeDefined()
        expect(result.disabled?.opacity).toBe(0.4)
        expect(result.disabled?.cursor).toBe('not-allowed')
    })

    it('resolves token paths inside _hover', () => {
        const result = buildPseudoStyles(
            { _hover: { bg: 'color.interactive.primary' } },
            defaultTokens,
            'light'
        )
        // color.interactive.primary resolves to a real colour value
        expect(result.hover?.backgroundColor).toBeTruthy()
        expect(typeof result.hover?.backgroundColor).toBe('string')
    })

    it('uses hoverScale to determine hover bg', () => {
        const result = buildPseudoStyles(
            { bg: 'color.primary.500', hoverScale: 'secondary' },
            defaultTokens,
            'light'
        )
        expect(result.hover?.backgroundColor).toBe(defaultTokens.primitive.color.secondary[700])
    })

    it('uses hoverScale + hoverShade for exact hover bg', () => {
        const result = buildPseudoStyles(
            { bg: 'color.primary.500', hoverScale: 'primary', hoverShade: 700 },
            defaultTokens,
            'light'
        )
        expect(result.hover?.backgroundColor).toBe(defaultTokens.primitive.color.primary[700])
    })

    it('hoverScale false disables auto hover bg', () => {
        const result = buildPseudoStyles(
            { bg: 'color.primary.500', hoverScale: false },
            defaultTokens,
            'light'
        )
        expect(result.hover).toBeUndefined()
    })

    it('does not include hover key when no hover input', () => {
        const result = buildPseudoStyles(
            { _focus: { opacity: 0.9 } },
            defaultTokens,
            'light'
        )
        expect(result.hover).toBeUndefined()
        expect(result.focus).toBeDefined()
    })
})

// ─── 2-shade default (interactive hover tokens + smart hover) ─────────────────

describe('default hover depth (2 shades)', () => {
    it('interactive.primary.hover resolves two shades darker than primary', () => {
        const hover = resolveToken('color.interactive.primary.hover', defaultTokens, 'light')
        expect(hover).toBe(defaultTokens.primitive.color.primary[700])
    })

    it('interactive.secondary.hover resolves two shades darker than secondary', () => {
        const hover = resolveToken('color.interactive.secondary.hover', defaultTokens, 'light')
        expect(hover).toBe(defaultTokens.primitive.color.secondary[700])
    })
})
