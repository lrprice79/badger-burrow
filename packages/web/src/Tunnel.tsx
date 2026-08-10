import React from 'react'
import {
    resolveSx,
    buildTextStyles,
    buildTextPseudoStyles,
    toClassName,
    BURROW_TEXT_KEYS,
    splitResponsiveProps,
    getBreakpointOrder,
} from '@purple-brock/burrow-core'
import type { BurrowTextProps } from '@purple-brock/burrow-core'
import { useBurrow } from './useBurrow'
import { injectPseudoStyles, injectResponsiveStyles, stableStringify } from './styleInjector'
import { useDebug, mergeRefs } from './useDebug'

type TunnelTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label'

export interface TunnelProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
        BurrowTextProps {
    /** Element tag to render — defaults to span */
    as?: TunnelTag
}

/**
 * The text component. Every piece of visible text in your UI goes in a Tunnel —
 * headings, body copy, labels, captions, error messages.
 *
 * Tunnel has no layout props. Use a Chamber to position or space text alongside
 * other elements.
 *
 * Priority (lowest → highest): sx → named props → style
 *
 * @example
 * <Tunnel as="h1" fontSize="fontSize.2xl" fontWeight="fontWeight.bold" color="color.text.primary">
 *   Page title
 * </Tunnel>
 *
 * <Tunnel as="p" color="color.text.secondary" lineHeight="lineHeight.relaxed">
 *   Body copy here.
 * </Tunnel>
 */
export const Tunnel = React.forwardRef<HTMLElement, TunnelProps>(function Tunnel(
    { as: Tag = 'span', sx, style, children, __debug, ...props },
    ref,
) {
    const { tokens, mode } = useBurrow()

    // Split props into burrow props vs plain HTML props
    const burrowProps: Record<string, unknown> = {}
    const htmlProps: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (BURROW_TEXT_KEYS.has(key)) burrowProps[key] = value
        else htmlProps[key] = value
    }

    // Split burrow props into base (plain + base values) and responsive objects
    const { baseProps, responsiveProps } = splitResponsiveProps(burrowProps, tokens.breakpoints)
    const textPropsTyped = baseProps as BurrowTextProps

    // Inline styles cover ONLY non-responsive props. A responsive prop's base
    // value must NOT go inline — inline styles outrank @media rules in the
    // cascade, so an inline base would suppress every breakpoint override. Each
    // responsive prop (base included) is emitted as a class rule below instead.
    const inlineProps: Record<string, unknown> = {}
    for (const key in baseProps) {
        if (!(key in responsiveProps)) inlineProps[key] = baseProps[key]
    }
    const tokenStyles = buildTextStyles(inlineProps as BurrowTextProps, tokens, mode)
    const sxStyles    = sx ? resolveSx(sx, tokens, mode) : {}

    // Resolve pseudo styles
    const pseudoStyles = buildTextPseudoStyles(textPropsTyped, tokens, mode)
    const hasPseudo    = Object.keys(pseudoStyles).length > 0
    const hasResponsive = Object.keys(responsiveProps).length > 0

    // Resolve each breakpoint's CSS up-front so the class name can be
    // content-addressed against the RESOLVED styles rather than the raw props.
    // If tokens change at runtime, the resolved CSS (and thus the class name)
    // changes too — so a new rule is injected instead of a stale one being reused.
    // Built in getBreakpointOrder order (base first), so key order is stable.
    const breakpoints = tokens.breakpoints ?? {}
    let bpStyles: Partial<Record<string, Record<string, string | number | undefined>>> | undefined
    if (hasResponsive) {
        const bpOrder = getBreakpointOrder(breakpoints)
        bpStyles = {}
        // Include 'base' — it is emitted as an unwrapped class rule, with the
        // named breakpoints overriding it via ascending min-width media queries.
        for (const bp of bpOrder) {
            const bpProps: Record<string, unknown> = {}
            for (const [key, obj] of Object.entries(responsiveProps)) {
                const bpObj = obj as Record<string, unknown>
                if (bp in bpObj && bpObj[bp] !== undefined) bpProps[key] = bpObj[bp]
            }
            if (Object.keys(bpProps).length > 0) {
                bpStyles[bp] = buildTextStyles(bpProps as BurrowTextProps, tokens, mode)
            }
        }
    }

    // Generate a scoped class name when pseudo or responsive styles are needed —
    // content-addressed on the resolved pseudo + responsive CSS plus mode.
    const className = (hasPseudo || hasResponsive)
        ? toClassName(JSON.stringify(pseudoStyles) + stableStringify(bpStyles ?? {}) + mode)
        : undefined

    // Inject <style> tags synchronously during render — idempotent, no useEffect needed
    if (hasPseudo && className) {
        injectPseudoStyles(className, pseudoStyles)
    }

    // Inject media-query rules for responsive props
    if (hasResponsive && className && bpStyles) {
        injectResponsiveStyles(className, bpStyles, breakpoints)
    }

    const resolvedStyle = { ...sxStyles, ...tokenStyles, ...style } as React.CSSProperties
    const dbg = useDebug(__debug, { component: 'Tunnel', tag: String(Tag), mode, style: resolvedStyle })

    // Cast to ElementType so the dynamic tag union doesn't explode the ref/prop types.
    const Component = Tag as React.ElementType
    // Merge the scoped burrow class with any user-supplied className — spreading
    // htmlProps must never clobber the generated class the injected pseudo /
    // responsive rules target.
    const { className: userClassName, ...restHtmlProps } = htmlProps as { className?: string }
    const mergedClassName =
        [className, userClassName].filter(Boolean).join(' ') || undefined
    // Memoise the merged ref callback — a fresh callback each render makes React
    // detach (call with null) and re-attach the ref on every render.
    const combinedRef = React.useMemo(() => mergeRefs(ref, dbg.debugRef), [ref, dbg.debugRef])
    return (
        <Component
            ref={combinedRef}
            className={mergedClassName}
            style={dbg.outline ? { ...resolvedStyle, outline: dbg.outline } : resolvedStyle}
            {...(dbg.attr ? { 'data-bb-debug': dbg.attr } : {})}
            {...(restHtmlProps as React.HTMLAttributes<HTMLElement>)}
        >
            {children}
        </Component>
    )
})
