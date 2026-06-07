import React from 'react'
import {
    resolveSx,
    buildBoxStyles,
    buildPseudoStyles,
    toClassName,
    BURROW_BOX_KEYS,
} from '@badger-burrow/core'
import type { BurrowBoxProps } from '@badger-burrow/core'
import { useBurrow } from './useBurrow'
import { injectPseudoStyles } from './styleInjector'

export type ChamberTag =
    | 'div' | 'section' | 'article' | 'aside'
    | 'header' | 'footer' | 'main' | 'nav'
    | 'button' | 'a' | 'form' | 'fieldset'
    | 'ul' | 'ol' | 'li'
    | 'figure' | 'figcaption' | 'label'

export interface ChamberProps
    extends React.HTMLAttributes<HTMLElement>,
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
export function Chamber({ as: Tag = 'div', sx, style, children, ...props }: ChamberProps) {
    const { tokens, mode } = useBurrow()

    // Split props into burrow props vs plain HTML props
    const burrowProps: Record<string, unknown> = {}
    const htmlProps: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (BURROW_BOX_KEYS.has(key)) burrowProps[key] = value
        else htmlProps[key] = value
    }

    const boxPropsTyped = burrowProps as BurrowBoxProps

    // Resolve inline styles
    const tokenStyles = buildBoxStyles(boxPropsTyped, tokens, mode)
    const sxStyles    = sx ? resolveSx(sx, tokens, mode) : {}

    // Resolve pseudo styles and generate a scoped class name
    const pseudoStyles = buildPseudoStyles(boxPropsTyped, tokens, mode)
    const hasPseudo    = Object.keys(pseudoStyles).length > 0
    const className    = hasPseudo ? toClassName(JSON.stringify(pseudoStyles) + mode) : undefined

    // Inject <style> tags synchronously during render — idempotent, no useEffect needed
    if (hasPseudo && className) {
        injectPseudoStyles(className, pseudoStyles)
    }

    return (
        <Tag
            className={className}
            style={{ ...sxStyles, ...tokenStyles, ...style } as React.CSSProperties}
            {...(htmlProps as React.HTMLAttributes<HTMLElement>)}
        >
            {children}
        </Tag>
    )
}
