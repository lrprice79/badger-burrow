import React from 'react'
import { View, ViewStyle, useWindowDimensions } from 'react-native'
import {
    buildBoxStyles,
    resolveSx,
    BURROW_BOX_KEYS,
    splitResponsiveProps,
    getActiveBreakpoint,
    getBreakpointOrder,
    resolveResponsiveValue,
} from '@badger-burrow/core'
import type { BurrowBoxProps, SxProp } from '@badger-burrow/core'
import { useBurrow } from './useBurrow'
import type { NativeBoxCSSOverrides } from './cssOverrides'
import { sanitizeNativeStyle } from './nativeStyle'

export interface ChamberProps
    extends Omit<BurrowBoxProps, keyof NativeBoxCSSOverrides>,
        NativeBoxCSSOverrides {
    style?: ViewStyle
    sx?: SxProp
    testID?: string
    children?: React.ReactNode
}

/**
 * Box/layout primitive for React Native.
 * Renders a View. Accepts BadgerBurrow token props for styling.
 *
 * Shadow uses native elevation object (tokens.primitive.shadow[key].native).
 * No pseudo props — use Pressable state for _pressed / _focused.
 *
 * Priority (lowest → highest): sx → named props → style
 *
 * @example
 * <Chamber bg="color.bg.surface" p="space.4" radius="radius.md">
 *   <Tunnel>Hello</Tunnel>
 * </Chamber>
 */
export function Chamber({ sx, style, children, testID, ...props }: ChamberProps) {
    const { tokens, mode } = useBurrow()
    const { width } = useWindowDimensions()

    // Split burrow props from passthrough props
    const burrowProps: Record<string, unknown> = {}
    const passthroughProps: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (BURROW_BOX_KEYS.has(key)) burrowProps[key] = value
        else passthroughProps[key] = value
    }

    // Resolve responsive props to a single value based on current window width
    const breakpoints = tokens.breakpoints ?? {}
    const { baseProps, responsiveProps } = splitResponsiveProps(burrowProps, breakpoints)
    const activeBreakpoint = getActiveBreakpoint(width, breakpoints)
    const bpOrder = getBreakpointOrder(breakpoints)
    for (const [key, obj] of Object.entries(responsiveProps)) {
        const resolved = resolveResponsiveValue(obj as Record<string, unknown>, activeBreakpoint, bpOrder)
        if (resolved !== undefined) baseProps[key] = resolved
    }

    // buildBoxStyles emits web-shaped CSS (px strings, web-only keys, a web
    // boxShadow string, font props). Sanitize to a valid RN ViewStyle: px → number,
    // web-only + text-only keys stripped, boxShadow dropped (native uses the
    // elevation object below).
    const tokenStyles = sanitizeNativeStyle(buildBoxStyles(baseProps as BurrowBoxProps, tokens, mode))
    const sxStyles    = sx ? sanitizeNativeStyle(resolveSx(sx, tokens, mode)) : {}

    // Native shadow: if a shadow token resolves to a native elevation object,
    // spread it directly into the style
    const nativeShadow = (burrowProps as any).shadow
        ? resolveNativeShadow((burrowProps as any).shadow, tokens)
        : {}

    const resolvedStyle = {
        ...sxStyles,
        ...tokenStyles,
        ...nativeShadow,
        ...style,
    } as ViewStyle

    return (
        <View style={resolvedStyle} testID={testID} {...passthroughProps}>
            {children}
        </View>
    )
}

function resolveNativeShadow(key: string, tokens: any): Record<string, unknown> {
    const shadow = tokens?.primitive?.shadow?.[key]?.native
    if (!shadow || typeof shadow !== 'object') return {}
    return shadow
}
