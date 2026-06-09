import { sanitizeNativeStyle, nativeLineCount } from '../nativeStyle'

// ─── px → number conversion ─────────────────────────────────────────────────

describe('sanitizeNativeStyle — unit conversion', () => {
    it('strips px from a dimensional value, returning a number', () => {
        const out = sanitizeNativeStyle({ padding: '16px' })
        expect(out.padding).toBe(16)
    })

    it('strips px from fontSize in text mode', () => {
        const out = sanitizeNativeStyle({ fontSize: '20px' }, { text: true })
        expect(out.fontSize).toBe(20)
    })

    it('handles decimal px values', () => {
        const out = sanitizeNativeStyle({ letterSpacing: '0.5px' }, { text: true })
        expect(out.letterSpacing).toBe(0.5)
    })

    it('handles negative px values', () => {
        const out = sanitizeNativeStyle({ letterSpacing: '-0.5px' }, { text: true })
        expect(out.letterSpacing).toBe(-0.5)
    })

    it('keeps percentage strings untouched', () => {
        const out = sanitizeNativeStyle({ width: '100%' })
        expect(out.width).toBe('100%')
    })

    it('keeps plain numbers untouched', () => {
        const out = sanitizeNativeStyle({ opacity: 0.5, zIndex: 3 })
        expect(out.opacity).toBe(0.5)
        expect(out.zIndex).toBe(3)
    })

    it('converts a pure numeric string to a number', () => {
        const out = sanitizeNativeStyle({ flexGrow: '1' })
        expect(out.flexGrow).toBe(1)
    })
})

// ─── web-only key stripping ──────────────────────────────────────────────────

describe('sanitizeNativeStyle — strips web-only keys', () => {
    it('removes the leaked web boxShadow string', () => {
        const out = sanitizeNativeStyle({ boxShadow: '0px 4px 12px rgba(0,0,0,0.15)', padding: '8px' })
        expect('boxShadow' in out).toBe(false)
        expect(out.padding).toBe(8)
    })

    it('removes cursor, userSelect, filter, transition, outline', () => {
        const out = sanitizeNativeStyle({
            cursor: 'pointer',
            filter: 'blur(2px)',
            transition: 'all 0.2s',
            outlineColor: 'red',
            outlineWidth: '2px',
            backgroundColor: 'red',
        })
        expect('cursor' in out).toBe(false)
        expect('filter' in out).toBe(false)
        expect('transition' in out).toBe(false)
        expect('outlineColor' in out).toBe(false)
        expect('outlineWidth' in out).toBe(false)
        expect(out.backgroundColor).toBe('red')
    })

    it('removes grid and background-image keys', () => {
        const out = sanitizeNativeStyle({
            gridTemplateColumns: '1fr 1fr',
            backgroundImage: 'url(x)',
            backgroundColor: 'blue',
        })
        expect('gridTemplateColumns' in out).toBe(false)
        expect('backgroundImage' in out).toBe(false)
        expect(out.backgroundColor).toBe('blue')
    })

    it('removes web-only text keys in text mode (whiteSpace, textOverflow, wordBreak)', () => {
        const out = sanitizeNativeStyle(
            { whiteSpace: 'nowrap', textOverflow: 'ellipsis', wordBreak: 'break-all', color: 'red' },
            { text: true },
        )
        expect('whiteSpace' in out).toBe(false)
        expect('textOverflow' in out).toBe(false)
        expect('wordBreak' in out).toBe(false)
        expect(out.color).toBe('red')
    })

    it('drops the -webkit-box display value from lineClamp', () => {
        const out = sanitizeNativeStyle(
            { display: '-webkit-box', WebkitLineClamp: 2, color: 'red' },
            { text: true },
        )
        expect('display' in out).toBe(false)
        expect('WebkitLineClamp' in out).toBe(false)
        expect(out.color).toBe('red')
    })

    it('keeps a valid display value', () => {
        const out = sanitizeNativeStyle({ display: 'flex' })
        expect(out.display).toBe('flex')
    })
})

// ─── view vs text whitelist ──────────────────────────────────────────────────

describe('sanitizeNativeStyle — view drops text-only props', () => {
    it('strips fontSize/color/fontWeight from a View style', () => {
        const out = sanitizeNativeStyle({
            fontSize: '20px',
            color: 'red',
            fontWeight: '700',
            padding: '8px',
        })
        expect('fontSize' in out).toBe(false)
        expect('color' in out).toBe(false)
        expect('fontWeight' in out).toBe(false)
        expect(out.padding).toBe(8)
    })

    it('keeps fontSize/color in text mode', () => {
        const out = sanitizeNativeStyle({ fontSize: '20px', color: 'red' }, { text: true })
        expect(out.fontSize).toBe(20)
        expect(out.color).toBe('red')
    })
})

// ─── lineHeight multiplier resolution ────────────────────────────────────────

describe('sanitizeNativeStyle — lineHeight', () => {
    it('converts a unitless string multiplier to a number', () => {
        const out = sanitizeNativeStyle({ lineHeight: '1.5' }, { text: true })
        expect(typeof out.lineHeight).toBe('number')
    })

    it('resolves a multiplier against fontSize to absolute px', () => {
        const out = sanitizeNativeStyle({ fontSize: '20px', lineHeight: '1.5' }, { text: true })
        // 1.5 * 20 = 30
        expect(out.lineHeight).toBe(30)
    })

    it('leaves an absolute px lineHeight as a number', () => {
        const out = sanitizeNativeStyle({ lineHeight: '24px' }, { text: true })
        expect(out.lineHeight).toBe(24)
    })
})

// ─── numberOfLines ───────────────────────────────────────────────────────────

describe('nativeLineCount', () => {
    it('returns 1 for truncate', () => {
        expect(nativeLineCount({ truncate: true })).toBe(1)
    })

    it('returns the lineClamp count', () => {
        expect(nativeLineCount({ lineClamp: 3 })).toBe(3)
    })

    it('returns undefined when neither is set', () => {
        expect(nativeLineCount({})).toBeUndefined()
    })

    it('truncate takes priority over lineClamp', () => {
        expect(nativeLineCount({ truncate: true, lineClamp: 3 })).toBe(1)
    })
})
