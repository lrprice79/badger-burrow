import { useSyncExternalStore } from 'react'
import { BadgerBase } from '@badger-eco/burrow-core'

export function useBurrow() {
    const snapshot = useSyncExternalStore(
        BadgerBase.subscribe,
        BadgerBase.getSnapshot,
        BadgerBase.getSnapshot,
    )
    return {
        tokens: snapshot.tokens,
        mode: snapshot.mode,
        setMode: (mode: 'light' | 'dark') => BadgerBase.setMode(mode),
    }
}
