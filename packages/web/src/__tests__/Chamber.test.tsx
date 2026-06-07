import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { Chamber } from '../Chamber'
import { BadgerBase, extendBurrow } from '@badger-burrow/core'
import { defaultTokens } from '@badger-burrow/tokens'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── rendering ───────────────────────────────────────────────────────────────

describe('rendering', () => {
    it('renders a div by default', () => {
        render(<Chamber data-testid="box" />)
        expect(screen.getByTestId('box').tagName).toBe('DIV')
    })

    it('renders children', () => {
        render(<Chamber>hello</Chamber>)
        expect(screen.getByText('hello')).toBeTruthy()
    })

    it('forwards arbitrary HTML props', () => {
        render(<Chamber data-testid="box" id="my-box" />)
        expect(screen.getByTestId('box').id).toBe('my-box')
    })

    it('forwards className', () => {
        render(<Chamber data-testid="box" className="custom" />)
        expect(screen.getByTestId('box').className).toContain('custom')
    })
})

// ─── bg prop ─────────────────────────────────────────────────────────────────

describe('bg prop', () => {
    it('resolves a primitive colour token path to backgroundColor', () => {
        render(<Chamber data-testid="box" bg="color.primary.500" />)
        const style = screen.getByTestId('box').style
        expect(style.backgroundColor).toBeTruthy()
    })

    it('resolves a semantic colour token path to backgroundColor', () => {
        render(<Chamber data-testid="box" bg="color.bg.surface" />)
        const style = screen.getByTestId('box').style
        expect(style.backgroundColor).toBeTruthy()
    })

    it('accepts a raw colour string', () => {
        render(<Chamber data-testid="box" bg="#ff0000" />)
        expect(screen.getByTestId('box').style.backgroundColor).toBe('rgb(255, 0, 0)')
    })
})

// ─── padding props ────────────────────────────────────────────────────────────

describe('padding props', () => {
    it('p resolves a space token to padding', () => {
        render(<Chamber data-testid="box" p="space.4" />)
        expect(screen.getByTestId('box').style.padding).toBe('16px')
    })

    it('px sets paddingLeft and paddingRight', () => {
        render(<Chamber data-testid="box" px="space.4" />)
        const style = screen.getByTestId('box').style
        expect(style.paddingLeft).toBe('16px')
        expect(style.paddingRight).toBe('16px')
    })

    it('py sets paddingTop and paddingBottom', () => {
        render(<Chamber data-testid="box" py="space.4" />)
        const style = screen.getByTestId('box').style
        expect(style.paddingTop).toBe('16px')
        expect(style.paddingBottom).toBe('16px')
    })

    it('pt sets paddingTop only', () => {
        render(<Chamber data-testid="box" pt="space.2" />)
        expect(screen.getByTestId('box').style.paddingTop).toBe('8px')
    })

    it('pb sets paddingBottom only', () => {
        render(<Chamber data-testid="box" pb="space.2" />)
        expect(screen.getByTestId('box').style.paddingBottom).toBe('8px')
    })

    it('pl sets paddingLeft only', () => {
        render(<Chamber data-testid="box" pl="space.2" />)
        expect(screen.getByTestId('box').style.paddingLeft).toBe('8px')
    })

    it('pr sets paddingRight only', () => {
        render(<Chamber data-testid="box" pr="space.2" />)
        expect(screen.getByTestId('box').style.paddingRight).toBe('8px')
    })

    it('accepts a raw number for p', () => {
        render(<Chamber data-testid="box" p={32} />)
        expect(screen.getByTestId('box').style.padding).toBe('32px')
    })
})

// ─── margin props ─────────────────────────────────────────────────────────────

describe('margin props', () => {
    it('m resolves a space token to margin', () => {
        render(<Chamber data-testid="box" m="space.4" />)
        expect(screen.getByTestId('box').style.margin).toBe('16px')
    })

    it('mx sets marginLeft and marginRight', () => {
        render(<Chamber data-testid="box" mx="space.4" />)
        const style = screen.getByTestId('box').style
        expect(style.marginLeft).toBe('16px')
        expect(style.marginRight).toBe('16px')
    })

    it('my sets marginTop and marginBottom', () => {
        render(<Chamber data-testid="box" my="space.4" />)
        const style = screen.getByTestId('box').style
        expect(style.marginTop).toBe('16px')
        expect(style.marginBottom).toBe('16px')
    })
})

// ─── radius prop ──────────────────────────────────────────────────────────────

describe('radius prop', () => {
    it('resolves a radius token to borderRadius', () => {
        render(<Chamber data-testid="box" radius="radius.md" />)
        expect(screen.getByTestId('box').style.borderRadius).toBe('8px')
    })

    it('accepts a raw number', () => {
        render(<Chamber data-testid="box" radius={12} />)
        expect(screen.getByTestId('box').style.borderRadius).toBe('12px')
    })
})

// ─── gap prop ─────────────────────────────────────────────────────────────────

describe('gap prop', () => {
    it('resolves a space token to gap', () => {
        render(<Chamber data-testid="box" gap="space.4" />)
        expect(screen.getByTestId('box').style.gap).toBe('16px')
    })

    it('accepts a raw number', () => {
        render(<Chamber data-testid="box" gap={8} />)
        expect(screen.getByTestId('box').style.gap).toBe('8px')
    })
})

// ─── style override ───────────────────────────────────────────────────────────

describe('style override', () => {
    it('style prop overrides a token prop', () => {
        render(<Chamber data-testid="box" p="space.4" style={{ padding: '99px' }} />)
        expect(screen.getByTestId('box').style.padding).toBe('99px')
    })

    it('style prop merges with token props', () => {
        render(<Chamber data-testid="box" radius="radius.md" style={{ margin: '4px' }} />)
        const style = screen.getByTestId('box').style
        expect(style.borderRadius).toBe('8px')
        expect(style.margin).toBe('4px')
    })
})

// ─── live token updates ───────────────────────────────────────────────────────

describe('live token updates', () => {
    it('re-renders when tokens change via extendBurrow', () => {
        render(<Chamber data-testid="box" bg="color.primary.500" />)
        const before = screen.getByTestId('box').style.backgroundColor

        act(() => {
            extendBurrow({ primitive: { color: { primary: { 500: '#ff0000' } } } })
        })

        const after = screen.getByTestId('box').style.backgroundColor
        expect(after).not.toBe(before)
        expect(after).toBe('rgb(255, 0, 0)')
    })
})

// ─── as prop ──────────────────────────────────────────────────────────────────

describe('as prop', () => {
    it('renders as div by default', () => {
        render(<Chamber data-testid="c" />)
        expect(screen.getByTestId('c').tagName).toBe('DIV')
    })
    it('renders as button', () => {
        render(<Chamber data-testid="c" as="button" />)
        expect(screen.getByTestId('c').tagName).toBe('BUTTON')
    })
    it('renders as nav', () => {
        render(<Chamber data-testid="c" as="nav" />)
        expect(screen.getByTestId('c').tagName).toBe('NAV')
    })
    it('renders as section', () => {
        render(<Chamber data-testid="c" as="section" />)
        expect(screen.getByTestId('c').tagName).toBe('SECTION')
    })
    it('renders as a', () => {
        render(<Chamber data-testid="c" as="a" href="#" />)
        expect(screen.getByTestId('c').tagName).toBe('A')
    })
    it('renders as ul', () => {
        render(<Chamber data-testid="c" as="ul" />)
        expect(screen.getByTestId('c').tagName).toBe('UL')
    })
    it('passes token props through when using as', () => {
        render(<Chamber data-testid="c" as="button" bg="color.primary.500" p="space.4" />)
        const el = screen.getByTestId('c')
        expect(el.tagName).toBe('BUTTON')
        expect(el.style.backgroundColor).toBeTruthy()
        expect(el.style.padding).toBeTruthy()
    })
    it('pseudo props work when using as', () => {
        render(<Chamber data-testid="c" as="button" _hover={{ cursor: 'pointer' }} />)
        const tag = document.head.querySelector('[data-bb]')
        expect(tag?.textContent).toContain(':hover')
    })
})
