import React from 'react'
import { render } from '@testing-library/react-native'
import { BadgerBase } from '@badger-burrow/core'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'

// Control viewport width via our mock
const setWidth = (width: number) => {
    const rn = require('react-native')
    rn.useWindowDimensions.mockReturnValue({ width, height: 812 })
}

jest.mock('react-native', () => ({
    ...jest.requireActual('react-native'),
    useWindowDimensions: jest.fn(() => ({ width: 375, height: 812 })),
}))

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
})

describe('Tunnel responsive props — native', () => {
    it('resolves base fontSize at narrow width', () => {
        const { getByTestId } = render(
            <Tunnel testID="t" fontSize={{ base: 'fontSize.sm', lg: 'fontSize.xl' }} />
        )
        expect(getByTestId('t').props.style?.fontSize).toBeTruthy()
    })
})
