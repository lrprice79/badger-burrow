import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { Tunnel } from '../Tunnel'
import { BadgerBase, extendBurrow } from '@purple-brock/burrow-core'

beforeEach(() => {
    BadgerBase.reset()
})

// ─── rendering ───────────────────────────────────────────────────────────────

describe('rendering', () => {
    it('renders a span by default', () => {
        render(<Tunnel data-testid="t" />)
        expect(screen.getByTestId('t').tagName).toBe('SPAN')
    })

    it('renders children', () => {
        render(<Tunnel>hello</Tunnel>)
        expect(screen.getByText('hello')).toBeTruthy()
    })

    it('forwards arbitrary HTML props', () => {
        render(<Tunnel data-testid="t" id="my-text" />)
        expect(screen.getByTestId('t').id).toBe('my-text')
    })

    it('forwards className', () => {
        render(<Tunnel data-testid="t" className="custom" />)
        expect(screen.getByTestId('t').className).toContain('custom')
    })
})

// ─── as prop ──────────────────────────────────────────────────────────────────

describe('as prop', () => {
    it('renders a p tag', () => {
        render(<Tunnel as="p" data-testid="t" />)
        expect(screen.getByTestId('t').tagName).toBe('P')
    })

    it('renders an h1 tag', () => {
        render(<Tunnel as="h1" data-testid="t" />)
        expect(screen.getByTestId('t').tagName).toBe('H1')
    })

    it('renders an h2 tag', () => {
        render(<Tunnel as="h2" data-testid="t" />)
        expect(screen.getByTestId('t').tagName).toBe('H2')
    })

    it('renders a label tag', () => {
        render(<Tunnel as="label" data-testid="t" />)
        expect(screen.getByTestId('t').tagName).toBe('LABEL')
    })
})

// ─── color ───────────────────────────────────────────────────────────────────

describe('color', () => {
    it('resolves a semantic text token', () => {
        render(<Tunnel data-testid="t" color="color.text.primary" />)
        expect(screen.getByTestId('t').style.color).toBeTruthy()
    })

    it('resolves a primitive colour token', () => {
        render(<Tunnel data-testid="t" color="color.primary.500" />)
        expect(screen.getByTestId('t').style.color).toBeTruthy()
    })

    it('accepts a raw colour string', () => {
        render(<Tunnel data-testid="t" color="#ff0000" />)
        expect(screen.getByTestId('t').style.color).toBe('rgb(255, 0, 0)')
    })
})

// ─── fontSize ────────────────────────────────────────────────────────────────

describe('fontSize', () => {
    it('resolves a fontSize token', () => {
        render(<Tunnel data-testid="t" fontSize="fontSize.md" />)
        expect(screen.getByTestId('t').style.fontSize).toBe('16px')
    })

    it('resolves fontSize.lg', () => {
        render(<Tunnel data-testid="t" fontSize="fontSize.lg" />)
        expect(screen.getByTestId('t').style.fontSize).toBe('20px')
    })

    it('accepts a raw number', () => {
        render(<Tunnel data-testid="t" fontSize={24} />)
        expect(screen.getByTestId('t').style.fontSize).toBe('24px')
    })
})

// ─── fontWeight ───────────────────────────────────────────────────────────────

describe('fontWeight', () => {
    it('resolves a fontWeight token', () => {
        render(<Tunnel data-testid="t" fontWeight="fontWeight.bold" />)
        expect(screen.getByTestId('t').style.fontWeight).toBe('700')
    })

    it('accepts a raw number', () => {
        render(<Tunnel data-testid="t" fontWeight={500} />)
        expect(screen.getByTestId('t').style.fontWeight).toBe('500')
    })
})

// ─── fontFamily ───────────────────────────────────────────────────────────────

describe('fontFamily', () => {
    it('resolves a fontFamily token', () => {
        render(<Tunnel data-testid="t" fontFamily="fontFamily.sans" />)
        expect(screen.getByTestId('t').style.fontFamily).toBeTruthy()
    })

    it('accepts a raw font string', () => {
        render(<Tunnel data-testid="t" fontFamily="Georgia, serif" />)
        expect(screen.getByTestId('t').style.fontFamily).toContain('Georgia')
    })
})

// ─── fontStyle ────────────────────────────────────────────────────────────────

describe('fontStyle', () => {
    it('sets fontStyle: italic', () => {
        render(<Tunnel data-testid="t" fontStyle="italic" />)
        expect(screen.getByTestId('t').style.fontStyle).toBe('italic')
    })

    it('sets fontStyle: normal', () => {
        render(<Tunnel data-testid="t" fontStyle="normal" />)
        expect(screen.getByTestId('t').style.fontStyle).toBe('normal')
    })
})

// ─── fontVariant ──────────────────────────────────────────────────────────────

describe('fontVariant', () => {
    it('sets fontVariant', () => {
        render(<Tunnel data-testid="t" fontVariant="small-caps" />)
        expect(screen.getByTestId('t').style.fontVariant).toBe('small-caps')
    })
})

// ─── fontStretch ──────────────────────────────────────────────────────────────

describe('fontStretch', () => {
    it('sets fontStretch', () => {
        render(<Tunnel data-testid="t" fontStretch="condensed" />)
        expect(screen.getByTestId('t').style.fontStretch).toBe('condensed')
    })
})

// ─── lineHeight ───────────────────────────────────────────────────────────────

describe('lineHeight', () => {
    it('resolves a lineHeight token', () => {
        render(<Tunnel data-testid="t" lineHeight="lineHeight.normal" />)
        expect(screen.getByTestId('t').style.lineHeight).toBe('1.5')
    })

    it('accepts a raw number', () => {
        render(<Tunnel data-testid="t" lineHeight={2} />)
        expect(screen.getByTestId('t').style.lineHeight).toBe('2')
    })
})

// ─── letterSpacing ────────────────────────────────────────────────────────────

describe('letterSpacing', () => {
    it('resolves a letterSpacing token', () => {
        render(<Tunnel data-testid="t" letterSpacing="letterSpacing.wide" />)
        expect(screen.getByTestId('t').style.letterSpacing).toBeTruthy()
    })

    it('accepts a raw number', () => {
        render(<Tunnel data-testid="t" letterSpacing={1} />)
        expect(screen.getByTestId('t').style.letterSpacing).toBeTruthy()
    })
})

// ─── wordSpacing ──────────────────────────────────────────────────────────────

describe('wordSpacing', () => {
    it('sets wordSpacing from a raw value', () => {
        render(<Tunnel data-testid="t" wordSpacing={4} />)
        expect(screen.getByTestId('t').style.wordSpacing).toBeTruthy()
    })
})

// ─── textAlign ────────────────────────────────────────────────────────────────

describe('textAlign', () => {
    it('sets textAlign: center', () => {
        render(<Tunnel data-testid="t" textAlign="center" />)
        expect(screen.getByTestId('t').style.textAlign).toBe('center')
    })

    it('accepts left, right, center, justify', () => {
        for (const a of ['left', 'right', 'center', 'justify'] as const) {
            const { unmount } = render(<Tunnel data-testid={a} textAlign={a} />)
            expect(screen.getByTestId(a).style.textAlign).toBe(a)
            unmount()
        }
    })
})

// ─── textTransform ────────────────────────────────────────────────────────────

describe('textTransform', () => {
    it('sets textTransform: uppercase', () => {
        render(<Tunnel data-testid="t" textTransform="uppercase" />)
        expect(screen.getByTestId('t').style.textTransform).toBe('uppercase')
    })

    it('sets textTransform: lowercase', () => {
        render(<Tunnel data-testid="t" textTransform="lowercase" />)
        expect(screen.getByTestId('t').style.textTransform).toBe('lowercase')
    })
})

// ─── textDecoration ───────────────────────────────────────────────────────────

describe('textDecoration', () => {
    it('sets textDecoration: underline', () => {
        render(<Tunnel data-testid="t" textDecoration="underline" />)
        expect(screen.getByTestId('t').style.textDecoration).toContain('underline')
    })

    it('sets textDecoration: line-through', () => {
        render(<Tunnel data-testid="t" textDecoration="line-through" />)
        expect(screen.getByTestId('t').style.textDecoration).toContain('line-through')
    })
})

// ─── textOverflow ─────────────────────────────────────────────────────────────

describe('textOverflow', () => {
    it('sets textOverflow: ellipsis', () => {
        render(<Tunnel data-testid="t" textOverflow="ellipsis" />)
        expect(screen.getByTestId('t').style.textOverflow).toBe('ellipsis')
    })

    it('sets textOverflow: clip', () => {
        render(<Tunnel data-testid="t" textOverflow="clip" />)
        expect(screen.getByTestId('t').style.textOverflow).toBe('clip')
    })
})

// ─── textShadow ───────────────────────────────────────────────────────────────

describe('textShadow', () => {
    it('sets textShadow from a raw string', () => {
        render(<Tunnel data-testid="t" textShadow="1px 1px 2px black" />)
        expect(screen.getByTestId('t').style.textShadow).toBeTruthy()
    })
})

// ─── textIndent ───────────────────────────────────────────────────────────────

describe('textIndent', () => {
    it('sets textIndent from a raw number', () => {
        render(<Tunnel data-testid="t" textIndent={16} />)
        expect(screen.getByTestId('t').style.textIndent).toBe('16px')
    })
})

// ─── whiteSpace ───────────────────────────────────────────────────────────────

describe('whiteSpace', () => {
    it('sets whiteSpace: nowrap', () => {
        render(<Tunnel data-testid="t" whiteSpace="nowrap" />)
        expect(screen.getByTestId('t').style.whiteSpace).toBe('nowrap')
    })

    it('sets whiteSpace: pre-wrap', () => {
        render(<Tunnel data-testid="t" whiteSpace="pre-wrap" />)
        expect(screen.getByTestId('t').style.whiteSpace).toBe('pre-wrap')
    })
})

// ─── overflow ─────────────────────────────────────────────────────────────────

describe('overflow', () => {
    it('sets overflow: hidden', () => {
        render(<Tunnel data-testid="t" overflow="hidden" />)
        expect(screen.getByTestId('t').style.overflow).toBe('hidden')
    })
})

// ─── boolean helpers ──────────────────────────────────────────────────────────

describe('italic helper', () => {
    it('italic=true sets fontStyle: italic', () => {
        render(<Tunnel data-testid="t" italic />)
        expect(screen.getByTestId('t').style.fontStyle).toBe('italic')
    })

    it('italic=false does not set fontStyle', () => {
        render(<Tunnel data-testid="t" italic={false} />)
        expect(screen.getByTestId('t').style.fontStyle).toBe('')
    })
})

describe('truncate helper', () => {
    it('truncate=true sets overflow, whiteSpace, textOverflow', () => {
        render(<Tunnel data-testid="t" truncate />)
        const style = screen.getByTestId('t').style
        expect(style.overflow).toBe('hidden')
        expect(style.whiteSpace).toBe('nowrap')
        expect(style.textOverflow).toBe('ellipsis')
    })

    it('truncate=false does not set truncation styles', () => {
        render(<Tunnel data-testid="t" truncate={false} />)
        expect(screen.getByTestId('t').style.textOverflow).toBe('')
    })
})

describe('nowrap helper', () => {
    it('nowrap=true sets whiteSpace: nowrap', () => {
        render(<Tunnel data-testid="t" nowrap />)
        expect(screen.getByTestId('t').style.whiteSpace).toBe('nowrap')
    })
})

// ─── style override ───────────────────────────────────────────────────────────

describe('style override', () => {
    it('style prop overrides a token prop', () => {
        render(<Tunnel data-testid="t" fontSize="fontSize.md" style={{ fontSize: '99px' }} />)
        expect(screen.getByTestId('t').style.fontSize).toBe('99px')
    })

    it('style prop merges with token props', () => {
        render(<Tunnel data-testid="t" fontSize="fontSize.md" style={{ margin: '4px' }} />)
        const style = screen.getByTestId('t').style
        expect(style.fontSize).toBe('16px')
        expect(style.margin).toBe('4px')
    })
})

// ─── live token updates ───────────────────────────────────────────────────────

describe('live token updates', () => {
    it('re-renders when tokens change via extendBurrow', () => {
        render(<Tunnel data-testid="t" color="color.primary.500" />)
        const before = screen.getByTestId('t').style.color

        act(() => {
            extendBurrow({ primitive: { color: { primary: { 500: '#ff0000' } } } })
        })

        const after = screen.getByTestId('t').style.color
        expect(after).not.toBe(before)
        expect(after).toBe('rgb(255, 0, 0)')
    })
})
