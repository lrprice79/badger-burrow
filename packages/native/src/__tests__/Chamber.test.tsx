import React from 'react'
import { create, act } from 'react-test-renderer'
import type { ReactTestRendererJSON } from 'react-test-renderer'
import { BadgerBase, extendBurrow } from '@badger-burrow/core'
import { Chamber } from '../Chamber'

// toJSON() can return an array for fragments — our components always return a single node
const json = (instance: ReturnType<typeof create>) =>
    instance.toJSON() as ReactTestRendererJSON

beforeEach(() => {
    BadgerBase.reset()
})

// ─── rendering ───────────────────────────────────────────────────────────────

describe('Chamber rendering', () => {
    it('renders a View', () => {
        const instance = create(<Chamber />)
        expect(json(instance)?.type).toBe('View')
    })

    it('renders children', () => {
        const instance = create(<Chamber testID="box">hello</Chamber>)
        expect(json(instance)?.children).toContain('hello')
    })

    it('passes testID through', () => {
        const instance = create(<Chamber testID="box" />)
        expect(json(instance)?.props.testID).toBe('box')
    })
})

// ─── token styles ─────────────────────────────────────────────────────────────

describe('Chamber token styles', () => {
    it('resolves bg token to a colour string', () => {
        extendBurrow({})
        const instance = create(<Chamber bg="color.primary.500" />)
        const style = json(instance)?.props.style
        expect(style?.backgroundColor).toBeTruthy()
    })

    it('resolves padding token', () => {
        const instance = create(<Chamber p="space.4" />)
        const style = json(instance)?.props.style
        expect(style?.padding).toBeTruthy()
    })

    it('resolves border radius token', () => {
        const instance = create(<Chamber radius="radius.md" />)
        const style = json(instance)?.props.style
        expect(style?.borderRadius).toBeTruthy()
    })

    it('passes raw style through', () => {
        const instance = create(<Chamber style={{ margin: 8 }} />)
        const style = json(instance)?.props.style
        expect(style?.margin).toBe(8)
    })

    it('named props take priority over sx', () => {
        extendBurrow({})
        const instance = create(
            <Chamber sx={{ backgroundColor: 'red' }} bg="color.primary.500" />
        )
        const style = json(instance)?.props.style
        // bg prop should win — colour will not be 'red'
        expect(style?.backgroundColor).not.toBe('red')
    })
})

// ─── shadow ───────────────────────────────────────────────────────────────────

describe('Chamber shadow', () => {
    it('applies native shadow object for shadow token', () => {
        const instance = create(<Chamber shadow="md" />)
        const style = json(instance)?.props.style
        // Native shadow uses elevation — should be a number
        expect(typeof style?.elevation).toBe('number')
    })
})

// ─── dark mode ────────────────────────────────────────────────────────────────

describe('Chamber dark mode', () => {
    it('re-renders when mode changes', () => {
        const instance = create(<Chamber bg="color.interactive.primary" />)
        const lightBg = json(instance)?.props.style?.backgroundColor
        act(() => { BadgerBase.setMode('dark') })
        instance.update(<Chamber bg="color.interactive.primary" />)
        const darkBg = json(instance)?.props.style?.backgroundColor
        expect(darkBg).not.toBe(lightBg)
    })
})
