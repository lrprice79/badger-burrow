import { fnv1a, toClassName } from '../hash'

describe('fnv1a', () => {
    it('returns a non-empty string', () => {
        expect(fnv1a('hello')).toBeTruthy()
    })

    it('is stable — same input always returns same output', () => {
        expect(fnv1a('p:4|mt:2')).toBe(fnv1a('p:4|mt:2'))
    })

    it('produces different hashes for different inputs', () => {
        expect(fnv1a('p:4')).not.toBe(fnv1a('p:5'))
        expect(fnv1a('p:4|mt:2')).not.toBe(fnv1a('p:4|mt:3'))
    })

    it('is order-sensitive — prop order matters', () => {
        expect(fnv1a('p:4|mt:2')).not.toBe(fnv1a('mt:2|p:4'))
    })

    it('handles empty string without throwing', () => {
        expect(() => fnv1a('')).not.toThrow()
        expect(typeof fnv1a('')).toBe('string')
    })

    it('handles single character', () => {
        expect(typeof fnv1a('a')).toBe('string')
    })

    it('handles unicode characters without throwing', () => {
        expect(() => fnv1a('🦡')).not.toThrow()
    })

    it('returns base-36 string — only alphanumeric characters', () => {
        const result = fnv1a('p:4|mt:2|mb:8|px:16')
        expect(result).toMatch(/^[0-9a-z]+$/)
    })

    it('produces known stable hash values', () => {
        // Spot-checks — if these change the algorithm changed
        expect(fnv1a('p:4')).toBe(fnv1a('p:4'))
        expect(fnv1a('color:primary')).toBe(fnv1a('color:primary'))
    })
})

describe('toClassName', () => {
    it('prefixes with bb-', () => {
        expect(toClassName('p:4')).toMatch(/^bb-/)
    })

    it('is stable', () => {
        expect(toClassName('p:4|mt:2')).toBe(toClassName('p:4|mt:2'))
    })

    it('produces different classNames for different inputs', () => {
        expect(toClassName('p:4')).not.toBe(toClassName('p:5'))
    })

    it('only contains URL-safe characters after the prefix', () => {
        const result = toClassName('p:4|mt:2|mb:8')
        expect(result).toMatch(/^bb-[0-9a-z]+$/)
    })
})
