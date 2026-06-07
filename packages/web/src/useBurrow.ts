import { useSyncExternalStore } from 'react'
import { BadgerBase } from '@badger-burrow/core'
import type { BurrowSnapshot } from '@badger-burrow/core'
import type { ColorMode } from '@badger-burrow/core'

export interface UseBurrowResult extends BurrowSnapshot {
    setMode: (mode: ColorMode) => void
}

/**
 * Returns the current BadgerBurrow token snapshot and a setMode helper.
 *
 * Subscribes to BadgerBase via useSyncExternalStore — renders only when
 * tokens or mode actually change. No ThemeProvider required anywhere in
 * the tree.
 *
 * @example
 * function MyButton() {
 *   const { tokens, mode, setMode } = useBurrow()
 *   return (
 *     <button style={{ background: tokens.primitive.color.primary[500] }}>
 *       Switch to {mode === 'light' ? 'dark' : 'light'}
 *     </button>
 *   )
 * }
 */
export function useBurrow(): UseBurrowResult {
    const snapshot = useSyncExternalStore(
        BadgerBase.subscribe,
        BadgerBase.getSnapshot,
        BadgerBase.getSnapshot,
    )

    return {
        tokens: snapshot.tokens,
        mode: snapshot.mode,
        setMode: BadgerBase.setMode,
    }
}
