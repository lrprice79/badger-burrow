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
//
// Chamber renders a View. React Native does NOT support text style props on a
// View and does NOT inherit them to child Text (unlike CSS on the web). So font
// props are accepted on the type for cross-platform API parity but are stripped
// from the native View style — text styling on native must go on a Tunnel.

describe('Chamber font props — native (stripped, not inherited)', () => {
    it('does not apply color to the View', () => {
        const { getByTestId } = render(<Chamber testID="c" color="color.text.primary" />)
        expect('color' in getByTestId('c').props.style).toBe(false)
    })

    it('does not apply fontSize to the View', () => {
        const { getByTestId } = render(<Chamber testID="c" fontSize="fontSize.lg" />)
        expect('fontSize' in getByTestId('c').props.style).toBe(false)
    })

    it('does not apply fontWeight to the View', () => {
        const { getByTestId } = render(<Chamber testID="c" fontWeight="fontWeight.bold" />)
        expect('fontWeight' in getByTestId('c').props.style).toBe(false)
    })

    it('does not apply italic fontStyle to the View', () => {
        const { getByTestId } = render(<Chamber testID="c" italic />)
        expect('fontStyle' in getByTestId('c').props.style).toBe(false)
    })

    it('box props still apply while font props are dropped', () => {
        const { getByTestId } = render(
            <Chamber testID="c" bg="color.bg.surface" p="space.4" color="color.text.primary" fontSize="fontSize.md" />
        )
        const s = getByTestId('c').props.style
        expect(s?.backgroundColor).toBeTruthy()
        expect(s?.padding).toBe(16)
        expect('color' in s).toBe(false)
        expect('fontSize' in s).toBe(false)
    })
})
