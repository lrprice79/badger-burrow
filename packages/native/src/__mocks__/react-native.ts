/**
 * Minimal react-native mock for Jest tests.
 * We test style resolution (pure logic) rather than native rendering.
 * Includes all components needed by @testing-library/react-native internals.
 */
import React from 'react'

const makeComponent = (name: string) =>
    ({ children, style, testID, ...rest }: any) =>
        React.createElement(name, { style, testID, ...rest }, children)

export const View       = makeComponent('View')
export const Text       = makeComponent('Text')
export const TextInput  = makeComponent('TextInput')
export const Image      = makeComponent('Image')
export const Switch     = makeComponent('Switch')
export const ScrollView = makeComponent('ScrollView')
export const Modal      = makeComponent('Modal')
export const Pressable  = makeComponent('Pressable')

export const useWindowDimensions = () => ({ width: 375, height: 812 })

export const Dimensions = {
    get: (_dim: string) => ({ width: 375, height: 812 }),
    addEventListener: (_type: string, _handler: unknown) => ({ remove() {} }),
}

export const StyleSheet = {
    create: (styles: Record<string, any>) => styles,
    flatten: (style: any) =>
        Array.isArray(style) ? Object.assign({}, ...style) : (style ?? {}),
}
