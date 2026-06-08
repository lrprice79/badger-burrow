import React from 'react'
import { render, act } from '@testing-library/react-native'
import { BadgerBase, extendBurrow } from '@badger-burrow/core'
import { Chamber } from '../Chamber'

// toJSON() returns ReactTestRendererJSON from react-test-renderer (children can be strings).
// Accept unknown and cast — single() is purely a narrowing helper.
type RendererJSON = { type: string; props: Record<string, unknown>; children: (RendererJSON | string)[] | null }
const single = (v: unknown) => v as RendererJSON | null

beforeEach(() => {
    BadgerBase.reset()
})

// ─── rendering ───────────────────────────────────────────────────────────────

describe('Chamber rendering', () => {
    it('renders a View', () => {
        const { toJSON } = render(<Chamber />)
        expect(single(toJSON())?.type).toBe('View')
    })

    it('renders children', () => {
        const { toJSON } = render(<Chamber>hello</Chamber>)
        expect((single(toJSON())?.children as any[])?.includes('hello')).toBe(true)
    })

    it('passes testID through', () => {
        const { getByTestId } = render(<Chamber testID="box" />)
        expect(getByTestId('box').props.testID).toBe('box')
    })
})

// ─── token styles ─────────────────────────────────────────────────────────────

describe('Chamber token styles', () => {
    it('resolves bg token to a colour string', () => {
        extendBurrow({})
        const { getByTestId } = render(<Chamber testID="c" bg="color.primary.500" />)
        expect(getByTestId('c').props.style?.backgroundColor).toBeTruthy()
    })

    it('resolves padding token', () => {
        const { getByTestId } = render(<Chamber testID="c" p="space.4" />)
        expect(getByTestId('c').props.style?.padding).toBeTruthy()
    })

    it('resolves border radius token', () => {
        const { getByTestId } = render(<Chamber testID="c" radius="radius.md" />)
        expect(getByTestId('c').props.style?.borderRadius).toBeTruthy()
    })

    it('passes raw style through', () => {
        const { getByTestId } = render(<Chamber testID="c" style={{ margin: 8 }} />)
        expect(getByTestId('c').props.style?.margin).toBe(8)
    })

    it('named props take priority over sx', () => {
        extendBurrow({})
        const { getByTestId } = render(
            <Chamber testID="c" sx={{ backgroundColor: 'red' }} bg="color.primary.500" />
        )
        expect(getByTestId('c').props.style?.backgroundColor).not.toBe('red')
    })
})

// ─── shadow ───────────────────────────────────────────────────────────────────

describe('Chamber shadow', () => {
    it('applies native shadow object for shadow token', () => {
        const { getByTestId } = render(<Chamber testID="c" shadow="md" />)
        expect(typeof getByTestId('c').props.style?.elevation).toBe('number')
    })
})

// ─── dark mode ────────────────────────────────────────────────────────────────

describe('Chamber dark mode', () => {
    it('re-renders when mode changes', () => {
        const { getByTestId, rerender } = render(
            <Chamber testID="c" bg="color.interactive.primary" />
        )
        const lightBg = getByTestId('c').props.style?.backgroundColor
        act(() => { BadgerBase.setMode('dark') })
        rerender(<Chamber testID="c" bg="color.interactive.primary" />)
        const darkBg = getByTestId('c').props.style?.backgroundColor
        expect(darkBg).not.toBe(lightBg)
    })
})

// ─── font props ───────────────────────────────────────────────────────────────

describe('Chamber font props — native', () => {
    it('resolves color token', () => {
        const { getByTestId } = render(<Chamber testID="c" color="color.text.primary" />)
        expect(getByTestId('c').props.style?.color).toBeTruthy()
    })

    it('resolves fontSize token', () => {
        const { getByTestId } = render(<Chamber testID="c" fontSize="fontSize.lg" />)
        expect(getByTestId('c').props.style?.fontSize).toBeTruthy()
    })

    it('resolves fontWeight token', () => {
        const { getByTestId } = render(<Chamber testID="c" fontWeight="fontWeight.bold" />)
        expect(getByTestId('c').props.style?.fontWeight).toBeTruthy()
    })

    it('italic shorthand applies fontStyle', () => {
        const { getByTestId } = render(<Chamber testID="c" italic />)
        expect(getByTestId('c').props.style?.fontStyle).toBe('italic')
    })

    it('font props coexist with box props', () => {
        const { getByTestId } = render(
            <Chamber testID="c" bg="color.bg.surface" p="space.4" color="color.text.primary" fontSize="fontSize.md" />
        )
        const s = getByTestId('c').props.style
        expect(s?.backgroundColor).toBeTruthy()
        expect(s?.padding).toBeTruthy()
        expect(s?.color).toBeTruthy()
        expect(s?.fontSize).toBeTruthy()
    })
})
