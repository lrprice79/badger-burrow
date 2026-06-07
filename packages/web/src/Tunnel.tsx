import React, { useEffect, useMemo } from 'react'
import {
    resolveSx,
    buildTextStyles,
    buildTextPseudoStyles,
    toClassName,
    BURROW_TEXT_KEYS,
} from '@badger-burrow/core'
import type { BurrowTextProps } from '@badger-burrow/core'
import { useBurrow } from './useBurrow'
import { acquirePseudoStyles, releasePseudoStyles } from './styleInjector'

type TunnelTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label'

export interface TunnelProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
        BurrowTextProps {
    /** Element tag to render — defaults to span */
    as?: TunnelTag
}

/**
 * A styled text component backed by BadgerBurrow tokens.
 * Accepts shorthand token props alongside all standard HTML text props.
 *
 * Priority (lowest → highest): sx → named props → style
 *
 * Pseudo-state styling via _hover, _focus, _active, _focusVisible, _disabled.
 *
 * @example
 * <Tunnel
 *   as="h1"
 *   color="color.text.primary"
 *   fontSize="fontSize.2xl"
 *   fontWeight="fontWeight.bold"
 *   _hover={{ color: 'color.interactive.primary', textDecoration: 'underline' }}
 *   truncate
 * />
 */
export function Tunnel({ as: Tag = 'span', sx, style, children, ...props }: TunnelProps) {
    const { tokens, mode } = useBurrow()

    // Split props into burrow props vs plain HTML props
    const burrowProps: Record<string, unknown> = {}
    const htmlProps: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (BURROW_TEXT_KEYS.has(key)) burrowProps[key] = value
        else htmlProps[key] = value
    }

    const textPropsTyped = burrowProps as BurrowTextProps

    // Resolve inline styles
    const tokenStyles = buildTextStyles(textPropsTyped, tokens, mode)
    const sxStyles    = sx ? resolveSx(sx, tokens, mode) : {}

    // Resolve pseudo styles
    const pseudoStyles = useMemo(
        () => buildTextPseudoStyles(textPropsTyped, tokens, mode),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(burrowProps), mode, tokens],
    )

    const hasPseudo = Object.keys(pseudoStyles).length > 0

    const className = useMemo(() => {
        if (!hasPseudo) return undefined
        return toClassName(JSON.stringify(pseudoStyles) + mode)
    }, [pseudoStyles, hasPseudo, mode])

    useEffect(() => {
        if (!className || !hasPseudo) return
        acquirePseudoStyles(className, pseudoStyles)
        const keys = Object.keys(pseudoStyles)
        return () => releasePseudoStyles(className, keys)
    }, [className, pseudoStyles, hasPseudo])

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
