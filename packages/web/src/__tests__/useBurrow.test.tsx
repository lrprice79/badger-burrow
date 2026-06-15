import React from 'react'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useBurrow } from '../useBurrow'
import { BadgerBase, extendBurrow } from '@badger-eco/burrow-core'
import { defaultTokens } from '@badger-eco/burrow-tokens'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── initial state ────────────────────────────────────────────────────────────

describe('initial state', () => {
    it('returns the default tokens', () => {
        const { result } = renderHook(() => useBurrow())
        expect(result.current.tokens).toEqual(defaultTokens)
    })

    it('returns light mode by default', () => {
        const { result } = renderHook(() => useBurrow())
        expect(result.current.mode).toBe('light')
    })

    it('exposes setMode function', () => {
        const { result } = renderHook(() => useBurrow())
        expect(typeof result.current.setMode).toBe('function')
    })
})

// ─── mode switching ───────────────────────────────────────────────────────────

describe('mode switching', () => {
    it('updates mode when setMode is called', () => {
        const { result } = renderHook(() => useBurrow())
        act(() => {
            result.current.setMode('dark')
        })
        expect(result.current.mode).toBe('dark')
    })

    it('switches back to light mode', () => {
        const { result } = renderHook(() => useBurrow())
        act(() => {
            result.current.setMode('dark')
        })
        act(() => {
            result.current.setMode('light')
        })
        expect(result.current.mode).toBe('light')
    })
})

// ─── token updates ────────────────────────────────────────────────────────────

describe('token updates', () => {
    it('reflects new tokens after extendBurrow', () => {
        const { result } = renderHook(() => useBurrow())
        act(() => {
            extendBurrow({ primitive: { color: { primary: { 500: '#744577' } } } })
        })
        expect(result.current.tokens.primitive.color.primary[500]).toBe('#744577')
    })

    it('multiple hooks all receive the update', () => {
        const { result: a } = renderHook(() => useBurrow())
        const { result: b } = renderHook(() => useBurrow())
        act(() => {
            extendBurrow({ primitive: { color: { primary: { 500: '#744577' } } } })
        })
        expect(a.current.tokens.primitive.color.primary[500]).toBe('#744577')
        expect(b.current.tokens.primitive.color.primary[500]).toBe('#744577')
    })
})

// ─── store sync ───────────────────────────────────────────────────────────────

describe('store sync', () => {
    it('setMode updates the global BadgerBase store', () => {
        const { result } = renderHook(() => useBurrow())
        act(() => {
            result.current.setMode('dark')
        })
        expect(BadgerBase.getMode()).toBe('dark')
    })

    it('tokens reference is stable when nothing changes', () => {
        const { result, rerender } = renderHook(() => useBurrow())
        const before = result.current.tokens
        rerender()
        expect(result.current.tokens).toBe(before)
    })

    it('snapshot reference changes after mode switch', () => {
        const { result } = renderHook(() => useBurrow())
        const before = result.current
        act(() => {
            result.current.setMode('dark')
        })
        expect(result.current).not.toBe(before)
    })
})
