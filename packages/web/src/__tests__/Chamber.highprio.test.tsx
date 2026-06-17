import React from 'react'
import { render, screen } from '@testing-library/react'
import { Chamber } from '../Chamber'
import { BadgerBase } from '@purple-brock/burrow-core'

beforeEach(() => { BadgerBase.reset() })

// ─── outline ─────────────────────────────────────────────────────────────────

describe('outline', () => {
    it('outline sets outline shorthand', () => {
        render(<Chamber data-testid="b" outline="2px solid blue" />)
        expect(screen.getByTestId('b').style.outline).toBeTruthy()
    })

    it('outlineColor resolves a semantic token', () => {
        render(<Chamber data-testid="b" outlineColor="color.interactive.primary" />)
        expect(screen.getByTestId('b').style.outlineColor).toBeTruthy()
    })

    it('outlineColor accepts a raw colour', () => {
        render(<Chamber data-testid="b" outlineColor="#ff0000" />)
        expect(screen.getByTestId('b').style.outlineColor).toBe('rgb(255, 0, 0)')
    })

    it('outlineWidth sets outlineWidth', () => {
        render(<Chamber data-testid="b" outlineWidth={2} />)
        expect(screen.getByTestId('b').style.outlineWidth).toBe('2px')
    })

    it('outlineStyle sets outlineStyle', () => {
        render(<Chamber data-testid="b" outlineStyle="dashed" />)
        expect(screen.getByTestId('b').style.outlineStyle).toBe('dashed')
    })

    it('outlineOffset sets outlineOffset', () => {
        render(<Chamber data-testid="b" outlineOffset={4} />)
        expect(screen.getByTestId('b').style.outlineOffset).toBe('4px')
    })
})

// ─── overflow-x / overflow-y ─────────────────────────────────────────────────

describe('overflow-x / overflow-y', () => {
    it('overflowX sets overflow-x', () => {
        render(<Chamber data-testid="b" overflowX="hidden" />)
        expect(screen.getByTestId('b').style.overflowX).toBe('hidden')
    })

    it('overflowY sets overflow-y', () => {
        render(<Chamber data-testid="b" overflowY="auto" />)
        expect(screen.getByTestId('b').style.overflowY).toBe('auto')
    })

    it('overflowX and overflowY can differ', () => {
        render(<Chamber data-testid="b" overflowX="hidden" overflowY="scroll" />)
        const style = screen.getByTestId('b').style
        expect(style.overflowX).toBe('hidden')
        expect(style.overflowY).toBe('scroll')
    })
})

// ─── transition ───────────────────────────────────────────────────────────────

describe('transition', () => {
    it('transition sets transition shorthand', () => {
        render(<Chamber data-testid="b" transition="all 0.2s ease" />)
        expect(screen.getByTestId('b').style.transition).toBeTruthy()
    })

    it('transitionProperty sets transition-property', () => {
        render(<Chamber data-testid="b" transitionProperty="opacity" />)
        expect(screen.getByTestId('b').style.transitionProperty).toBe('opacity')
    })

    it('transitionDuration sets transition-duration', () => {
        render(<Chamber data-testid="b" transitionDuration="200ms" />)
        expect(screen.getByTestId('b').style.transitionDuration).toBe('200ms')
    })

    it('transitionTimingFunction sets easing', () => {
        render(<Chamber data-testid="b" transitionTimingFunction="ease-in-out" />)
        expect(screen.getByTestId('b').style.transitionTimingFunction).toBe('ease-in-out')
    })

    it('transitionDelay sets transition-delay', () => {
        render(<Chamber data-testid="b" transitionDelay="100ms" />)
        expect(screen.getByTestId('b').style.transitionDelay).toBe('100ms')
    })
})

// ─── per-corner border radius ─────────────────────────────────────────────────

describe('per-corner border radius', () => {
    it('borderTopLeftRadius resolves a radius token', () => {
        render(<Chamber data-testid="b" borderTopLeftRadius="radius.md" />)
        expect(screen.getByTestId('b').style.borderTopLeftRadius).toBe('8px')
    })

    it('borderTopRightRadius resolves a radius token', () => {
        render(<Chamber data-testid="b" borderTopRightRadius="radius.lg" />)
        expect(screen.getByTestId('b').style.borderTopRightRadius).toBe('16px')
    })

    it('borderBottomLeftRadius resolves a radius token', () => {
        render(<Chamber data-testid="b" borderBottomLeftRadius="radius.sm" />)
        expect(screen.getByTestId('b').style.borderBottomLeftRadius).toBe('4px')
    })

    it('borderBottomRightRadius resolves a radius token', () => {
        render(<Chamber data-testid="b" borderBottomRightRadius={12} />)
        expect(screen.getByTestId('b').style.borderBottomRightRadius).toBe('12px')
    })

    it('per-corner and radius can coexist — radius sets all, per-corner overrides one', () => {
        render(<Chamber data-testid="b" radius="radius.md" borderTopLeftRadius="radius.full" />)
        const style = screen.getByTestId('b').style
        expect(style.borderRadius).toBe('8px')
        expect(style.borderTopLeftRadius).toBe('9999px')
    })
})

// ─── touch-action ─────────────────────────────────────────────────────────────

describe('touchAction', () => {
    it('sets touchAction: none', () => {
        render(<Chamber data-testid="b" touchAction="none" />)
        expect(screen.getByTestId('b').style.touchAction).toBe('none')
    })

    it('sets touchAction: pan-y', () => {
        render(<Chamber data-testid="b" touchAction="pan-y" />)
        expect(screen.getByTestId('b').style.touchAction).toBe('pan-y')
    })
})

// ─── user-select ──────────────────────────────────────────────────────────────

describe('userSelect', () => {
    it('sets userSelect: none', () => {
        render(<Chamber data-testid="b" userSelect="none" />)
        expect(screen.getByTestId('b').style.userSelect).toBe('none')
    })

    it('sets userSelect: text', () => {
        render(<Chamber data-testid="b" userSelect="text" />)
        expect(screen.getByTestId('b').style.userSelect).toBe('text')
    })
})

// ─── filter ───────────────────────────────────────────────────────────────────

describe('filter', () => {
    it('sets filter', () => {
        render(<Chamber data-testid="b" filter="blur(4px)" />)
        expect(screen.getByTestId('b').style.filter).toBe('blur(4px)')
    })

    it('sets backdropFilter', () => {
        render(<Chamber data-testid="b" backdropFilter="blur(8px)" />)
        expect(screen.getByTestId('b').style.backdropFilter).toBeTruthy()
    })
})

// ─── mix-blend-mode ───────────────────────────────────────────────────────────

describe('mixBlendMode', () => {
    it('sets mixBlendMode', () => {
        render(<Chamber data-testid="b" mixBlendMode="multiply" />)
        expect(screen.getByTestId('b').style.mixBlendMode).toBe('multiply')
    })
})
