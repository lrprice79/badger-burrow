/**
 * @jest-environment jsdom
 */
import { toCssVar, buildCssVarMap, injectCssVars, removeCssVars } from '../cssVars'
import { defaultTokens } from '@purple-brock/burrow-tokens'

// ─── toCssVar ────────────────────────────────────────────────────────────────

describe('toCssVar', () => {
    it('converts dot-separated path to CSS var name', () => {
        expect(toCssVar('color.primary.500')).toBe('--badger-color-primary-500')
    })

    it('converts semantic path to CSS var name', () => {
        expect(toCssVar('color.interactive.primary')).toBe('--badger-color-interactive-primary')
    })

    it('handles single segment', () => {
        expect(toCssVar('space')).toBe('--badger-space')
    })

    it('handles numeric segments', () => {
        expect(toCssVar('space.4')).toBe('--badger-space-4')
    })
})

// ─── buildCssVarMap ──────────────────────────────────────────────────────────

describe('buildCssVarMap', () => {
    it('returns a non-empty map', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        expect(Object.keys(map).length).toBeGreaterThan(0)
    })

    it('all keys start with --badger-', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        for (const key of Object.keys(map)) {
            expect(key).toMatch(/^--badger-/)
        }
    })

    it('includes primitive colour vars', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        expect(map).toHaveProperty('--badger-color-primary-500')
        expect(typeof map['--badger-color-primary-500']).toBe('string')
    })

    it('includes primitive space vars', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        expect(map).toHaveProperty('--badger-space-4')
        expect(map['--badger-space-4']).toBe(16)
    })

    it('includes primitive radius vars', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        expect(map).toHaveProperty('--badger-radius-md')
        expect(map['--badger-radius-md']).toBe(8)
    })

    it('includes resolved semantic vars', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        expect(map).toHaveProperty('--badger-color-interactive-primary')
        expect(typeof map['--badger-color-interactive-primary']).toBe('string')
    })

    it('includes motion duration vars', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        const motionKeys = Object.keys(map).filter(k => k.startsWith('--badger-duration'))
        expect(motionKeys.length).toBeGreaterThan(0)
    })

    it('includes motion easing vars', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        const easingKeys = Object.keys(map).filter(k => k.startsWith('--badger-easing'))
        expect(easingKeys.length).toBeGreaterThan(0)
    })

    it('does not include shadow vars', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        const shadowKeys = Object.keys(map).filter(k => k.startsWith('--badger-shadow'))
        expect(shadowKeys.length).toBe(0)
    })

    it('does not include spring vars', () => {
        const map = buildCssVarMap(defaultTokens, 'light')
        const springKeys = Object.keys(map).filter(k => k.startsWith('--badger-spring'))
        expect(springKeys.length).toBe(0)
    })

    it('light and dark produce different semantic values', () => {
        const light = buildCssVarMap(defaultTokens, 'light')
        const dark  = buildCssVarMap(defaultTokens, 'dark')
        expect(light['--badger-color-text-primary']).not.toBe(
            dark['--badger-color-text-primary']
        )
    })

    it('defaults to light mode', () => {
        const withMode    = buildCssVarMap(defaultTokens, 'light')
        const withDefault = buildCssVarMap(defaultTokens)
        expect(withDefault['--badger-color-interactive-primary']).toBe(
            withMode['--badger-color-interactive-primary']
        )
    })
})

// ─── injectCssVars ───────────────────────────────────────────────────────────

describe('injectCssVars', () => {
    afterEach(() => {
        removeCssVars()
    })

    it('sets --badger-* properties on documentElement by default', () => {
        injectCssVars(defaultTokens, 'light')
        const val = document.documentElement.style.getPropertyValue('--badger-space-4')
        expect(val).toBe('16')
    })

    it('sets semantic vars on documentElement', () => {
        injectCssVars(defaultTokens, 'light')
        const val = document.documentElement.style.getPropertyValue('--badger-color-interactive-primary')
        expect(val).toBeTruthy()
    })

    it('can target a specific element', () => {
        const el = document.createElement('div')
        injectCssVars(defaultTokens, 'light', el)
        expect(el.style.getPropertyValue('--badger-space-4')).toBe('16')
        // documentElement should be untouched
        expect(document.documentElement.style.getPropertyValue('--badger-space-4')).toBe('')
    })

    it('is safe to call multiple times — updates in place', () => {
        injectCssVars(defaultTokens, 'light')
        injectCssVars(defaultTokens, 'light')
        const val = document.documentElement.style.getPropertyValue('--badger-space-4')
        expect(val).toBe('16')
    })
})

// ─── removeCssVars ───────────────────────────────────────────────────────────

describe('removeCssVars', () => {
    it('removes all --badger-* properties', () => {
        injectCssVars(defaultTokens, 'light')
        removeCssVars()
        const val = document.documentElement.style.getPropertyValue('--badger-space-4')
        expect(val).toBe('')
    })

    it('can target a specific element', () => {
        const el = document.createElement('div')
        injectCssVars(defaultTokens, 'light', el)
        removeCssVars(el)
        expect(el.style.getPropertyValue('--badger-space-4')).toBe('')
    })

    it('is safe to call when no vars are set', () => {
        expect(() => removeCssVars()).not.toThrow()
    })
})
