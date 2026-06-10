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

// ─── Chamber responsive layout / grid props ───────────────────────────────────

describe('Chamber responsive layout props', () => {
    it('applies base flexDir as inline style', () => {
        render(<Chamber data-testid="c" flexDir={{ base: 'column', md: 'row' }} />)
        expect(screen.getByTestId('c').style.flexDirection).toBe('column')
    })

    it('injects a media query for responsive flexDir', () => {
        render(<Chamber data-testid="c" flexDir={{ base: 'column', md: 'row' }} />)
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag?.textContent).toContain('flex-direction')
        expect(tag?.textContent).toContain('row')
        expect(tag?.textContent).toContain('768px')
    })

    it('injects a media query for responsive align', () => {
        render(<Chamber data-testid="c" align={{ base: 'flex-start', lg: 'center' }} />)
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag?.textContent).toContain('align-items')
        expect(tag?.textContent).toContain('center')
    })

    it('injects a media query for responsive justify', () => {
        render(<Chamber data-testid="c" justify={{ base: 'flex-start', md: 'space-between' }} />)
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag?.textContent).toContain('justify-content')
        expect(tag?.textContent).toContain('space-between')
    })

    it('supports responsive display', () => {
        render(<Chamber data-testid="c" display={{ base: 'block', md: 'flex' }} />)
        expect(screen.getByTestId('c').style.display).toBe('block')
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag?.textContent).toContain('display')
    })
})

describe('Chamber responsive grid props', () => {
    it('injects a media query for responsive gridTemplateColumns', () => {
        render(
            <Chamber
                data-testid="c"
                display="grid"
                gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
            />
        )
        expect(screen.getByTestId('c').style.gridTemplateColumns).toBe('1fr')
        const tag = document.head.querySelector('[data-bb-responsive]')
        expect(tag?.textContent).toContain('grid-template-columns')
        expect(tag?.textContent).toContain('1fr 1fr')
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
