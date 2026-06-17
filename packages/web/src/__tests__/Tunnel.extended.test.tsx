import React from 'react'
import { render, screen } from '@testing-library/react'
import { Tunnel } from '../Tunnel'
import { BadgerBase } from '@purple-brock/burrow-core'

beforeEach(() => {
    BadgerBase.reset()
})

describe('combinations', () => {
    it('italic and truncate work together', () => {
        render(<Tunnel data-testid="t" italic truncate />)
        const style = screen.getByTestId('t').style
        expect(style.fontStyle).toBe('italic')
        expect(style.textOverflow).toBe('ellipsis')
    })

    it('textTransform and textDecoration work together', () => {
        render(<Tunnel data-testid="t" textTransform="uppercase" textDecoration="underline" />)
        const style = screen.getByTestId('t').style
        expect(style.textTransform).toBe('uppercase')
        expect(style.textDecoration).toContain('underline')
    })

    it('fontStyle prop overrides italic boolean', () => {
        render(<Tunnel data-testid="t" italic fontStyle="oblique" />)
        expect(screen.getByTestId('t').style.fontStyle).toBe('oblique')
    })
})
