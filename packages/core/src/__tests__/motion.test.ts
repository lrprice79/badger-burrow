import { defaultTokens } from '@badger-eco/burrow-tokens'
import { resolveDuration, resolveEasing, resolveTransition } from '../motion'

// ─── resolveDuration ──────────────────────────────────────────────────────────

describe('resolveDuration', () => {
    it('resolves a duration token key to ms', () => {
        expect(resolveDuration('fast', defaultTokens)).toBe('150ms')
    })

    it('resolves instant to 0ms', () => {
        expect(resolveDuration('instant', defaultTokens)).toBe('0ms')
    })

    it('appends ms to a raw number', () => {
        expect(resolveDuration(250, defaultTokens)).toBe('250ms')
    })

    it('passes a raw CSS time string through', () => {
        expect(resolveDuration('0.2s', defaultTokens)).toBe('0.2s')
        expect(resolveDuration('200ms', defaultTokens)).toBe('200ms')
    })
})

// ─── resolveEasing ────────────────────────────────────────────────────────────

describe('resolveEasing', () => {
    it('resolves an easing token key to its cubic-bezier', () => {
        expect(resolveEasing('decelerate', defaultTokens)).toBe('cubic-bezier(0, 0, 0.2, 1)')
    })

    it('passes a raw easing keyword through', () => {
        expect(resolveEasing('ease-in-out', defaultTokens)).toBe('ease-in-out')
    })

    it('passes a raw cubic-bezier through', () => {
        expect(resolveEasing('cubic-bezier(0.1, 0.2, 0.3, 0.4)', defaultTokens)).toBe(
            'cubic-bezier(0.1, 0.2, 0.3, 0.4)',
        )
    })
})

// ─── resolveTransition ────────────────────────────────────────────────────────

describe('resolveTransition', () => {
    it('expands a duration token key to an all/duration/easing shorthand', () => {
        expect(resolveTransition('fast', defaultTokens)).toBe(
            'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        )
    })

    it('expands normal', () => {
        expect(resolveTransition('normal', defaultTokens)).toBe(
            'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        )
    })

    it('passes a full raw transition string through unchanged', () => {
        expect(resolveTransition('opacity 0.2s ease', defaultTokens)).toBe('opacity 0.2s ease')
    })
})
