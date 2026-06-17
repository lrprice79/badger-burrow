/**
 * Font/typography props on Chamber.
 * Chamber is a box — it renders a div — but accepts all font props so text
 * inside it inherits styles without needing a wrapping Tunnel.
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Chamber } from '../Chamber'
import { BadgerBase } from '@purple-brock/burrow-core'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── colour ───────────────────────────────────────────────────────────────────

describe('Chamber font — color', () => {
    it('resolves a semantic color token to CSS color', () => {
        render(<Chamber data-testid="b" color="color.text.primary" />)
        expect(screen.getByTestId('b').style.color).toBeTruthy()
    })

    it('resolves a primitive color token to CSS color', () => {
        render(<Chamber data-testid="b" color="color.neutral.900" />)
        expect(screen.getByTestId('b').style.color).toBeTruthy()
    })

    it('accepts a raw color string', () => {
        render(<Chamber data-testid="b" color="#ff0000" />)
        expect(screen.getByTestId('b').style.color).toBe('rgb(255, 0, 0)')
    })
})

// ─── font size ────────────────────────────────────────────────────────────────

describe('Chamber font — fontSize', () => {
    it('resolves a fontSize token', () => {
        render(<Chamber data-testid="b" fontSize="fontSize.lg" />)
        expect(screen.getByTestId('b').style.fontSize).toBe('20px')
    })

    it('resolves fontSize.2xl token', () => {
        render(<Chamber data-testid="b" fontSize="fontSize.2xl" />)
        expect(screen.getByTestId('b').style.fontSize).toBe('32px')
    })

    it('accepts a raw number', () => {
        render(<Chamber data-testid="b" fontSize={18} />)
        expect(screen.getByTestId('b').style.fontSize).toBe('18px')
    })
})

// ─── font weight ──────────────────────────────────────────────────────────────

describe('Chamber font — fontWeight', () => {
    it('resolves a fontWeight token to a number', () => {
        render(<Chamber data-testid="b" fontWeight="fontWeight.bold" />)
        expect(screen.getByTestId('b').style.fontWeight).toBe('700')
    })
})

// ─── line height / letter spacing ────────────────────────────────────────────

describe('Chamber font — lineHeight / letterSpacing', () => {
    it('resolves a lineHeight token', () => {
        render(<Chamber data-testid="b" lineHeight="lineHeight.relaxed" />)
        expect(screen.getByTestId('b').style.lineHeight).toBeTruthy()
    })

    it('resolves a letterSpacing token', () => {
        render(<Chamber data-testid="b" letterSpacing="letterSpacing.wide" />)
        expect(screen.getByTestId('b').style.letterSpacing).toBeTruthy()
    })
})

// ─── text layout helpers ──────────────────────────────────────────────────────

describe('Chamber font — text helpers', () => {
    it('italic shorthand sets fontStyle italic', () => {
        render(<Chamber data-testid="b" italic />)
        expect(screen.getByTestId('b').style.fontStyle).toBe('italic')
    })

    it('truncate sets overflow/whiteSpace/textOverflow', () => {
        render(<Chamber data-testid="b" truncate />)
        const s = screen.getByTestId('b').style
        expect(s.overflow).toBe('hidden')
        expect(s.whiteSpace).toBe('nowrap')
        expect(s.textOverflow).toBe('ellipsis')
    })

    it('textAlign sets textAlign', () => {
        render(<Chamber data-testid="b" textAlign="center" />)
        expect(screen.getByTestId('b').style.textAlign).toBe('center')
    })
})

// ─── font props alongside box props ──────────────────────────────────────────

describe('Chamber font — coexists with box props', () => {
    it('bg and color both resolve', () => {
        render(
            <Chamber
                data-testid="b"
                bg="color.bg.surface"
                color="color.text.primary"
                p="space.4"
                fontSize="fontSize.md"
            />
        )
        const s = screen.getByTestId('b').style
        expect(s.backgroundColor).toBeTruthy()
        expect(s.color).toBeTruthy()
        expect(s.padding).toBe('16px')
        expect(s.fontSize).toBe('16px')
    })
})
