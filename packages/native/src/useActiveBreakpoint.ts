import { useSyncExternalStore } from 'react'
import { Dimensions } from 'react-native'
import { getActiveBreakpoint } from '@badger-burrow/core'

/**
 * Central window-width store for breakpoint resolution.
 *
 * Why not useWindowDimensions in every component? That re-renders EVERY styled
 * component on EVERY width change — rotation, foldable hinge, split-screen
 * drag (which emits continuously on Android). Here a single module-level
 * Dimensions listener tracks the width, and useSyncExternalStore's snapshot is
 * the ACTIVE BREAKPOINT STRING — so a component only re-renders when the
 * breakpoint actually changes (width 800 → 801 re-renders nothing).
 */

let _width: number | null = null
let _dimensionsSubscribed = false
const _listeners = new Set<() => void>()

function currentWidth(): number {
    if (_width === null) _width = Dimensions.get('window').width
    return _width
}

function onDimensionsChange({ window }: { window: { width: number } }): void {
    if (window.width === _width) return
    _width = window.width
    for (const listener of _listeners) listener()
}

function subscribe(listener: () => void): () => void {
    if (!_dimensionsSubscribed) {
        _dimensionsSubscribed = true
        Dimensions.addEventListener('change', onDimensionsChange)
    }
    _listeners.add(listener)
    return () => { _listeners.delete(listener) }
}

/**
 * Returns the active breakpoint name ('base' | 'sm' | 'md' | …) for the
 * current window width. Re-renders the caller ONLY when the breakpoint
 * changes — not on every width pixel.
 */
export function useActiveBreakpoint(breakpoints: Record<string, string>): string {
    // Snapshot is a string — useSyncExternalStore compares with Object.is, so
    // equal breakpoint names skip the re-render even though width changed.
    return useSyncExternalStore(
        subscribe,
        () => getActiveBreakpoint(currentWidth(), breakpoints),
        () => getActiveBreakpoint(currentWidth(), breakpoints),
    )
}

/**
 * Test-only: set the window width and notify subscribers, exactly as the
 * Dimensions change handler would.
 */
export function __setWindowWidthForTests(width: number): void {
    onDimensionsChange({ window: { width } })
}
