import React from 'react'
import { render } from '@testing-library/react-native'
import { BadgerBase } from '@badger-eco/burrow-core'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'

const proc = (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process
const realEnv = proc.env.NODE_ENV

beforeEach(() => { BadgerBase.reset() })
afterEach(() => { proc.env.NODE_ENV = realEnv })

describe('__debug — native', () => {
    it('does not pass __debug onto the View', () => {
        const { getByTestId } = render(<Chamber testID="c" __debug />)
        expect('__debug' in getByTestId('c').props).toBe(false)
    })

    it('wires an onLayout handler when debugging in dev', () => {
        const { getByTestId } = render(<Chamber testID="c" __debug />)
        expect(typeof getByTestId('c').props.onLayout).toBe('function')
    })

    it('logs the resolved style in dev', () => {
        const log = jest.spyOn(console, 'log').mockImplementation(() => {})
        render(<Chamber testID="c" __debug bg="color.primary.500" />)
        expect(log).toHaveBeenCalled()
        log.mockRestore()
    })

    it('still renders normally with __debug', () => {
        const { getByTestId } = render(<Chamber testID="c" __debug bg="color.primary.500" />)
        expect(getByTestId('c').props.style?.backgroundColor).toBeTruthy()
    })

    it('works on Tunnel', () => {
        const { getByTestId } = render(<Tunnel testID="t" __debug>hi</Tunnel>)
        expect(typeof getByTestId('t').props.onLayout).toBe('function')
    })

    it('is a no-op in production (no onLayout, no log)', () => {
        proc.env.NODE_ENV = 'production'
        const log = jest.spyOn(console, 'log').mockImplementation(() => {})
        const { getByTestId } = render(<Chamber testID="c" __debug />)
        expect(getByTestId('c').props.onLayout).toBeUndefined()
        expect(log).not.toHaveBeenCalled()
        log.mockRestore()
    })
})
