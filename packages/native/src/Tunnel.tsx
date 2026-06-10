import React from 'react'
import { Text, TextStyle } from 'react-native'
import {
    buildTextStyles,
    resolveSx,
    BURROW_TEXT_KEYS,
    splitResponsiveProps,
    getBreakpointOrder,
    resolveResponsiveValue,
} from '@badger-burrow/core'
import type { BurrowTextProps, SxProp } from '@badger-burrow/core'
import { useBurrow } from './useBurrow'
import { useActiveBreakpoint } from './useActiveBreakpoint'
import type { NativeTextCSSOverrides } from './cssOverrides'
import { sanitizeNativeStyle, nativeLineCount } from './nativeStyle'

export interface TunnelProps
    extends Omit<BurrowTextProps, keyof NativeTextCSSOverrides>,
        NativeTextCSSOverrides {
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

    // Resolve responsive props to a single value based on current window width
    const breakpoints = tokens.breakpoints ?? {}
    const { baseProps, responsiveProps } = splitResponsiveProps(burrowProps, breakpoints)
    const activeBreakpoint = useActiveBreakpoint(breakpoints)
    const bpOrder = getBreakpointOrder(breakpoints)
    for (const [key, obj] of Object.entries(responsiveProps)) {
        const resolved = resolveResponsiveValue(obj as Record<string, unknown>, activeBreakpoint, bpOrder)
        if (resolved !== undefined) baseProps[key] = resolved
    }

    // buildTextStyles emits web-shaped CSS (px strings, unitless lineHeight,
    // -webkit-box line clamp, web-only keys). Sanitize to a valid RN TextStyle:
    // px → number, lineHeight resolved to absolute px, web-only keys stripped.
    const tokenStyles = sanitizeNativeStyle(buildTextStyles(baseProps as BurrowTextProps, tokens, mode), { text: true })
    const sxStyles    = sx ? sanitizeNativeStyle(resolveSx(sx, tokens, mode), { text: true }) : {}

    // Native truncation is the numberOfLines prop, not a style.
    const numberOfLines = nativeLineCount(baseProps as { truncate?: boolean; lineClamp?: number })

    const resolvedStyle = {
        ...sxStyles,
        ...tokenStyles,
        ...style,
    } as TextStyle

    return (
        <Text style={resolvedStyle} numberOfLines={numberOfLines} testID={testID} {...passthroughProps}>
            {children}
        </Text>
    )
}
