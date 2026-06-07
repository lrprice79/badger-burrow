import React from 'react'
import { render, screen } from '@testing-library/react'
import { Tunnel } from '../Tunnel'
import { BadgerBase } from '@badger-burrow/core'

beforeEach(() => { BadgerBase.reset() })

// ─── text-decoration extras ───────────────────────────────────────────────────

describe('text-decoration extras', () => {
    it('textDecorationColor resolves a colour token', () => {
        render(<Tunnel data-testid="t" textDecorationColor="color.interactive.primary" />)
        expect(screen.getByTestId('t').style.textDecorationColor).toBeTruthy()
    })

    it('textDecorationColor accepts a raw colour', () => {
        render(<Tunnel data-testid="t" textDecorationColor="#ff0000" />)
        expect(screen.getByTestId('t').style.textDecorationColor).toBeTruthy()
    })

    it('textDecorationStyle sets decoration style', () => {
        render(<Tunnel data-testid="t" textDecorationStyle="wavy" />)
        expect(screen.getByTestId('t').style.textDecorationStyle).toBe('wavy')
    })

    it('textDecorationThickness sets thickness', () => {
        render(<Tunnel data-testid="t" textDecorationThickness={2} />)
        expect(screen.getByTestId('t').style.textDecorationThickness).toBeTruthy()
    })

    it('textUnderlineOffset sets underline offset', () => {
        render(<Tunnel data-testid="t" textUnderlineOffset={3} />)
        expect(screen.getByTestId('t').style.textUnderlineOffset).toBeTruthy()
    })
})

// ─── vertical-align ───────────────────────────────────────────────────────────

describe('verticalAlign', () => {
    it('sets verticalAlign: middle', () => {
        render(<Tunnel data-testid="t" verticalAlign="middle" />)
        expect(screen.getByTestId('t').style.verticalAlign).toBe('middle')
    })

    it('sets verticalAlign: top', () => {
        render(<Tunnel data-testid="t" verticalAlign="top" />)
        expect(screen.getByTestId('t').style.verticalAlign).toBe('top')
    })
})

// ─── word-break / overflow-wrap ───────────────────────────────────────────────

describe('wordBreak', () => {
    it('sets wordBreak: break-all', () => {
        render(<Tunnel data-testid="t" wordBreak="break-all" />)
        expect(screen.getByTestId('t').style.wordBreak).toBe('break-all')
    })

    it('sets wordBreak: keep-all', () => {
        render(<Tunnel data-testid="t" wordBreak="keep-all" />)
        expect(screen.getByTestId('t').style.wordBreak).toBe('keep-all')
    })
})

describe('overflowWrap', () => {
    it('sets overflowWrap: break-word', () => {
        render(<Tunnel data-testid="t" overflowWrap="break-word" />)
        expect(screen.getByTestId('t').style.overflowWrap).toBe('break-word')
    })

    it('sets overflowWrap: anywhere', () => {
        render(<Tunnel data-testid="t" overflowWrap="anywhere" />)
        expect(screen.getByTestId('t').style.overflowWrap).toBe('anywhere')
    })
})

// ─── user-select ──────────────────────────────────────────────────────────────

describe('userSelect', () => {
    it('sets userSelect: none', () => {
        render(<Tunnel data-testid="t" userSelect="none" />)
        expect(screen.getByTestId('t').style.userSelect).toBe('none')
    })
})

// ─── line-clamp ───────────────────────────────────────────────────────────────

describe('lineClamp', () => {
    it('lineClamp sets display: -webkit-box and overflow: hidden', () => {
        render(<Tunnel data-testid="t" lineClamp={2} />)
        const style = screen.getByTestId('t').style
        expect(style.display).toBe('-webkit-box')
        expect(style.overflow).toBe('hidden')
    })

    it('lineClamp works for any number of lines', () => {
        render(<Tunnel data-testid="t" lineClamp={3} />)
        // overflow:hidden confirms the clamp styles were applied
        expect(screen.getByTestId('t').style.overflow).toBe('hidden')
    })
})
