import {
    isResponsiveValue,
    splitResponsiveProps,
    resolveResponsiveValue,
    getActiveBreakpoint,
    getBreakpointOrder,
} from '../responsive'

// ─── isResponsiveValue ────────────────────────────────────────────────────────

describe('isResponsiveValue', () => {
    it('returns false for a plain string', () => {
        expect(isResponsiveValue('space.4')).toBe(false)
    })

    it('returns false for a plain number', () => {
        expect(isResponsiveValue(16)).toBe(false)
    })

    it('returns false for null', () => {
        expect(isResponsiveValue(null)).toBe(false)
    })

    it('returns true for an object with a base key', () => {
        expect(isResponsiveValue({ base: 'space.2' })).toBe(true)
    })

    it('returns true for an object with breakpoint keys', () => {
        expect(isResponsiveValue({ sm: 'space.2', md: 'space.4' })).toBe(true)
    })

    it('returns false for an empty object', () => {
        expect(isResponsiveValue({})).toBe(false)
    })
})

// ─── resolveResponsiveValue ───────────────────────────────────────────────────

describe('resolveResponsiveValue', () => {
    it('returns the value as-is when not responsive', () => {
        expect(resolveResponsiveValue('space.4', 'md')).toBe('space.4')
    })

    it('returns base value when breakpoint has no specific value', () => {
        expect(resolveResponsiveValue({ base: 'space.2', lg: 'space.8' }, 'sm')).toBe('space.2')
    })

    it('returns the specific breakpoint value when set', () => {
        expect(resolveResponsiveValue({ base: 'space.2', md: 'space.6' }, 'md')).toBe('space.6')
    })

    it('cascades to the nearest smaller breakpoint when exact not set', () => {
        // sm is set, md is not — at md should fall back to sm
        expect(resolveResponsiveValue({ base: 'space.2', sm: 'space.4' }, 'md')).toBe('space.4')
    })

    it('cascades to base when no smaller breakpoint is set', () => {
        expect(resolveResponsiveValue({ base: 'space.2', xl: 'space.10' }, 'sm')).toBe('space.2')
    })

    it('returns undefined when no applicable value exists', () => {
        expect(resolveResponsiveValue({ sm: 'space.4' }, 'base')).toBeUndefined()
    })
})

// ─── getActiveBreakpoint ──────────────────────────────────────────────────────

describe('getActiveBreakpoint', () => {
    const breakpoints = { sm: '576px', md: '768px', lg: '992px', xl: '1200px' }

    it('returns base for widths below sm', () => {
        expect(getActiveBreakpoint(375, breakpoints)).toBe('base')
    })

    it('returns sm for widths at sm boundary', () => {
        expect(getActiveBreakpoint(576, breakpoints)).toBe('sm')
    })

    it('returns md for widths at md boundary', () => {
        expect(getActiveBreakpoint(768, breakpoints)).toBe('md')
    })

    it('returns lg for widths at lg boundary', () => {
        expect(getActiveBreakpoint(992, breakpoints)).toBe('lg')
    })

    it('returns xl for widths at xl boundary', () => {
        expect(getActiveBreakpoint(1200, breakpoints)).toBe('xl')
    })

    it('returns the highest matching breakpoint', () => {
        expect(getActiveBreakpoint(1400, breakpoints)).toBe('xl')
    })
})

// ─── splitResponsiveProps ─────────────────────────────────────────────────────

describe('splitResponsiveProps', () => {
    it('puts plain props into baseProps', () => {
        const { baseProps, responsiveProps } = splitResponsiveProps({ p: 'space.4', bg: 'color.primary.500' })
        expect(baseProps).toEqual({ p: 'space.4', bg: 'color.primary.500' })
        expect(responsiveProps).toEqual({})
    })

    it('puts responsive props into responsiveProps and base value into baseProps', () => {
        const { baseProps, responsiveProps } = splitResponsiveProps({
            p: { base: 'space.2', md: 'space.4' },
            bg: 'color.primary.500',
        })
        // base value extracted for inline styles
        expect(baseProps).toEqual({ bg: 'color.primary.500', p: 'space.2' })
        // full responsive object kept for media query generation
        expect(responsiveProps).toEqual({ p: { base: 'space.2', md: 'space.4' } })
    })

    it('extracts base value from responsive props into baseProps', () => {
        const { baseProps } = splitResponsiveProps({
            p: { base: 'space.2', md: 'space.6' },
        })
        // base value is available for inline styles (no media query needed)
        expect(baseProps.p).toBe('space.2')
    })

    it('handles all responsive, no plain props', () => {
        const { baseProps, responsiveProps } = splitResponsiveProps({
            p: { sm: 'space.2', lg: 'space.8' },
        })
        expect(baseProps.p).toBeUndefined()
        expect(responsiveProps.p).toEqual({ sm: 'space.2', lg: 'space.8' })
    })
})

// ─── getBreakpointOrder ───────────────────────────────────────────────────────

describe('getBreakpointOrder', () => {
    it('returns base first, then named breakpoints sorted by px', () => {
        const bp = { sm: '576px', md: '768px', lg: '992px', xl: '1200px' }
        expect(getBreakpointOrder(bp)).toEqual(['base', 'sm', 'md', 'lg', 'xl'])
    })

    it('includes custom breakpoints sorted by pixel value', () => {
        const bp = { xs: '400px', sm: '576px', md: '768px', xxl: '1400px' }
        expect(getBreakpointOrder(bp)).toEqual(['base', 'xs', 'sm', 'md', 'xxl'])
    })
})

// ─── custom breakpoints ───────────────────────────────────────────────────────

describe('custom breakpoints (xs / xxl)', () => {
    const customBp = { xs: '400px', sm: '576px', md: '768px', lg: '992px', xl: '1200px', xxl: '1400px' }

    it('isResponsiveValue recognises custom breakpoint keys', () => {
        expect(isResponsiveValue({ xs: 'space.1', xxl: 'space.8' }, Object.keys(customBp))).toBe(true)
    })

    it('isResponsiveValue returns false without custom keys registered', () => {
        // 'xs' is not in the default known set
        expect(isResponsiveValue({ xs: 'space.1' })).toBe(false)
    })

    it('getActiveBreakpoint returns xs for widths at xs boundary', () => {
        expect(getActiveBreakpoint(400, customBp)).toBe('xs')
    })

    it('getActiveBreakpoint returns xxl for widths at xxl boundary', () => {
        expect(getActiveBreakpoint(1400, customBp)).toBe('xxl')
    })

    it('splitResponsiveProps recognises xs / xxl when knownBreakpoints provided', () => {
        const { baseProps, responsiveProps } = splitResponsiveProps(
            { p: { xs: 'space.1', xxl: 'space.8' } },
            customBp,
        )
        expect(baseProps.p).toBeUndefined()
        expect(responsiveProps.p).toEqual({ xs: 'space.1', xxl: 'space.8' })
    })

    it('resolveResponsiveValue cascades correctly with custom order', () => {
        const order = getBreakpointOrder(customBp)
        // At lg (992px), with only xs + xxl defined, should cascade to xs
        expect(resolveResponsiveValue({ xs: 'space.1', xxl: 'space.8' }, 'lg', order)).toBe('space.1')
        // At xxl, should return xxl value
        expect(resolveResponsiveValue({ xs: 'space.1', xxl: 'space.8' }, 'xxl', order)).toBe('space.8')
    })
})
