import { extendBurrow } from '../extendBurrow'
import { BadgerBase } from '../store'
import { defaultTokens } from '@badger-eco/burrow-tokens'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── return value ─────────────────────────────────────────────────────────────

describe('return value', () => {
    it('returns a BurrowTokens object', () => {
        const result = extendBurrow({})
        expect(result).toHaveProperty('primitive')
        expect(result).toHaveProperty('semantic')
        expect(result).toHaveProperty('motion')
    })

    it('returns defaultTokens when called with empty override', () => {
        const result = extendBurrow({})
        expect(result).toEqual(defaultTokens)
    })

    it('does not mutate defaultTokens', () => {
        const originalPrimary = defaultTokens.primitive.color.primary[500]
        extendBurrow({ primitive: { color: { primary: { 500: '#ff0000' } } } })
        expect(defaultTokens.primitive.color.primary[500]).toBe(originalPrimary)
    })
})

// ─── deep merge — primitive ───────────────────────────────────────────────────

describe('deep merge — primitive', () => {
    it('overrides a single colour scale value', () => {
        const result = extendBurrow({
            primitive: { color: { primary: { 500: '#744577' } } },
        })
        expect(result.primitive.color.primary[500]).toBe('#744577')
    })

    it('preserves other colour scale values not in the override', () => {
        const result = extendBurrow({
            primitive: { color: { primary: { 500: '#744577' } } },
        })
        expect(result.primitive.color.primary[300]).toBe(defaultTokens.primitive.color.primary[300])
    })

    it('preserves unrelated token groups', () => {
        const result = extendBurrow({
            primitive: { color: { primary: { 500: '#744577' } } },
        })
        expect(result.primitive.space).toEqual(defaultTokens.primitive.space)
        expect(result.primitive.radius).toEqual(defaultTokens.primitive.radius)
    })

    it('overrides a space value', () => {
        const result = extendBurrow({
            primitive: { space: { 4: 20 } },
        })
        expect(result.primitive.space[4]).toBe(20)
        expect(result.primitive.space[8]).toBe(defaultTokens.primitive.space[8])
    })

    it('overrides a radius value', () => {
        const result = extendBurrow({
            primitive: { radius: { md: 12 } },
        })
        expect(result.primitive.radius.md).toBe(12)
        expect(result.primitive.radius.sm).toBe(defaultTokens.primitive.radius.sm)
    })
})

// ─── deep merge — semantic ────────────────────────────────────────────────────

describe('deep merge — semantic', () => {
    it('overrides a semantic light token', () => {
        const result = extendBurrow({
            semantic: { light: { 'color.interactive.primary': '#744577' } },
        })
        expect(result.semantic.light['color.interactive.primary']).toBe('#744577')
    })

    it('preserves other semantic light tokens', () => {
        const result = extendBurrow({
            semantic: { light: { 'color.interactive.primary': '#744577' } },
        })
        const otherKey = Object.keys(defaultTokens.semantic.light).find(
            k => k !== 'color.interactive.primary'
        )!
        expect(result.semantic.light[otherKey]).toBe(defaultTokens.semantic.light[otherKey])
    })

    it('overrides a semantic dark token without affecting light', () => {
        const result = extendBurrow({
            semantic: { dark: { 'color.interactive.primary': '#744577' } },
        })
        expect(result.semantic.dark['color.interactive.primary']).toBe('#744577')
        expect(result.semantic.light['color.interactive.primary']).toBe(
            defaultTokens.semantic.light['color.interactive.primary']
        )
    })
})

// ─── deep merge — motion ──────────────────────────────────────────────────────

describe('deep merge — motion', () => {
    it('overrides a duration value', () => {
        const result = extendBurrow({
            motion: { duration: { fast: 100 } },
        })
        expect(result.motion.duration.fast).toBe(100)
        expect(result.motion.duration.normal).toBe(defaultTokens.motion.duration.normal)
    })
})

// ─── store integration ────────────────────────────────────────────────────────

describe('store integration', () => {
    it('calls BadgerBase.setTokens with the merged result', () => {
        const result = extendBurrow({
            primitive: { color: { primary: { 500: '#744577' } } },
        })
        expect(BadgerBase.getTokens()).toBe(result)
    })

    it('notifies store subscribers', () => {
        const listener = jest.fn()
        BadgerBase.subscribe(listener)
        extendBurrow({ primitive: { color: { primary: { 500: '#744577' } } } })
        expect(listener).toHaveBeenCalledTimes(1)
    })

    it('calling extendBurrow twice keeps the latest tokens in the store', () => {
        extendBurrow({ primitive: { color: { primary: { 500: '#744577' } } } })
        const second = extendBurrow({ primitive: { color: { primary: { 500: '#ff0000' } } } })
        expect(BadgerBase.getTokens()).toBe(second)
        expect(BadgerBase.getTokens().primitive.color.primary[500]).toBe('#ff0000')
    })
})

// ─── mergeBurrow — accumulative merge onto CURRENT tokens ─────────────────────

import { mergeBurrow } from '../extendBurrow'

describe('mergeBurrow', () => {
    it('merges onto the current tokens, preserving earlier extendBurrow overrides', () => {
        extendBurrow({ primitive: { color: { primary: { 500: '#111111' } } } })
        mergeBurrow({ primitive: { radius: { md: 12 } } })
        const tokens = BadgerBase.getTokens()
        expect(tokens.primitive.color.primary[500]).toBe('#111111')   // kept
        expect(tokens.primitive.radius.md).toBe(12)                   // added
    })

    it('later mergeBurrow wins on conflicting keys', () => {
        extendBurrow({ primitive: { radius: { md: 10 } } })
        mergeBurrow({ primitive: { radius: { md: 14 } } })
        expect(BadgerBase.getTokens().primitive.radius.md).toBe(14)
    })

    it('notifies subscribers', () => {
        const listener = jest.fn()
        BadgerBase.subscribe(listener)
        mergeBurrow({ primitive: { radius: { sm: 6 } } })
        expect(listener).toHaveBeenCalled()
    })

    it('does not mutate defaultTokens', () => {
        const before = defaultTokens.primitive.radius.md
        mergeBurrow({ primitive: { radius: { md: 99 } } })
        expect(defaultTokens.primitive.radius.md).toBe(before)
    })
})
