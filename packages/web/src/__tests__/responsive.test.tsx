import React from 'react'
import { render, screen } from '@testing-library/react'
import { BadgerBase } from '@badger-eco/burrow-core'
import { Chamber } from '../Chamber'
import { Tunnel } from '../Tunnel'
import { __resetStyleInjectorCache } from '../styleInjector'

beforeEach(() => {
    BadgerBase.reset()
    document.head.querySelectorAll('[data-bb-responsive]').forEach(el => el.remove())
    __resetStyleInjectorCache()
})

const respTag = () => document.head.querySelector('[data-bb-responsive]')

// ─── Chamber responsive props ─────────────────────────────────────────────────

describe('Chamber responsive props', () => {
    // The base value must NOT be applied inline: inline styles outrank @media
    // rules, so an inline base would suppress every breakpoint override.
    it('does NOT apply the base value as an inline style', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        expect(screen.getByTestId('c').style.padding).toBe('')
    })

    it('emits the base value as an unwrapped (non-media) class rule', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        const cls = screen.getByTestId('c').className
        // The first rule targets the bare class (no @media) and carries base padding.
        expect(respTag()?.textContent).toMatch(new RegExp(`\\.${cls} \\{[^}]*padding`))
    })

    it('injects a media query style tag for each responsive prop', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        expect(respTag()).not.toBeNull()
    })

    it('injected media query contains min-width for the breakpoint', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        expect(respTag()?.textContent).toContain('min-width')
        expect(respTag()?.textContent).toContain('768px')
    })

    it('base rule precedes the media rule so the override wins in the cascade', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        const text = respTag()?.textContent ?? ''
        const baseIdx = text.indexOf('.bb-')          // unwrapped class rule
        const mediaIdx = text.indexOf('@media')
        expect(baseIdx).toBeGreaterThanOrEqual(0)
        expect(mediaIdx).toBeGreaterThan(baseIdx)
    })

    it('emits ascending min-width media rules so larger breakpoints win', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.1', md: 'space.4', xl: 'space.8' }} />)
        const text = respTag()?.textContent ?? ''
        expect(text.indexOf('768px')).toBeLessThan(text.indexOf('1200px'))
    })

    it('applies a scoped class name to the element', () => {
        render(<Chamber data-testid="c" p={{ base: 'space.2', md: 'space.6' }} />)
        expect(screen.getByTestId('c').className).toMatch(/^bb-/)
    })

    it('two identical responsive configs share one style tag', () => {
        render(
            <div>
                <Chamber p={{ base: 'space.2', md: 'space.6' }} />
                <Chamber p={{ base: 'space.2', md: 'space.6' }} />
            </div>
        )
        expect(document.head.querySelectorAll('[data-bb-responsive]').length).toBe(1)
    })

    it('multiple responsive props on one Chamber are in one style tag', () => {
        render(
            <Chamber
                p={{ base: 'space.2', md: 'space.6' }}
                gap={{ base: 'space.2', lg: 'space.6' }}
            />
        )
        expect(document.head.querySelectorAll('[data-bb-responsive]').length).toBe(1)
    })

    it('plain props stay inline while responsive props move to the stylesheet', () => {
        render(<Chamber data-testid="c" bg="color.primary.500" p={{ base: 'space.2', md: 'space.6' }} />)
        const el = screen.getByTestId('c')
        // Plain prop → inline; responsive prop → NOT inline (it lives in the stylesheet)
        expect(el.style.backgroundColor).toBeTruthy()
        expect(el.style.padding).toBe('')
        expect(respTag()?.textContent).toContain('padding')
    })
})

// ─── Chamber responsive layout / grid props ───────────────────────────────────

describe('Chamber responsive layout props', () => {
    it('base flexDir is emitted as a class rule, not inline', () => {
        render(<Chamber data-testid="c" flexDir={{ base: 'column', md: 'row' }} />)
        expect(screen.getByTestId('c').style.flexDirection).toBe('')
        expect(respTag()?.textContent).toContain('flex-direction: column')
    })

    it('injects a media query for responsive flexDir', () => {
        render(<Chamber data-testid="c" flexDir={{ base: 'column', md: 'row' }} />)
        expect(respTag()?.textContent).toContain('flex-direction: row')
        expect(respTag()?.textContent).toContain('768px')
    })

    it('injects a media query for responsive align', () => {
        render(<Chamber data-testid="c" align={{ base: 'flex-start', lg: 'center' }} />)
        expect(respTag()?.textContent).toContain('align-items')
        expect(respTag()?.textContent).toContain('center')
    })

    it('injects a media query for responsive justify', () => {
        render(<Chamber data-testid="c" justify={{ base: 'flex-start', md: 'space-between' }} />)
        expect(respTag()?.textContent).toContain('justify-content')
        expect(respTag()?.textContent).toContain('space-between')
    })

    it('supports responsive display', () => {
        render(<Chamber data-testid="c" display={{ base: 'block', md: 'flex' }} />)
        expect(screen.getByTestId('c').style.display).toBe('')
        expect(respTag()?.textContent).toContain('display: block')
        expect(respTag()?.textContent).toContain('display: flex')
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
        // base grid template lives in the class rule, the override in the media rule
        expect(screen.getByTestId('c').style.gridTemplateColumns).toBe('')
        expect(respTag()?.textContent).toContain('grid-template-columns: 1fr;')
        expect(respTag()?.textContent).toContain('1fr 1fr')
    })
})

// ─── Tunnel responsive props ──────────────────────────────────────────────────

describe('Tunnel responsive props', () => {
    it('base font size is emitted as a class rule, not inline', () => {
        render(<Tunnel data-testid="t" fontSize={{ base: 'fontSize.sm', lg: 'fontSize.xl' }} />)
        expect(screen.getByTestId('t').style.fontSize).toBe('')
        expect(respTag()?.textContent).toContain('font-size')
    })

    it('injects media query for responsive fontSize', () => {
        render(<Tunnel data-testid="t" fontSize={{ base: 'fontSize.sm', lg: 'fontSize.xl' }} />)
        expect(respTag()?.textContent).toContain('font-size')
        expect(respTag()?.textContent).toContain('992px')
    })
})
