import React from 'react'
import { render } from '@testing-library/react'
import { BadgerBase } from '@purple-brock/burrow-core'
import { Chamber } from '../Chamber'
import {
    createStyleRegistry,
    adoptServerStyles,
    injectPseudoRule,
    __resetStyleInjectorCache,
} from '../styleInjector'

beforeEach(() => {
    BadgerBase.reset()
    document.head.innerHTML = ''
    __resetStyleInjectorCache()
})

// ─── server collection ────────────────────────────────────────────────────────
// A render inside `collect()` routes the injectors to the registry instead of the
// DOM — the same path renderToString takes (it just sets a module-global flag).

describe('SSR style registry', () => {
    it('collects pseudo rules during a render instead of touching the DOM', () => {
        const registry = createStyleRegistry()
        registry.collect(() => render(<Chamber _hover={{ bg: 'primary.600' }}>hi</Chamber>))
        const tags = registry.styleTags()
        expect(tags).toContain('data-bb-ssr')
        expect(tags).toContain(':hover')
        // nothing written to document.head — it went to the registry
        expect(document.head.querySelectorAll('[data-bb]').length).toBe(0)
    })

    it('collects responsive @media rules', () => {
        const registry = createStyleRegistry()
        registry.collect(() => render(<Chamber p={{ base: '2', md: '6' }} />))
        const tags = registry.styleTags()
        expect(tags).toContain('@media')
        expect(tags).toContain('768px')
    })

    it('styleTags is empty when nothing was collected', () => {
        const registry = createStyleRegistry()
        registry.collect(() => render(<Chamber p="4" />)) // no pseudo, responsive, or smart-hover bg
        expect(registry.styleTags()).toBe('')
    })

    it('exposes collected ids for client adoption', () => {
        const registry = createStyleRegistry()
        registry.collect(() => render(<Chamber _hover={{ bg: 'primary.600' }} />))
        expect(registry.styleTags()).toMatch(/data-bb-ids="[^"]+:hover/)
    })

    it('restores normal DOM injection after collect()', () => {
        const registry = createStyleRegistry()
        registry.collect(() => render(<Chamber _hover={{ bg: 'primary.600' }} />))
        document.head.innerHTML = ''
        __resetStyleInjectorCache()
        // a subsequent (non-collected) render must inject to the DOM again
        render(<Chamber _hover={{ bg: 'secondary.600' }} data-testid="c" />)
        expect(document.head.querySelector('[data-bb]')).not.toBeNull()
    })
})

// ─── client hydration ─────────────────────────────────────────────────────────

describe('client adoption of SSR styles', () => {
    it('does not re-inject a rule already present in the SSR tag', () => {
        document.head.innerHTML =
            '<style data-bb-ssr data-bb-ids="bb-xyz:hover">.bb-xyz:hover { color: red; }</style>'
        __resetStyleInjectorCache()
        adoptServerStyles()

        injectPseudoRule('bb-xyz', 'hover', { color: 'blue' })

        // no new individual tag created — the SSR rule was adopted
        expect(document.head.querySelector('[data-bb="bb-xyz:hover"]')).toBeNull()
        expect(document.head.querySelectorAll('style').length).toBe(1) // only the SSR tag
    })

    it('still injects rules the SSR pass did not cover', () => {
        document.head.innerHTML =
            '<style data-bb-ssr data-bb-ids="bb-xyz:hover">.bb-xyz:hover { color: red; }</style>'
        __resetStyleInjectorCache()
        adoptServerStyles()

        injectPseudoRule('bb-new', 'focus', { outline: '1px solid red' })
        expect(document.head.querySelector('[data-bb="bb-new:focus"]')).not.toBeNull()
    })
})
