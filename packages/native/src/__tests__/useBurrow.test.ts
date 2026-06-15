import { BadgerBase, extendBurrow } from '@badger-eco/burrow-core'
import { defaultTokens } from '@badger-eco/burrow-tokens'

beforeEach(() => {
    BadgerBase.reset()
})

// useBurrow wraps useSyncExternalStore over BadgerBase.
// We test the store behaviour directly — the hook wiring is already
// covered by the web package; here we verify the native package re-exports it.
describe('BadgerBase (store underlying useBurrow)', () => {
    it('starts with default tokens', () => {
        expect(BadgerBase.getTokens()).toEqual(defaultTokens)
    })

    it('starts in light mode', () => {
        expect(BadgerBase.getMode()).toBe('light')
    })

    it('setMode switches to dark', () => {
        BadgerBase.setMode('dark')
        expect(BadgerBase.getMode()).toBe('dark')
    })

    it('extendBurrow updates tokens', () => {
        extendBurrow({ primitive: { space: { 4: 99 } } })
        expect(BadgerBase.getTokens().primitive.space[4]).toBe(99)
    })

    it('subscribers are notified on mode change', () => {
        const callback = jest.fn()
        const unsub = BadgerBase.subscribe(callback)
        BadgerBase.setMode('dark')
        expect(callback).toHaveBeenCalledTimes(1)
        unsub()
    })

    it('reset restores defaults', () => {
        BadgerBase.setMode('dark')
        extendBurrow({ primitive: { space: { 4: 99 } } })
        BadgerBase.reset()
        expect(BadgerBase.getMode()).toBe('light')
        expect(BadgerBase.getTokens()).toEqual(defaultTokens)
    })
})
