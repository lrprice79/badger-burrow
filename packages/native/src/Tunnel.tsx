import React from 'react'
import { Text, TextStyle } from 'react-native'
import {
    buildTextStyles,
    resolveSx,
    BURROW_TEXT_KEYS,
} from '@badger-burrow/core'
import type { BurrowTextProps, SxProp } from '@badger-burrow/core'
import { useBurrow } from './useBurrow'

export interface TunnelProps extends BurrowTextProps {
    style?: TextStyle
    sx?: SxProp
    testID?: string
    children?: React.ReactNode
}

/**
 * Text primitive for React Native.
 * Renders a Text. Every piece of visible text goes in a Tunnel.
 *
 * Tunnel has no layout props — use Chamber to position text alongside
 * other elements.
 *
 * Priority (lowest → highest): sx → named props → style
 *
 * @example
 * <Tunnel fontSize="fontSize.lg" fontWeight="fontWeight.bold" color="color.text.primary">
 *   Page title
 * </Tunnel>
 */
export function Tunnel({ sx, style, children, testID, ...props }: TunnelProps) {
    const { tokens, mode } = useBurrow()

    // Split burrow props from passthrough props
    const burrowProps: Record<string, unknown> = {}
    const passthroughProps: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (BURROW_TEXT_KEYS.has(key)) burrowProps[key] = value
        else passthroughProps[key] = value
    }

    const tokenStyles = buildTextStyles(burrowProps as BurrowTextProps, tokens, mode)
    const sxStyles    = sx ? resolveSx(sx, tokens, mode) : {}

    const resolvedStyle = {
        ...sxStyles,
        ...tokenStyles,
        ...style,
    } as TextStyle

    return (
        <Text style={resolvedStyle} testID={testID} {...passthroughProps}>
            {children}
        </Text>
    )
}
