import { BadgerBase } from '../store'
import { defaultTokens } from '@purple-brock/burrow-tokens'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── initial state ───────────────────────────────────────────────────────────

describe('initial state', () => {
    it('has default tokens on init', () => {
        expect(BadgerBase.getTokens()).toEqual(defaultTokens)
    })

    it('defaults to light mode', () => {
        expect(BadgerBase.getMode()).toBe('light')
    })
})

// ─── setMode ─────────────────────────────────────────────────────────────────

describe('setMode', () => {
    it('switches to dark mode', () => {
        BadgerBase.setMode('dark')
        expect(BadgerBase.getMode()).toBe('dark')
    })

    it('switches back to light mode', () => {
        BadgerBase.setMode('dark')
        BadgerBase.setMode('light')
        expect(BadgerBase.getMode()).toBe('light')
    })

    it('notifies subscribers when mode changes', () => {
        const listener = jest.fn()
        BadgerBase.subscribe(listener)
        BadgerBase.setMode('dark')
        expect(listener).toHaveBeenCalledTimes(1)
    })

    it('does not notify when mode is set to the same value', () => {
        const listener = jest.fn()
        BadgerBase.subscribe(listener)
        BadgerBase.setMode('light') // already light
        expect(listener).toHaveBeenCalledTimes(0)
    })
})

// ─── setTokens ───────────────────────────────────────────────────────────────

describe('setTokens', () => {
    it('replaces the token set', () => {
        const customTokens = { ...defaultTokens }
        BadgerBase.setTokens(customTokens)
        expect(BadgerBase.getTokens()).toBe(customTokens)
    })

    it('notifies subscribers when tokens change', () => {
        const listener = jest.fn()
        BadgerBase.subscribe(listener)
        BadgerBase.setTokens({ ...defaultTokens })
        expect(listener).toHaveBeenCalledTimes(1)
    })
})

// ─── subscribe / unsubscribe ──────────────────────────────────────────────────

describe('subscribe', () => {
    it('returns an unsubscribe function', () => {
        const unsub = BadgerBase.subscribe(jest.fn())
        expect(typeof unsub).toBe('function')
    })

    it('notifies multiple subscribers', () => {
        const a = jest.fn()
        const b = jest.fn()
        BadgerBase.subscribe(a)
        BadgerBase.subscribe(b)
        BadgerBase.setMode('dark')
        expect(a).toHaveBeenCalledTimes(1)
        expect(b).toHaveBeenCalledTimes(1)
    })

    it('stops notifying after unsubscribe', () => {
        const listener = jest.fn()
        const unsub = BadgerBase.subscribe(listener)
        unsub()
        BadgerBase.setMode('dark')
        expect(listener).toHaveBeenCalledTimes(0)
    })

    it('unsubscribing one does not affect others', () => {
        const a = jest.fn()
        const b = jest.fn()
        const unsubA = BadgerBase.subscribe(a)
        BadgerBase.subscribe(b)
        unsubA()
        BadgerBase.setMode('dark')
        expect(a).toHaveBeenCalledTimes(0)
        expect(b).toHaveBeenCalledTimes(1)
    })

    it('calling unsubscribe twice does not throw', () => {
        const unsub = BadgerBase.subscribe(jest.fn())
        unsub()
        expect(() => unsub()).not.toThrow()
    })
})

// ─── getSnapshot (for useSyncExternalStore) ───────────────────────────────────

describe('getSnapshot', () => {
    it('returns the current snapshot object', () => {
        const snap = BadgerBase.getSnapshot()
        expect(snap).toHaveProperty('tokens')
        expect(snap).toHaveProperty('mode')
    })

    it('returns the same reference if nothing changed', () => {
        const a = BadgerBase.getSnapshot()
        const b = BadgerBase.getSnapshot()
        expect(a).toBe(b)
    })

    it('returns a new reference after setMode', () => {
        const before = BadgerBase.getSnapshot()
        BadgerBase.setMode('dark')
        const after = BadgerBase.getSnapshot()
        expect(before).not.toBe(after)
    })

    it('returns a new reference after setTokens', () => {
        const before = BadgerBase.getSnapshot()
        BadgerBase.setTokens({ ...defaultTokens })
        const after = BadgerBase.getSnapshot()
        expect(before).not.toBe(after)
    })

    it('snapshot reflects current mode', () => {
        BadgerBase.setMode('dark')
        expect(BadgerBase.getSnapshot().mode).toBe('dark')
    })

    it('snapshot reflects current tokens', () => {
        const custom = { ...defaultTokens }
        BadgerBase.setTokens(custom)
        expect(BadgerBase.getSnapshot().tokens).toBe(custom)
    })
})

// ─── reset ───────────────────────────────────────────────────────────────────

describe('reset', () => {
    it('restores default tokens', () => {
        BadgerBase.setTokens({ ...defaultTokens })
        BadgerBase.reset()
        expect(BadgerBase.getTokens()).toEqual(defaultTokens)
    })

    it('restores light mode', () => {
        BadgerBase.setMode('dark')
        BadgerBase.reset()
        expect(BadgerBase.getMode()).toBe('light')
    })

    it('clears all subscribers', () => {
        const listener = jest.fn()
        BadgerBase.subscribe(listener)
        BadgerBase.reset()
        BadgerBase.setMode('dark')
        expect(listener).toHaveBeenCalledTimes(0)
    })
})

// ─── invalid mode (audit B5) ─────────────────────────────────────────────────

describe('setMode rejects an invalid mode', () => {
    it('ignores anything other than light/dark (keeps the current mode, no notify)', () => {
        const listener = jest.fn()
        BadgerBase.subscribe(listener)
        BadgerBase.setMode('dark')
        BadgerBase.setMode('purple' as never)
        BadgerBase.setMode(undefined as never)
        expect(BadgerBase.getMode()).toBe('dark')
        expect(listener).toHaveBeenCalledTimes(1)
    })
})
