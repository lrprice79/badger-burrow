import { defaultTokens } from '@badger-burrow/tokens'
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
