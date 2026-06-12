import React from 'react'
import { render, screen } from '@testing-library/react'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'
import { BadgerBase } from '@badger-burrow/core'

beforeEach(() => { BadgerBase.reset() })

// ─── ref forwarding (works on React 18 via forwardRef; also 19) ───────────────

describe('Chamber ref forwarding', () => {
    it('forwards a ref to the rendered div', () => {
        const ref = React.createRef<HTMLElement>()
        render(<Chamber ref={ref} data-testid="c" />)
        expect(ref.current).toBe(screen.getByTestId('c'))
        expect(ref.current?.tagName).toBe('DIV')
    })

    it('forwards a ref to the element chosen via as', () => {
        const ref = React.createRef<HTMLElement>()
        render(<Chamber as="button" ref={ref}>Go</Chamber>)
        expect(ref.current?.tagName).toBe('BUTTON')
    })
})

describe('Tunnel ref forwarding', () => {
    it('forwards a ref to the rendered span', () => {
        const ref = React.createRef<HTMLElement>()
        render(<Tunnel ref={ref}>hi</Tunnel>)
        expect(ref.current?.tagName).toBe('SPAN')
    })

    it('forwards a ref to the element chosen via as', () => {
        const ref = React.createRef<HTMLElement>()
        render(<Tunnel as="h1" ref={ref}>Title</Tunnel>)
        expect(ref.current?.tagName).toBe('H1')
    })
})

// ─── span as a Chamber tag (inline-level box, valid phrasing content) ──────────

describe('Chamber as="span"', () => {
    it('renders a span', () => {
        render(<Chamber as="span" data-testid="c" />)
        expect(screen.getByTestId('c').tagName).toBe('SPAN')
    })

    it('is valid inside phrasing content with token styling', () => {
        render(
            <p>
                Status: <Chamber as="span" data-testid="badge" bg="interactive.primary" px="2" radius="full">new</Chamber>
            </p>
        )
        const badge = screen.getByTestId('badge')
        expect(badge.tagName).toBe('SPAN')
        expect(badge.style.backgroundColor).toBeTruthy()
    })
})
