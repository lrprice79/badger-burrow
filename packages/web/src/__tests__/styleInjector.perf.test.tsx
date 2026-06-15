/**
 * Injector efficiency — steady-state re-renders must not touch the DOM, and
 * identical responsive configs written in different key order must share a tag.
 */
import React from 'react'
import { render } from '@testing-library/react'
import { BadgerBase } from '@badger-eco/burrow-core'
import { Chamber } from '../Chamber'
import { __resetStyleInjectorCache } from '../styleInjector'

beforeEach(() => {
    BadgerBase.reset()
    document.head.querySelectorAll('[data-bb], [data-bb-responsive]').forEach(el => el.remove())
    __resetStyleInjectorCache()
})

describe('injector caching', () => {
    it('does not query the DOM again on re-render with the same pseudo styles', () => {
        const spy = jest.spyOn(document.head, 'querySelector')
        const { rerender } = render(<Chamber data-testid="c" _hover={{ bg: 'primary.600' }} />)
        const callsAfterFirst = spy.mock.calls.length
        rerender(<Chamber data-testid="c" _hover={{ bg: 'primary.600' }} />)
        rerender(<Chamber data-testid="c" _hover={{ bg: 'primary.600' }} />)
        expect(spy.mock.calls.length).toBe(callsAfterFirst)
        spy.mockRestore()
    })

    it('re-injects after the cache is reset and tags are cleared', () => {
        render(<Chamber _hover={{ bg: 'primary.600' }} />)
        expect(document.head.querySelectorAll('[data-bb]').length).toBe(1)
        document.head.querySelectorAll('[data-bb]').forEach(el => el.remove())
        __resetStyleInjectorCache()
        render(<Chamber _hover={{ bg: 'primary.600' }} />)
        expect(document.head.querySelectorAll('[data-bb]').length).toBe(1)
    })
})

describe('stable responsive hashing', () => {
    it('identical responsive configs with different key order share one tag', () => {
        const a: Record<string, string> = {}
        a.base = '2'
        a.md = '6'
        const b: Record<string, string> = {}
        b.md = '6'
        b.base = '2'
        render(
            <div>
                <Chamber p={a} />
                <Chamber p={b} />
            </div>
        )
        expect(document.head.querySelectorAll('[data-bb-responsive]').length).toBe(1)
    })
})
