import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'
import { BadgerBase, extendBurrow } from '@badger-burrow/core'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── Chamber sx ───────────────────────────────────────────────────────────────

describe('Chamber sx', () => {
    it('applies a raw CSS property', () => {
        render(<Chamber data-testid="b" sx={{ cursor: 'pointer' }} />)
        expect(screen.getByTestId('b').style.cursor).toBe('pointer')
    })

    it('resolves a token path in an sx value', () => {
        render(<Chamber data-testid="b" sx={{ padding: 'space.4' }} />)
        expect(screen.getByTestId('b').style.padding).toBe('16px')
    })

    it('resolves a semantic token path in sx', () => {
        render(<Chamber data-testid="b" sx={{ backgroundColor: 'color.bg.surface' }} />)
        expect(screen.getByTestId('b').style.backgroundColor).toBeTruthy()
    })

    it('resolves a primitive colour token path in sx', () => {
        render(<Chamber data-testid="b" sx={{ backgroundColor: 'color.primary.500' }} />)
        expect(screen.getByTestId('b').style.backgroundColor).toBeTruthy()
    })

    it('appends px to resolved number values', () => {
        render(<Chamber data-testid="b" sx={{ borderRadius: 'radius.md' }} />)
        expect(screen.getByTestId('b').style.borderRadius).toBe('8px')
    })

    it('leaves unresolvable values as-is', () => {
        render(<Chamber data-testid="b" sx={{ cursor: 'grab' }} />)
        expect(screen.getByTestId('b').style.cursor).toBe('grab')
    })

    it('sx is overridden by the style prop', () => {
        render(<Chamber data-testid="b" sx={{ padding: 'space.4' }} style={{ padding: '99px' }} />)
        expect(screen.getByTestId('b').style.padding).toBe('99px')
    })

    it('named token props override sx for the same property', () => {
        render(<Chamber data-testid="b" p="space.8" sx={{ padding: 'space.2' }} />)
        expect(screen.getByTestId('b').style.padding).toBe('32px')
    })

    it('multiple sx properties all apply', () => {
        render(
            <Chamber
                data-testid="b"
                sx={{ cursor: 'pointer', userSelect: 'none', outline: 'none' }}
            />
        )
        const style = screen.getByTestId('b').style
        expect(style.cursor).toBe('pointer')
        expect(style.userSelect).toBe('none')
        expect(style.outline).toBe('none')
    })

    it('sx updates when tokens change', () => {
        render(<Chamber data-testid="b" sx={{ backgroundColor: 'color.primary.500' }} />)
        const before = screen.getByTestId('b').style.backgroundColor

        act(() => {
            extendBurrow({ primitive: { color: { primary: { 500: '#ff0000' } } } })
        })

        expect(screen.getByTestId('b').style.backgroundColor).not.toBe(before)
    })
})

// ─── Tunnel sx ────────────────────────────────────────────────────────────────

describe('Tunnel sx', () => {
    it('applies a raw CSS property', () => {
        render(<Tunnel data-testid="t" sx={{ cursor: 'pointer' }} />)
        expect(screen.getByTestId('t').style.cursor).toBe('pointer')
    })

    it('resolves a token path in an sx value', () => {
        render(<Tunnel data-testid="t" sx={{ fontSize: 'fontSize.lg' }} />)
        expect(screen.getByTestId('t').style.fontSize).toBe('20px')
    })

    it('resolves a semantic colour token in sx', () => {
        render(<Tunnel data-testid="t" sx={{ color: 'color.text.primary' }} />)
        expect(screen.getByTestId('t').style.color).toBeTruthy()
    })

    it('sx is overridden by the style prop', () => {
        render(<Tunnel data-testid="t" sx={{ fontSize: 'fontSize.md' }} style={{ fontSize: '99px' }} />)
        expect(screen.getByTestId('t').style.fontSize).toBe('99px')
    })

    it('named token props override sx for the same property', () => {
        render(<Tunnel data-testid="t" fontSize="fontSize.xl" sx={{ fontSize: 'fontSize.sm' }} />)
        expect(screen.getByTestId('t').style.fontSize).toBe('24px')
    })
})
