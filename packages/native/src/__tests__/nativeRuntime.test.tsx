/**
 * Native runtime correctness — verifies Chamber/Tunnel emit valid React Native
 * style values (raw numbers, no web-only keys, no leaked boxShadow) rather than
 * the web-shaped output of core's build functions.
 */
import React from 'react'
import { render } from '@testing-library/react-native'
import { BadgerBase } from '@purple-brock/burrow-core'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── Chamber: dimensions are numbers, not px strings ──────────────────────────

describe('Chamber native runtime', () => {
    it('emits padding as a raw number, not a px string', () => {
        const { getByTestId } = render(<Chamber testID="c" p="space.4" />)
        expect(getByTestId('c').props.style?.padding).toBe(16)
    })

    it('emits borderRadius as a raw number', () => {
        const { getByTestId } = render(<Chamber testID="c" radius="radius.md" />)
        expect(getByTestId('c').props.style?.borderRadius).toBe(8)
    })

    it('does not leak a web boxShadow string when using shadow', () => {
        const { getByTestId } = render(<Chamber testID="c" shadow="md" />)
        const style = getByTestId('c').props.style
        expect('boxShadow' in style).toBe(false)
        expect(typeof style.elevation).toBe('number')
    })

    it('strips web-only keys (cursor) from the View style', () => {
        const { getByTestId } = render(<Chamber testID="c" cursor="pointer" p="space.2" />)
        const style = getByTestId('c').props.style
        expect('cursor' in style).toBe(false)
        expect(style.padding).toBe(8)
    })

    it('does not put text-only props on the View (RN cannot inherit them)', () => {
        const { getByTestId } = render(<Chamber testID="c" color="color.text.primary" fontSize="fontSize.lg" />)
        const style = getByTestId('c').props.style
        expect('color' in style).toBe(false)
        expect('fontSize' in style).toBe(false)
    })

    it('passes pointerEvents as a View prop, not a style key', () => {
        const { getByTestId } = render(<Chamber testID="c" pointerEvents="none" />)
        const el = getByTestId('c')
        expect(el.props.pointerEvents).toBe('none')
        expect('pointerEvents' in el.props.style).toBe(false)
    })
})

// ─── Tunnel: text values are numbers; truncation via numberOfLines ────────────

describe('Tunnel native runtime', () => {
    it('emits fontSize as a raw number', () => {
        const { getByTestId } = render(<Tunnel testID="t" fontSize="fontSize.lg" />)
        expect(getByTestId('t').props.style?.fontSize).toBe(20)
    })

    it('emits lineHeight as a number resolved against fontSize', () => {
        const { getByTestId } = render(
            <Tunnel testID="t" fontSize="fontSize.lg" lineHeight="lineHeight.normal" />
        )
        // fontSize.lg = 20, lineHeight.normal = 1.5 → 30
        expect(getByTestId('t').props.style?.lineHeight).toBe(30)
    })

    it('maps truncate to numberOfLines={1}', () => {
        const { getByTestId } = render(<Tunnel testID="t" truncate>hi</Tunnel>)
        expect(getByTestId('t').props.numberOfLines).toBe(1)
    })

    it('maps lineClamp to numberOfLines', () => {
        const { getByTestId } = render(<Tunnel testID="t" lineClamp={3}>hi</Tunnel>)
        expect(getByTestId('t').props.numberOfLines).toBe(3)
    })

    it('does not emit the -webkit-box display from lineClamp', () => {
        const { getByTestId } = render(<Tunnel testID="t" lineClamp={3}>hi</Tunnel>)
        const style = getByTestId('t').props.style
        expect(style.display).not.toBe('-webkit-box')
    })

    it('strips web-only text keys (whiteSpace) when truncating', () => {
        const { getByTestId } = render(<Tunnel testID="t" truncate>hi</Tunnel>)
        const style = getByTestId('t').props.style
        expect('whiteSpace' in style).toBe(false)
    })
})
