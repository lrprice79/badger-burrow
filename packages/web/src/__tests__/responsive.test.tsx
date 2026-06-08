import React from 'react'
import { render, screen } from '@testing-library/react'
import { BadgerBase } from '@badger-burrow/core'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'

beforeEach(() => {
    BadgerBase.reset()
    document.head.querySelectorAll('[data-bb-responsive]').forEach(el => el.remove())
})

// ─── Chamber responsive props ─────────────────────────────────────────────────

describe('Chamber responsive props', () => {
    it('applies base value as inline style', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        const el = screen.getByTestId('c')
        expect(el.style.padding).toBeTruthy()
    })

    it('injects a media query style tag for each responsive prop', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag).not.toBeNull()
    })

    it('injected media query contains min-width for the breakpoint', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag?.textContent).toContain('min-width')
        expect(tag?.textContent).toContain('768px')
    })

    it('injected media query contains the padding value', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag?.textContent).toContain('padding')
    })

    it('applies a scoped class name to the element', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        const el = screen.getByTestId('c')
        expect(el.className).toMatch(/^bb-/)
    })

    it('two identical responsive configs share one style tag', () => {
        render(
            <div>
                <Chamber p={{ base: 'space.2', md: 'space.6' }} />
                <Chamber p={{ base: 'space.2', md: 'space.6' }} />
            </div>
        )
        const tags = document.head.querySelectorAll('[data-bb-responsive]')
        expect(tags.length).toBe(1)
    })

    it('multiple responsive props on one Chamber are in one style tag', () => {
        render(
            <Chamber
                p={{ base: 'space.2', md: 'space.6' }}
                gap={{ base: 'space.2', lg: 'space.6' }}
            />
        )
        const tags = document.head.querySelectorAll('[data-bb-responsive]')
        expect(tags.length).toBe(1)
    })

    it('plain props still work alongside responsive props', () => {
        render(<Chamber data-testid="c" bg="color.primary.500" p={{ base: 'space.2', md: 'space.6' }} />)
        const el = screen.getByTestId('c')
        expect(el.style.backgroundColor).toBeTruthy()
        expect(el.style.padding).toBeTruthy()
    })
})

// ─── Tunnel responsive props ──────────────────────────────────────────────────

describe('Tunnel responsive props', () => {
    it('applies base font size as inline style', () => {
        render(<Tunnel data-testid="t" fontSize={{ base: 'fontSize.sm', lg: 'fontSize.xl' }} />)
        const el = screen.getByTestId('t')
        expect(el.style.fontSize).toBeTruthy()
    })

    it('injects media query for responsive fontSize', () => {
        render(<Tunnel data-testid="t" fontSize={{ base: 'fontSize.sm', lg: 'fontSize.xl' }} />)
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag?.textContent).toContain('font-size')
        expect(tag?.textContent).toContain('992px')
    })
})
