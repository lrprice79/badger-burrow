// Audit B7: native paths the existing suites never exercised.
import React from 'react'
import { Text } from 'react-native'
import { act, fireEvent, render, renderHook } from '@testing-library/react-native'
import { BadgerBase } from '@purple-brock/burrow-core'
import { useBurrow } from '../useBurrow'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'

const proc = (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process
const realEnv = proc.env.NODE_ENV
beforeEach(() => BadgerBase.reset())
afterEach(() => { proc.env.NODE_ENV = realEnv })

describe('useBurrow', () => {
    it('setMode switches the store and the hook re-renders with the new mode', () => {
        const { result } = renderHook(() => useBurrow())
        expect(result.current.mode).toBe('light')
        act(() => result.current.setMode('dark'))
        expect(result.current.mode).toBe('dark')
        expect(BadgerBase.getMode()).toBe('dark')
    })
})

describe('themes without breakpoints', () => {
    it('Chamber and Tunnel still render (breakpoints fall back to none)', () => {
        BadgerBase.setTokens({ ...BadgerBase.getTokens(), breakpoints: undefined as never })
        const { getByTestId } = render(
            <Chamber testID="c" bg="bg.surface"><Tunnel testID="t" color="text.primary">hi</Tunnel></Chamber>,
        )
        expect(getByTestId('c')).toBeTruthy()
        expect(getByTestId('t')).toBeTruthy()
    })
})

describe('__debug layout size', () => {
    it('onLayout records the measured size (shown in the next debug log)', () => {
        proc.env.NODE_ENV = 'development'
        const log = jest.spyOn(console, 'log').mockImplementation(() => {})
        const { getByTestId, rerender } = render(<Chamber testID="c" __debug><Text>a</Text></Chamber>)
        fireEvent(getByTestId('c'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 120.4, height: 40.6 } } })
        rerender(<Chamber testID="c" __debug><Text>b</Text></Chamber>)
        expect(log.mock.calls.some((c) => String(c[0]).includes('120×41'))).toBe(true)
        log.mockRestore()
    })
})
