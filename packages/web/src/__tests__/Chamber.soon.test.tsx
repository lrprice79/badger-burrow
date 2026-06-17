import React from 'react'
import { render, screen } from '@testing-library/react'
import { Chamber } from '../Chamber'
import { BadgerBase } from '@purple-brock/burrow-core'

beforeEach(() => { BadgerBase.reset() })

// ─── per-side border ──────────────────────────────────────────────────────────

describe('per-side border', () => {
    it('borderTop sets border-top shorthand', () => {
        render(<Chamber data-testid="b" borderTop="1px solid red" />)
        expect(screen.getByTestId('b').style.borderTop).toBeTruthy()
    })

    it('borderRight sets border-right shorthand', () => {
        render(<Chamber data-testid="b" borderRight="2px dashed blue" />)
        expect(screen.getByTestId('b').style.borderRight).toBeTruthy()
    })

    it('borderBottom sets border-bottom shorthand', () => {
        render(<Chamber data-testid="b" borderBottom="1px solid #ccc" />)
        expect(screen.getByTestId('b').style.borderBottom).toBeTruthy()
    })

    it('borderLeft sets border-left shorthand', () => {
        render(<Chamber data-testid="b" borderLeft="4px solid green" />)
        expect(screen.getByTestId('b').style.borderLeft).toBeTruthy()
    })

    it('borderTopColor resolves a colour token', () => {
        render(<Chamber data-testid="b" borderTopColor="color.interactive.primary" />)
        expect(screen.getByTestId('b').style.borderTopColor).toBeTruthy()
    })

    it('borderRightColor accepts a raw colour', () => {
        render(<Chamber data-testid="b" borderRightColor="#ff0000" />)
        expect(screen.getByTestId('b').style.borderRightColor).toBeTruthy()
    })

    it('borderBottomColor resolves a colour token', () => {
        render(<Chamber data-testid="b" borderBottomColor="color.border.default" />)
        expect(screen.getByTestId('b').style.borderBottomColor).toBeTruthy()
    })

    it('borderLeftColor accepts a raw colour', () => {
        render(<Chamber data-testid="b" borderLeftColor="#0000ff" />)
        expect(screen.getByTestId('b').style.borderLeftColor).toBeTruthy()
    })

    it('borderTopWidth sets top border width', () => {
        render(<Chamber data-testid="b" borderTopWidth={2} />)
        expect(screen.getByTestId('b').style.borderTopWidth).toBe('2px')
    })

    it('borderRightWidth sets right border width', () => {
        render(<Chamber data-testid="b" borderRightWidth={1} />)
        expect(screen.getByTestId('b').style.borderRightWidth).toBe('1px')
    })

    it('borderBottomWidth sets bottom border width', () => {
        render(<Chamber data-testid="b" borderBottomWidth={3} />)
        expect(screen.getByTestId('b').style.borderBottomWidth).toBe('3px')
    })

    it('borderLeftWidth sets left border width', () => {
        render(<Chamber data-testid="b" borderLeftWidth={4} />)
        expect(screen.getByTestId('b').style.borderLeftWidth).toBe('4px')
    })

    it('borderTopStyle sets top border style', () => {
        render(<Chamber data-testid="b" borderTopStyle="dashed" />)
        expect(screen.getByTestId('b').style.borderTopStyle).toBe('dashed')
    })

    it('borderBottomStyle sets bottom border style', () => {
        render(<Chamber data-testid="b" borderBottomStyle="dotted" />)
        expect(screen.getByTestId('b').style.borderBottomStyle).toBe('dotted')
    })

    it('borderStyle sets all sides border style', () => {
        render(<Chamber data-testid="b" borderStyle="solid" />)
        expect(screen.getByTestId('b').style.borderStyle).toBe('solid')
    })
})

// ─── background image ─────────────────────────────────────────────────────────

describe('background image', () => {
    it('backgroundImage sets background-image', () => {
        render(<Chamber data-testid="b" backgroundImage="url('/img.png')" />)
        expect(screen.getByTestId('b').style.backgroundImage).toBeTruthy()
    })

    it('backgroundSize sets background-size', () => {
        render(<Chamber data-testid="b" backgroundSize="cover" />)
        expect(screen.getByTestId('b').style.backgroundSize).toBe('cover')
    })

    it('backgroundPosition sets background-position', () => {
        render(<Chamber data-testid="b" backgroundPosition="center" />)
        expect(screen.getByTestId('b').style.backgroundPosition).toBe('center')
    })

    it('backgroundRepeat sets background-repeat', () => {
        render(<Chamber data-testid="b" backgroundRepeat="no-repeat" />)
        expect(screen.getByTestId('b').style.backgroundRepeat).toBe('no-repeat')
    })

    it('backgroundAttachment sets background-attachment', () => {
        render(<Chamber data-testid="b" backgroundAttachment="fixed" />)
        expect(screen.getByTestId('b').style.backgroundAttachment).toBe('fixed')
    })

    it('backgroundClip sets background-clip', () => {
        render(<Chamber data-testid="b" backgroundClip="text" />)
        expect(screen.getByTestId('b').style.backgroundClip).toBeTruthy()
    })

    it('backgroundOrigin sets background-origin', () => {
        render(<Chamber data-testid="b" backgroundOrigin="content-box" />)
        expect(screen.getByTestId('b').style.backgroundOrigin).toBe('content-box')
    })

    it('backgroundBlendMode sets background-blend-mode', () => {
        render(<Chamber data-testid="b" backgroundBlendMode="multiply" />)
        expect(screen.getByTestId('b').style.backgroundBlendMode).toBe('multiply')
    })
})

// ─── scroll snap ──────────────────────────────────────────────────────────────

describe('scroll snap', () => {
    it('scrollSnapType sets scroll-snap-type', () => {
        render(<Chamber data-testid="b" scrollSnapType="x mandatory" />)
        expect(screen.getByTestId('b').style.scrollSnapType).toBeTruthy()
    })

    it('scrollSnapAlign sets scroll-snap-align', () => {
        render(<Chamber data-testid="b" scrollSnapAlign="start" />)
        expect(screen.getByTestId('b').style.scrollSnapAlign).toBeTruthy()
    })

    it('overscrollBehavior sets overscroll-behavior', () => {
        render(<Chamber data-testid="b" overscrollBehavior="contain" />)
        expect(screen.getByTestId('b').style.overscrollBehavior).toBeTruthy()
    })

    it('overscrollBehaviorX sets overscroll-behavior-x', () => {
        render(<Chamber data-testid="b" overscrollBehaviorX="none" />)
        expect(screen.getByTestId('b').style.overscrollBehaviorX).toBeTruthy()
    })

    it('overscrollBehaviorY sets overscroll-behavior-y', () => {
        render(<Chamber data-testid="b" overscrollBehaviorY="auto" />)
        expect(screen.getByTestId('b').style.overscrollBehaviorY).toBeTruthy()
    })

    it('scrollBehavior sets scroll-behavior', () => {
        render(<Chamber data-testid="b" scrollBehavior="smooth" />)
        expect(screen.getByTestId('b').style.scrollBehavior).toBeTruthy()
    })
})

// ─── grid extras ──────────────────────────────────────────────────────────────

describe('grid extras', () => {
    it('gridAutoColumns sets grid-auto-columns', () => {
        render(<Chamber data-testid="b" gridAutoColumns="1fr" />)
        expect(screen.getByTestId('b').style.gridAutoColumns).toBe('1fr')
    })

    it('gridAutoRows sets grid-auto-rows', () => {
        render(<Chamber data-testid="b" gridAutoRows="auto" />)
        expect(screen.getByTestId('b').style.gridAutoRows).toBe('auto')
    })

    it('gridAutoFlow sets grid-auto-flow', () => {
        render(<Chamber data-testid="b" gridAutoFlow="row dense" />)
        expect(screen.getByTestId('b').style.gridAutoFlow).toBeTruthy()
    })
})

// ─── inset ────────────────────────────────────────────────────────────────────

describe('inset', () => {
    it('inset sets all sides from a space token', () => {
        render(<Chamber data-testid="b" inset="space.4" />)
        expect(screen.getByTestId('b').style.inset).toBeTruthy()
    })

    it('inset accepts a raw value', () => {
        render(<Chamber data-testid="b" inset={0} />)
        expect(screen.getByTestId('b').style.inset).toBeTruthy()
    })
})

// ─── animation ────────────────────────────────────────────────────────────────

describe('animation', () => {
    it('animation sets animation shorthand', () => {
        render(<Chamber data-testid="b" animation="spin 1s linear infinite" />)
        expect(screen.getByTestId('b').style.animation).toBeTruthy()
    })

    it('animationName sets animation-name', () => {
        render(<Chamber data-testid="b" animationName="fadeIn" />)
        expect(screen.getByTestId('b').style.animationName).toBe('fadeIn')
    })

    it('animationDuration sets animation-duration', () => {
        render(<Chamber data-testid="b" animationDuration="300ms" />)
        expect(screen.getByTestId('b').style.animationDuration).toBe('300ms')
    })

    it('animationTimingFunction sets animation-timing-function', () => {
        render(<Chamber data-testid="b" animationTimingFunction="ease-in-out" />)
        expect(screen.getByTestId('b').style.animationTimingFunction).toBe('ease-in-out')
    })

    it('animationDelay sets animation-delay', () => {
        render(<Chamber data-testid="b" animationDelay="100ms" />)
        expect(screen.getByTestId('b').style.animationDelay).toBe('100ms')
    })

    it('animationIterationCount sets animation-iteration-count', () => {
        render(<Chamber data-testid="b" animationIterationCount="infinite" />)
        expect(screen.getByTestId('b').style.animationIterationCount).toBe('infinite')
    })

    it('animationDirection sets animation-direction', () => {
        render(<Chamber data-testid="b" animationDirection="alternate" />)
        expect(screen.getByTestId('b').style.animationDirection).toBe('alternate')
    })

    it('animationFillMode sets animation-fill-mode', () => {
        render(<Chamber data-testid="b" animationFillMode="forwards" />)
        expect(screen.getByTestId('b').style.animationFillMode).toBe('forwards')
    })

    it('animationPlayState sets animation-play-state', () => {
        render(<Chamber data-testid="b" animationPlayState="paused" />)
        expect(screen.getByTestId('b').style.animationPlayState).toBe('paused')
    })
})

// ─── motion token resolution ──────────────────────────────────────────────────

describe('motion tokens', () => {
    it('transition keyword resolves to a full shorthand', () => {
        render(<Chamber data-testid="b" transition="fast" />)
        const t = screen.getByTestId('b').style.transition
        expect(t).toContain('150ms')
        expect(t).toContain('cubic-bezier')
    })

    it('transitionDuration token resolves to ms', () => {
        render(<Chamber data-testid="b" transitionDuration="normal" />)
        expect(screen.getByTestId('b').style.transitionDuration).toBe('300ms')
    })

    it('transitionTimingFunction token resolves to cubic-bezier', () => {
        render(<Chamber data-testid="b" transitionTimingFunction="sharp" />)
        expect(screen.getByTestId('b').style.transitionTimingFunction).toContain('cubic-bezier')
    })

    it('raw transition string still works', () => {
        render(<Chamber data-testid="b" transition="opacity 0.2s ease" />)
        expect(screen.getByTestId('b').style.transition).toContain('opacity')
    })
})
