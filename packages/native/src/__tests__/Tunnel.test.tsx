import React from 'react'
import { create, act } from 'react-test-renderer'
import type { ReactTestRendererJSON } from 'react-test-renderer'
import { BadgerBase } from '@badger-burrow/core'
import { Tunnel } from '../Tunnel'

const json = (instance: ReturnType<typeof create>) =>
    instance.toJSON() as ReactTestRendererJSON

beforeEach(() => {
    BadgerBase.reset()
})

// ─── rendering ───────────────────────────────────────────────────────────────

describe('Tunnel rendering', () => {
    it('renders a Text', () => {
        const instance = create(<Tunnel />)
        expect(json(instance)?.type).toBe('Text')
    })

    it('renders children', () => {
        const instance = create(<Tunnel>hello</Tunnel>)
        expect(json(instance)?.children).toContain('hello')
    })

    it('passes testID through', () => {
        const instance = create(<Tunnel testID="t" />)
        expect(json(instance)?.props.testID).toBe('t')
    })
})

// ─── token styles ─────────────────────────────────────────────────────────────

describe('Tunnel token styles', () => {
    it('resolves color token', () => {
        const instance = create(<Tunnel color="color.text.primary" />)
        const style = json(instance)?.props.style
        expect(style?.color).toBeTruthy()
    })

    it('resolves fontSize token', () => {
        const instance = create(<Tunnel fontSize="fontSize.lg" />)
        const style = json(instance)?.props.style
        expect(style?.fontSize).toBeTruthy()
    })

    it('resolves fontWeight token', () => {
        const instance = create(<Tunnel fontWeight="fontWeight.bold" />)
        const style = json(instance)?.props.style
        expect(style?.fontWeight).toBeTruthy()
    })

    it('passes raw style through', () => {
        const instance = create(<Tunnel style={{ letterSpacing: 1 }} />)
        const style = json(instance)?.props.style
        expect(style?.letterSpacing).toBe(1)
    })
})

// ─── dark mode ────────────────────────────────────────────────────────────────

describe('Tunnel dark mode', () => {
    it('re-renders when mode changes', () => {
        const instance = create(<Tunnel color="color.text.primary" />)
        const lightColor = json(instance)?.props.style?.color
        act(() => { BadgerBase.setMode('dark') })
        instance.update(<Tunnel color="color.text.primary" />)
        const darkColor = json(instance)?.props.style?.color
        expect(darkColor).not.toBe(lightColor)
    })
})
