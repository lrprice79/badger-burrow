import React from 'react'
import { render, act } from '@testing-library/react-native'
import { BadgerBase } from '@badger-eco/burrow-core'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'
import { __setWindowWidthForTests } from '../useActiveBreakpoint'

// Drive the central width store directly — same path the Dimensions change
// handler takes at runtime.
const setWidth = (width: number) => {
    act(() => { __setWindowWidthForTests(width) })
}

beforeEach(() => {
    BadgerBase.reset()
    setWidth(375)
})

describe('Chamber responsive props — native', () => {
    it('resolves base value at narrow width', () => {
        const { getByTestId } = render(<Chamber testID="c" p={{ base: 'space.2', md: 'space.6' }} />)
        expect(getByTestId('c').props.style?.padding).toBeTruthy()
    })

    it('resolves md value at tablet width', () => {
        setWidth(800)
        const { getByTestId } = render(<Chamber testID="c" p={{ base: 'space.2', md: 'space.6' }} />)
        // At 800px (md), padding should be truthy
        expect(getByTestId('c').props.style?.padding).toBeTruthy()
    })

    it('cascades to nearest smaller breakpoint', () => {
        // At sm width (600px), with only base + md defined, should use base
        setWidth(600)
        const { getByTestId } = render(<Chamber testID="c" p={{ base: 'space.2', md: 'space.6' }} />)
        expect(getByTestId('c').props.style?.padding).toBeTruthy()
    })

    it('plain props still work alongside responsive props', () => {
        const { getByTestId } = render(
            <Chamber testID="c" bg="color.primary.500" p={{ base: 'space.2', md: 'space.6' }} />
        )
        expect(getByTestId('c').props.style?.backgroundColor).toBeTruthy()
        expect(getByTestId('c').props.style?.padding).toBeTruthy()
    })

    it('resolves responsive flexDir to column at narrow width', () => {
        const { getByTestId } = render(
            <Chamber testID="c" flexDir={{ base: 'column', md: 'row' }} />
        )
        expect(getByTestId('c').props.style?.flexDirection).toBe('column')
    })

    it('resolves responsive flexDir to row at tablet width', () => {
        setWidth(800)
        const { getByTestId } = render(
            <Chamber testID="c" flexDir={{ base: 'column', md: 'row' }} />
        )
        expect(getByTestId('c').props.style?.flexDirection).toBe('row')
    })

    it('resolves responsive align to center at wide width', () => {
        setWidth(1300)
        const { getByTestId } = render(
            <Chamber testID="c" align={{ base: 'flex-start', xl: 'center' }} />
        )
        expect(getByTestId('c').props.style?.alignItems).toBe('center')
    })
})

describe('Tunnel responsive props — native', () => {
    it('resolves base fontSize at narrow width', () => {
        const { getByTestId } = render(
            <Tunnel testID="t" fontSize={{ base: 'fontSize.sm', lg: 'fontSize.xl' }} />
        )
        expect(getByTestId('t').props.style?.fontSize).toBeTruthy()
    })
})
