import { defaultTokens } from '@badger-eco/burrow-tokens'
import type { BurrowTokens } from '@badger-eco/burrow-tokens'
import type { ColorMode } from './resolver'

export interface BurrowSnapshot {
    tokens: BurrowTokens
    mode: ColorMode
}

type Listener = () => void

let _tokens: BurrowTokens = defaultTokens
let _mode: ColorMode = 'light'
let _listeners: Set<Listener> = new Set()
let _snapshot: BurrowSnapshot = { tokens: _tokens, mode: _mode }

function notify(): void {
    _snapshot = { tokens: _tokens, mode: _mode }
    for (const listener of _listeners) {
        listener()
    }
}

export const BadgerBase = {
    getTokens(): BurrowTokens {
        return _tokens
    },

    setTokens(tokens: BurrowTokens): void {
        _tokens = tokens
        notify()
    },

    getMode(): ColorMode {
        return _mode
    },

    setMode(mode: ColorMode): void {
        if (mode === _mode) return
        _mode = mode
        notify()
    },

    subscribe(listener: Listener): () => void {
        _listeners.add(listener)
        return () => {
            _listeners.delete(listener)
        }
    },

    /**
     * Returns a stable snapshot object. The reference only changes when
     * tokens or mode change — compatible with useSyncExternalStore.
     */
    getSnapshot(): BurrowSnapshot {
        return _snapshot
    },

    /**
     * Reset to initial state. Primarily for testing.
     */
    reset(): void {
        _tokens = defaultTokens
        _mode = 'light'
        _listeners = new Set()
        _snapshot = { tokens: _tokens, mode: _mode }
    },
} as const
