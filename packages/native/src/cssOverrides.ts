/**
 * React Native prop type overrides.
 *
 * Core's BurrowBoxProps / BurrowTextProps use CSSProperties["…"] for the
 * CSS-string layout and typography props — accurate for web. This file
 * provides narrower, RN-specific types for the props where React Native's
 * style API differs:
 *
 *   - display: 'flex' | 'none'   (not 'grid', 'block', etc.)
 *   - position: 'absolute' | 'relative' | 'static'  (not 'fixed', 'sticky')
 *   - overflow: 'visible' | 'hidden' | 'scroll'
 *   - flexDir: 'row' | 'column' | …  (no browser-global values)
 *   - fontStyle: 'normal' | 'italic'  (only 2 valid values)
 *   - textAlign: adds 'auto', no browser-global values
 *   etc.
 *
 * Props that DON'T exist in RN (cursor, backdropFilter, scrollSnapType, …)
 * are not overridden — they stay as CSSProperties types from core, which
 * is fine: they're typed but silently ignored at runtime.
 *
 * Props with fundamentally incompatible RN types (transform is an array in
 * RN, fontVariant is an array, etc.) are also not overridden — leave as
 * CSSProperties to avoid a type clash.
 */

import type { ViewStyle, TextStyle } from 'react-native'

// ─── box overrides (Chamber) ──────────────────────────────────────────────────

export type NativeBoxCSSOverrides = {
    /** RN: 'flex' | 'none' — no grid, block, inline-flex etc. */
    display?: ViewStyle['display']
    /** RN: 'absolute' | 'relative' | 'static' — no fixed or sticky */
    position?: ViewStyle['position']
    /** RN: 'visible' | 'hidden' | 'scroll' */
    overflow?: ViewStyle['overflow']
    flexDir?: ViewStyle['flexDirection']
    align?: ViewStyle['alignItems']
    alignSelf?: ViewStyle['alignSelf']
    alignContent?: ViewStyle['alignContent']
    justify?: ViewStyle['justifyContent']
    wrap?: ViewStyle['flexWrap']
    /** RN values differ: 'box-none' | 'none' | 'box-only' | 'auto' */
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
    /** RN border style: 'solid' | 'dotted' | 'dashed' */
    borderStyle?: ViewStyle['borderStyle']
}

// ─── text overrides (Tunnel) ──────────────────────────────────────────────────

export type NativeTextCSSOverrides = {
    /** RN: 'normal' | 'italic' only */
    fontStyle?: TextStyle['fontStyle']
    /** RN textAlign adds 'auto'; drops browser-global values */
    textAlign?: TextStyle['textAlign']
    textTransform?: TextStyle['textTransform']
    textDecorationStyle?: TextStyle['textDecorationStyle']
}
