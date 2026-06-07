import React from 'react'
import { resolveSx, buildBoxStyles, BURROW_BOX_KEYS } from '@badger-burrow/core'
import type { BurrowBoxProps } from '@badger-burrow/core'
import { useBurrow } from './useBurrow'

export interface ChamberProps
    extends React.HTMLAttributes<HTMLDivElement>,
        BurrowBoxProps {}

/**
 * A styled box component backed by BadgerBurrow tokens.
 * Accepts shorthand token props alongside all standard div props.
 *
 * Priority (lowest → highest): sx → named props → style
 *
 * @example
 * <Chamber
 *   display="flex" flexDir="column" align="center"
 *   bg="color.bg.surface" p="space.4" radius="radius.md"
 *   shadow="md" w="100%"
 * >
 *   content
 * </Chamber>
 */
export function Chamber({ sx, style, children, ...props }: ChamberProps) {
    const { tokens, mode } = useBurrow()

    // Separate burrow props from native HTML props
    const burrowProps: Record<string, unknown> = {}
    const htmlProps: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(props)) {
        if (BURROW_BOX_KEYS.has(key)) burrowProps[key] = value
        else htmlProps[key] = value
    }

    const tokenStyles = buildBoxStyles(burrowProps as BurrowBoxProps, tokens, mode)
    const sxStyles    = sx ? resolveSx(sx, tokens, mode) : {}

    return (
        <div style={{ ...sxStyles, ...tokenStyles, ...style } as React.CSSProperties} {...htmlProps as React.HTMLAttributes<HTMLDivElement>}>
            {children}
        </div>
    )
}
