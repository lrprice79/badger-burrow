/**
 * useActiveBreakpoint — central Dimensions subscription that only re-renders
 * subscribers when the ACTIVE BREAKPOINT changes, not on every width pixel.
 */
import React from 'react'
import { render, act } from '@testing-library/react-native'
import { Text } from 'react-native'
import { useActiveBreakpoint, __setWindowWidthForTests } from '../useActiveBreakpoint'

const BREAKPOINTS = { sm: '576px', md: '768px', lg: '992px', xl: '1200px' }

let renderCount = 0
function Probe() {
    renderCount++
    const bp = useActiveBreakpoint(BREAKPOINTS)
    return <Text testID="bp">{bp}</Text>
}

beforeEach(() => {
    renderCount = 0
    act(() => { __setWindowWidthForTests(375) })
})

describe('useActiveBreakpoint', () => {
    it('returns base below the smallest breakpoint', () => {
        const { getByTestId } = render(<Probe />)
        expect(getByTestId('bp').props.children).toBe('base')
    })

    it('returns the matching breakpoint for the current width', () => {
        act(() => { __setWindowWidthForTests(800) })
        const { getByTestId } = render(<Probe />)
        expect(getByTestId('bp').props.children).toBe('md')
    })

    it('re-renders when the active breakpoint changes', () => {
        const { getByTestId } = render(<Probe />)
        expect(getByTestId('bp').props.children).toBe('base')
        act(() => { __setWindowWidthForTests(800) })
        expect(getByTestId('bp').props.children).toBe('md')
    })

    it('does NOT re-render for width changes within the same breakpoint', () => {
        render(<Probe />)
        const after = renderCount
        act(() => { __setWindowWidthForTests(380) })  // still base
        act(() => { __setWindowWidthForTests(400) })  // still base
        act(() => { __setWindowWidthForTests(500) })  // still base
        expect(renderCount).toBe(after)
    })

    it('re-renders exactly once when crossing one breakpoint', () => {
        render(<Probe />)
        const after = renderCount
        act(() => { __setWindowWidthForTests(600) })  // base → sm
        expect(renderCount).toBe(after + 1)
    })
})
