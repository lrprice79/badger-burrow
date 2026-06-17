import React from 'react'
import { render, screen } from '@testing-library/react'
import { Chamber } from '../Chamber'
import { BadgerBase } from '@purple-brock/burrow-core'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── grid ─────────────────────────────────────────────────────────────────────

describe('grid', () => {
    it('gridTemplateColumns sets grid template columns', () => {
        render(<Chamber data-testid="b" gridTemplateColumns="1fr 1fr" />)
        expect(screen.getByTestId('b').style.gridTemplateColumns).toBe('1fr 1fr')
    })

    it('gridTemplateRows sets grid template rows', () => {
        render(<Chamber data-testid="b" gridTemplateRows="auto 1fr" />)
        expect(screen.getByTestId('b').style.gridTemplateRows).toBe('auto 1fr')
    })

    it('gridTemplateAreas sets grid template areas', () => {
        render(<Chamber data-testid="b" gridTemplateAreas='"header" "main"' />)
        expect(screen.getByTestId('b').style.gridTemplateAreas).toBeTruthy()
    })

    it('gridColumn sets grid column span', () => {
        render(<Chamber data-testid="b" gridColumn="1 / 3" />)
        expect(screen.getByTestId('b').style.gridColumn).toBe('1 / 3')
    })

    it('gridRow sets grid row span', () => {
        render(<Chamber data-testid="b" gridRow="1 / 2" />)
        expect(screen.getByTestId('b').style.gridRow).toBe('1 / 2')
    })

    it('gridArea sets grid area', () => {
        render(<Chamber data-testid="b" gridArea="header" />)
        expect(screen.getByTestId('b').style.gridArea).toBe('header')
    })

    it('columnGap resolves a space token', () => {
        render(<Chamber data-testid="b" columnGap="space.4" />)
        expect(screen.getByTestId('b').style.columnGap).toBe('16px')
    })

    it('rowGap resolves a space token', () => {
        render(<Chamber data-testid="b" rowGap="space.2" />)
        expect(screen.getByTestId('b').style.rowGap).toBe('8px')
    })

    it('columnGap accepts a raw number', () => {
        render(<Chamber data-testid="b" columnGap={24} />)
        expect(screen.getByTestId('b').style.columnGap).toBe('24px')
    })
})

// ─── flex extras ──────────────────────────────────────────────────────────────

describe('flex extras', () => {
    it('flexGrow sets flexGrow', () => {
        render(<Chamber data-testid="b" flexGrow={1} />)
        expect(screen.getByTestId('b').style.flexGrow).toBe('1')
    })

    it('flexShrink sets flexShrink', () => {
        render(<Chamber data-testid="b" flexShrink={0} />)
        expect(screen.getByTestId('b').style.flexShrink).toBe('0')
    })

    it('flexBasis sets flexBasis from token', () => {
        render(<Chamber data-testid="b" flexBasis="space.16" />)
        expect(screen.getByTestId('b').style.flexBasis).toBe('64px')
    })

    it('flexBasis accepts a raw string', () => {
        render(<Chamber data-testid="b" flexBasis="50%" />)
        expect(screen.getByTestId('b').style.flexBasis).toBe('50%')
    })

    it('alignSelf sets alignSelf', () => {
        render(<Chamber data-testid="b" alignSelf="flex-end" />)
        expect(screen.getByTestId('b').style.alignSelf).toBe('flex-end')
    })

    it('justifySelf sets justifySelf', () => {
        render(<Chamber data-testid="b" justifySelf="center" />)
        expect(screen.getByTestId('b').style.justifySelf).toBe('center')
    })

    it('alignContent sets alignContent', () => {
        render(<Chamber data-testid="b" alignContent="space-between" />)
        expect(screen.getByTestId('b').style.alignContent).toBe('space-between')
    })

    it('order sets order', () => {
        render(<Chamber data-testid="b" order={2} />)
        expect(screen.getByTestId('b').style.order).toBe('2')
    })
})

// ─── box extras ───────────────────────────────────────────────────────────────

describe('box extras', () => {
    it('boxSizing sets boxSizing', () => {
        render(<Chamber data-testid="b" boxSizing="border-box" />)
        expect(screen.getByTestId('b').style.boxSizing).toBe('border-box')
    })

    it('aspectRatio sets aspectRatio', () => {
        render(<Chamber data-testid="b" aspectRatio="16 / 9" />)
        expect(screen.getByTestId('b').style.aspectRatio).toBeTruthy()
    })
})

// ─── visibility / interaction ─────────────────────────────────────────────────

describe('visibility / interaction', () => {
    it('visibility sets visibility', () => {
        render(<Chamber data-testid="b" visibility="hidden" />)
        expect(screen.getByTestId('b').style.visibility).toBe('hidden')
    })

    it('pointerEvents sets pointerEvents', () => {
        render(<Chamber data-testid="b" pointerEvents="none" />)
        expect(screen.getByTestId('b').style.pointerEvents).toBe('none')
    })

    it('cursor sets cursor', () => {
        render(<Chamber data-testid="b" cursor="pointer" />)
        expect(screen.getByTestId('b').style.cursor).toBe('pointer')
    })
})

// ─── transform ────────────────────────────────────────────────────────────────

describe('transform', () => {
    it('transform sets transform', () => {
        render(<Chamber data-testid="b" transform="rotate(45deg)" />)
        expect(screen.getByTestId('b').style.transform).toBe('rotate(45deg)')
    })
})
