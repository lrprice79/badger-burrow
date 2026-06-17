import React from 'react'
import { render, screen } from '@testing-library/react'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'
import { BadgerBase } from '@purple-brock/burrow-core'

beforeEach(() => { BadgerBase.reset() })

// ─── __debug never leaks to the element ───────────────────────────────────────

describe('__debug — invisible to the DOM contract', () => {
    it('does not forward __debug as a DOM attribute', () => {
        render(<Chamber __debug data-testid="c" />)
        expect(screen.getByTestId('c').hasAttribute('__debug')).toBe(false)
    })

    it('adds no debug outline / attribute when __debug is absent', () => {
        render(<Chamber data-testid="c" />)
        const el = screen.getByTestId('c')
        expect(el.style.outline).toBeFalsy()
        expect(el.hasAttribute('data-bb-debug')).toBe(false)
    })
})

// ─── dev behaviour (jest NODE_ENV = 'test', so debug is active) ────────────────

describe('__debug — active in dev', () => {
    it('outlines the element and exposes a render counter', () => {
        render(<Chamber __debug data-testid="c" />)
        const el = screen.getByTestId('c')
        expect(el.style.outline).toBeTruthy()
        expect(el.getAttribute('data-bb-debug')).toMatch(/⟳\d/)
    })

    it('still renders real styles and children', () => {
        render(<Chamber __debug bg="primary.500" data-testid="c">hi</Chamber>)
        const el = screen.getByTestId('c')
        expect(el.style.backgroundColor).toBeTruthy()
        expect(el.textContent).toBe('hi')
    })

    it('logs a console group with the resolved styles', () => {
        const group = jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {})
        const table = jest.spyOn(console, 'table').mockImplementation(() => {})
        const end = jest.spyOn(console, 'groupEnd').mockImplementation(() => {})
        render(<Chamber __debug bg="primary.500" />)
        expect(group).toHaveBeenCalled()
        expect(table).toHaveBeenCalled()
        group.mockRestore(); table.mockRestore(); end.mockRestore()
    })

    it('still forwards a ref while debugging', () => {
        const ref = React.createRef<HTMLElement>()
        render(<Chamber __debug ref={ref} />)
        expect(ref.current?.tagName).toBe('DIV')
    })

    it('works on Tunnel too', () => {
        render(<Tunnel __debug data-testid="t">x</Tunnel>)
        const el = screen.getByTestId('t')
        expect(el.style.outline).toBeTruthy()
        expect(el.textContent).toBe('x')
    })
})

// ─── production = total no-op ─────────────────────────────────────────────────

describe('__debug — no-op in production', () => {
    const proc = (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process
    const realEnv = proc.env.NODE_ENV
    afterEach(() => { proc.env.NODE_ENV = realEnv })

    it('adds no outline, no attribute, and does not log', () => {
        proc.env.NODE_ENV = 'production'
        const group = jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {})
        render(<Chamber __debug data-testid="c" />)
        const el = screen.getByTestId('c')
        expect(el.style.outline).toBeFalsy()
        expect(el.hasAttribute('data-bb-debug')).toBe(false)
        expect(group).not.toHaveBeenCalled()
        group.mockRestore()
    })
})
