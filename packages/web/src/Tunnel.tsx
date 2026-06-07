import React from 'react'
import { resolveSx, buildTextStyles, BURROW_TEXT_KEYS } from '@badger-burrow/core'
import type { BurrowTextProps } from '@badger-burrow/core'
import { useBurrow } from './useBurrow'

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
 * @example
 * <Tunnel as="h1" color="color.text.primary" size="fontSize.2xl" weight="fontWeight.bold" truncate>
 *   Hello world
 * </Tunnel>
 */
export function Tunnel({ as: Tag = 'span', sx, style, children, ...props }: TunnelProps) {
    const { tokens, mode } = useBurrow()

    // Separate burrow props from native HTML props
    const burrowProps: Record<string, unknown> = {}
    const htmlProps: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(props)) {
        if (BURROW_TEXT_KEYS.has(key)) burrowProps[key] = value
        else htmlProps[key] = value
    }

    const tokenStyles = buildTextStyles(burrowProps as BurrowTextProps, tokens, mode)
    const sxStyles    = sx ? resolveSx(sx, tokens, mode) : {}

    return (
        <Tag style={{ ...sxStyles, ...tokenStyles, ...style } as React.CSSProperties} {...htmlProps as React.HTMLAttributes<HTMLElement>}>
            {children}
        </Tag>
    )
}
