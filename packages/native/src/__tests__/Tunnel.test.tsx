import React from 'react'
import { render, act } from '@testing-library/react-native'
import { BadgerBase } from '@badger-eco/burrow-core'
import { Tunnel } from '../Tunnel'

// toJSON() returns ReactTestRendererJSON from react-test-renderer (children can be strings).
// Accept unknown and cast — single() is purely a narrowing helper.
type RendererJSON = { type: string; props: Record<string, unknown>; children: (RendererJSON | string)[] | null }
const single = (v: unknown) => v as RendererJSON | null

beforeEach(() => {
    BadgerBase.reset()
})

// ─── rendering ───────────────────────────────────────────────────────────────

describe('Tunnel rendering', () => {
    it('renders a Text', () => {
        const { toJSON } = render(<Tunnel />)
        expect(single(toJSON())?.type).toBe('Text')
    })

    it('renders children', () => {
        const { toJSON } = render(<Tunnel>hello</Tunnel>)
        expect((single(toJSON())?.children as any[])?.includes('hello')).toBe(true)
    })

    it('passes testID through', () => {
        const { getByTestId } = render(<Tunnel testID="t" />)
        expect(getByTestId('t').props.testID).toBe('t')
    })
})

// ─── token styles ─────────────────────────────────────────────────────────────

describe('Tunnel token styles', () => {
    it('resolves color token', () => {
        const { getByTestId } = render(<Tunnel testID="t" color="color.text.primary" />)
        expect(getByTestId('t').props.style?.color).toBeTruthy()
    })

    it('resolves fontSize token', () => {
        const { getByTestId } = render(<Tunnel testID="t" fontSize="fontSize.lg" />)
        expect(getByTestId('t').props.style?.fontSize).toBeTruthy()
    })

    it('resolves fontWeight token', () => {
        const { getByTestId } = render(<Tunnel testID="t" fontWeight="fontWeight.bold" />)
        expect(getByTestId('t').props.style?.fontWeight).toBeTruthy()
    })

    it('passes raw style through', () => {
        const { getByTestId } = render(<Tunnel testID="t" style={{ letterSpacing: 1 }} />)
        expect(getByTestId('t').props.style?.letterSpacing).toBe(1)
    })
})

// ─── dark mode ────────────────────────────────────────────────────────────────

describe('Tunnel dark mode', () => {
    it('re-renders when mode changes', () => {
        const { getByTestId, rerender } = render(
            <Tunnel testID="t" color="color.text.primary" />
        )
        const lightColor = getByTestId('t').props.style?.color
        act(() => { BadgerBase.setMode('dark') })
        rerender(<Tunnel testID="t" color="color.text.primary" />)
        const darkColor = getByTestId('t').props.style?.color
        expect(darkColor).not.toBe(lightColor)
    })
})
