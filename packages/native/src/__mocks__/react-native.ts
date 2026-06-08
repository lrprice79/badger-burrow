/**
 * Minimal react-native mock for Jest tests.
 * We test style resolution (pure logic) rather than native rendering.
 * Chamber renders View, Tunnel renders Text — we verify styles applied, not the host component.
 */
import React from 'react'

export const View = ({ children, style, testID, ...rest }: any) =>
    React.createElement('View', { style, testID, ...rest }, children)

export const Text = ({ children, style, testID, ...rest }: any) =>
    React.createElement('Text', { style, testID, ...rest }, children)

export const Pressable = ({ children, style, testID, ...rest }: any) =>
    React.createElement('Pressable', { style, testID, ...rest }, children)

export const useWindowDimensions = () => ({ width: 375, height: 812 })

export const StyleSheet = {
    create: (styles: Record<string, any>) => styles,
    flatten: (style: any) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
}
