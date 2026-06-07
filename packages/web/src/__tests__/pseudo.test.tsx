import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'
import { BadgerBase } from '@badger-burrow/core'

beforeEach(() => {
    BadgerBase.reset()
    // Clean up any injected style tags between tests
    document.head.querySelectorAll('[data-bb]').forEach(el => el.remove())
})

// ─── Chamber _hover ───────────────────────────────────────────────────────────

describe('Chamber _hover', () => {
    it('injects a style tag into document.head', () => {
        render(<Chamber data-testid="c" _hover={{ bg: 'color.interactive.primary' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag).not.toBeNull()
    })

    it('injected style contains :hover selector', () => {
        render(<Chamber data-testid="c" _hover={{ bg: 'color.interactive.primary' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':hover')
    })

    it('injected style contains background-color', () => {
        render(<Chamber data-testid="c" _hover={{ bg: 'color.interactive.primary' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain('background-color')
    })

    it('Chamber element gets the generated className', () => {
        render(<Chamber data-testid="c" _hover={{ bg: 'color.interactive.primary' }} />)
        const el = screen.getByTestId('c')
        expect(el.className).toBeTruthy()
        expect(el.className).toMatch(/^bb-/)
    })

    it('injects shadow via _hover', () => {
        render(<Chamber data-testid="c" _hover={{ shadow: 'md' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain('box-shadow')
    })

    it('injects cursor via _hover', () => {
        render(<Chamber data-testid="c" _hover={{ cursor: 'pointer' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain('cursor: pointer')
    })

    it('two identical _hover configs share one style tag', () => {
        render(
            <div>
                <Chamber _hover={{ cursor: 'pointer' }} />
                <Chamber _hover={{ cursor: 'pointer' }} />
            </div>
        )
        const tags = document.head.querySelectorAll('[data-bb]')
        expect(tags.length).toBe(1)
    })

    it('two different _hover configs get separate style tags', () => {
        render(
            <div>
                <Chamber _hover={{ cursor: 'pointer' }} />
                <Chamber _hover={{ cursor: 'grab' }} />
            </div>
        )
        const tags = document.head.querySelectorAll('[data-bb]')
        expect(tags.length).toBe(2)
    })

    it('removes style tag on unmount when no other user remains', () => {
        const { unmount } = render(<Chamber _hover={{ cursor: 'pointer' }} />)
        expect(document.head.querySelectorAll('[data-bb]').length).toBe(1)
        act(() => unmount())
        expect(document.head.querySelectorAll('[data-bb]').length).toBe(0)
    })

    it('keeps style tag when a second user is still mounted', () => {
        render(<Chamber _hover={{ cursor: 'pointer' }} />)
        const { unmount } = render(<Chamber _hover={{ cursor: 'pointer' }} />)
        act(() => unmount())
        expect(document.head.querySelectorAll('[data-bb]').length).toBe(1)
    })
})

// ─── Auto hover bg ────────────────────────────────────────────────────────────

describe('Chamber auto hover bg', () => {
    it('injects hover bg when bg is a primitive path', () => {
        render(<Chamber data-testid="c" bg="color.primary.500" />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':hover')
        expect(tag?.textContent).toContain('background-color')
    })

    it('does not inject hover when bg is a semantic path with no hoverScale', () => {
        render(<Chamber data-testid="c" bg="color.bg.surface" />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag).toBeNull()
    })

    it('injects hover bg with hoverScale', () => {
        render(<Chamber data-testid="c" bg="color.bg.surface" hoverScale="primary" />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':hover')
        expect(tag?.textContent).toContain('background-color')
    })

    it('injects exact shade when hoverShade is set', () => {
        render(<Chamber data-testid="c" bg="color.primary.500" hoverScale="primary" hoverShade={300} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':hover')
    })

    it('does not inject hover when hoverScale is false', () => {
        render(<Chamber data-testid="c" bg="color.primary.500" hoverScale={false} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag).toBeNull()
    })
})

// ─── Chamber _focus ───────────────────────────────────────────────────────────

describe('Chamber _focus', () => {
    it('injects :focus selector', () => {
        render(<Chamber data-testid="c" _focus={{ outlineStyle: 'solid', outlineColor: 'color.interactive.primary', outlineWidth: '2px' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':focus')
        expect(tag?.textContent).toContain('outline-style: solid')
    })
})

// ─── Chamber _active ──────────────────────────────────────────────────────────

describe('Chamber _active', () => {
    it('injects :active selector', () => {
        render(<Chamber data-testid="c" _active={{ opacity: 0.8 }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':active')
        expect(tag?.textContent).toContain('opacity: 0.8')
    })
})

// ─── Chamber _focusVisible ────────────────────────────────────────────────────

describe('Chamber _focusVisible', () => {
    it('injects :focus-visible selector', () => {
        render(<Chamber data-testid="c" _focusVisible={{ outlineColor: 'color.interactive.primary' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':focus-visible')
    })
})

// ─── Chamber _disabled ────────────────────────────────────────────────────────

describe('Chamber _disabled', () => {
    it('injects :disabled selector', () => {
        render(<Chamber data-testid="c" _disabled={{ opacity: 0.4, cursor: 'not-allowed' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':disabled')
        expect(tag?.textContent).toContain('opacity: 0.4')
        expect(tag?.textContent).toContain('cursor: not-allowed')
    })
})

// ─── Multiple pseudo states ───────────────────────────────────────────────────

describe('Chamber multiple pseudo states', () => {
    it('injects separate rules for each pseudo state', () => {
        render(
            <Chamber
                data-testid="c"
                _hover={{ bg: 'color.interactive.primary' }}
                _focus={{ outlineStyle: 'solid' }}
                _active={{ opacity: 0.8 }}
            />
        )
        const tags = document.head.querySelectorAll('[data-bb]')
        const allText = Array.from(tags).map(t => t.textContent).join('\n')
        expect(allText).toContain(':hover')
        expect(allText).toContain(':focus')
        expect(allText).toContain(':active')
    })
})

// ─── Tunnel pseudo styles ─────────────────────────────────────────────────────

describe('Tunnel _hover', () => {
    it('injects :hover for Tunnel color change', () => {
        render(<Tunnel data-testid="t" _hover={{ color: 'color.interactive.primary' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':hover')
        expect(tag?.textContent).toContain('color')
    })

    it('Tunnel element gets the generated className', () => {
        render(<Tunnel data-testid="t" _hover={{ color: 'color.interactive.primary' }} />)
        const el = screen.getByTestId('t')
        expect(el.className).toMatch(/^bb-/)
    })
})
