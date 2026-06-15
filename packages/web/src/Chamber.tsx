import React from 'react'
import {
    resolveSx,
    buildBoxStyles,
    buildPseudoStyles,
    toClassName,
    BURROW_BOX_KEYS,
    splitResponsiveProps,
    getBreakpointOrder,
} from '@badger-eco/burrow-core'
import type { BurrowBoxProps } from '@badger-eco/burrow-core'
import { useBurrow } from './useBurrow'
import { injectPseudoStyles, injectResponsiveStyles, stableStringify } from './styleInjector'
import { useDebug, mergeRefs } from './useDebug'

export type ChamberTag =
    | 'div' | 'section' | 'article' | 'aside'
    | 'header' | 'footer' | 'main' | 'nav'
    | 'button' | 'a' | 'form' | 'fieldset'
    | 'ul' | 'ol' | 'li'
    | 'figure' | 'figcaption' | 'label'
    | 'dialog' | 'details' | 'summary'
    // inline-level box — valid phrasing content (badges, inline wrappers inside
    // <p>/<button>/<a> where a <div> would be invalid HTML)
    | 'span'

export interface ChamberProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
        BurrowBoxProps {
    /** Element tag to render — defaults to div */
    as?: ChamberTag
    /** Required when as="a" */
    href?: string
}

/**
 * A styled box component backed by BadgerBurrow tokens.
 * Accepts shorthand token props alongside all standard HTML props.
 * Use `as` to render as any semantic element — button, nav, section, etc.
 *
 * Priority (lowest → highest): sx → named props → style
 *
 * Pseudo-state styling via _hover, _focus, _active, _focusVisible, _disabled.
 * Smart hover bg: if `bg` is a primitive path, hover bg auto-steps one shade darker.
 * Use `hoverScale` to specify which colour scale to step on, `hoverShade` for an
 * exact shade, or `hoverScale={false}` to disable the smart default entirely.
 *
 * @example
 * <Chamber
 *   as="button"
 *   bg="color.interactive.primary"
 *   px="space.4" py="space.2"
 *   radius="radius.md"
 *   _hover={{ bg: 'color.interactive.primary.hover', cursor: 'pointer' }}
 *   _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
 *   onClick={handleClick}
 * />
 */
export const Chamber = React.forwardRef<HTMLElement, ChamberProps>(function Chamber(
    { as: Tag = 'div', sx, style, children, __debug, ...props },
    ref,
) {
    const { tokens, mode } = useBurrow()

    // Split props into burrow props vs plain HTML props
    const burrowProps: Record<string, unknown> = {}
    const htmlProps: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (BURROW_BOX_KEYS.has(key)) burrowProps[key] = value
        else htmlProps[key] = value
    }

    // Split burrow props into base (plain + base values) and responsive objects
    // Pass tokens.breakpoints so custom breakpoints (xs, xxl, etc.) are recognised
    const { baseProps, responsiveProps } = splitResponsiveProps(burrowProps, tokens.breakpoints)
    const boxPropsTyped = baseProps as BurrowBoxProps

    // Inline styles cover ONLY non-responsive props. A responsive prop's base
    // value must NOT go inline — inline styles outrank @media rules in the
    // cascade, so an inline base would suppress every breakpoint override. Each
    // responsive prop (base included) is emitted as a class rule below instead.
    const inlineProps: Record<string, unknown> = {}
    for (const key in baseProps) {
        if (!(key in responsiveProps)) inlineProps[key] = baseProps[key]
    }
    const tokenStyles = buildBoxStyles(inlineProps as BurrowBoxProps, tokens, mode)
    const sxStyles    = sx ? resolveSx(sx, tokens, mode) : {}

    // Resolve pseudo styles
    const pseudoStyles = buildPseudoStyles(boxPropsTyped, tokens, mode)
    const hasPseudo    = Object.keys(pseudoStyles).length > 0
    const hasResponsive = Object.keys(responsiveProps).length > 0

    // Generate a scoped class name when pseudo or responsive styles are needed
    const className = (hasPseudo || hasResponsive)
        ? toClassName(JSON.stringify(pseudoStyles) + stableStringify(responsiveProps) + mode)
        : undefined

    // Inject <style> tags synchronously during render — idempotent, no useEffect needed
    if (hasPseudo && className) {
        injectPseudoStyles(className, pseudoStyles)
    }

    // Inject media-query rules for responsive props
    // Uses getBreakpointOrder so custom breakpoints are automatically included
    if (hasResponsive && className) {
        const breakpoints = tokens.breakpoints ?? {}
        const bpOrder = getBreakpointOrder(breakpoints)
        const bpStyles: Partial<Record<string, Record<string, string | number | undefined>>> = {}
        // Include 'base' — it is emitted as an unwrapped class rule, with the
        // named breakpoints overriding it via ascending min-width media queries.
        for (const bp of bpOrder) {
            const bpProps: Record<string, unknown> = {}
            for (const [key, obj] of Object.entries(responsiveProps)) {
                const bpObj = obj as Record<string, unknown>
                if (bp in bpObj && bpObj[bp] !== undefined) bpProps[key] = bpObj[bp]
            }
            if (Object.keys(bpProps).length > 0) {
                bpStyles[bp] = buildBoxStyles(bpProps as BurrowBoxProps, tokens, mode)
            }
        }
        injectResponsiveStyles(className, bpStyles, breakpoints)
    }

    const resolvedStyle = { ...sxStyles, ...tokenStyles, ...style } as React.CSSProperties
    const dbg = useDebug(__debug, { component: 'Chamber', tag: String(Tag), mode, style: resolvedStyle })

    // Cast to ElementType so the dynamic tag union doesn't explode the ref/prop
    // types (a union of every element's ref is both incompatible and "too complex").
    const Component = Tag as React.ElementType
    return (
        <Component
            ref={mergeRefs(ref, dbg.debugRef)}
            className={className}
            style={dbg.outline ? { ...resolvedStyle, outline: dbg.outline } : resolvedStyle}
            {...(dbg.attr ? { 'data-bb-debug': dbg.attr } : {})}
            {...(htmlProps as React.HTMLAttributes<HTMLElement>)}
        >
            {children}
        </Component>
    )
})
