import { useRef, useEffect } from 'react'
import type { LayoutChangeEvent } from 'react-native'

declare const process: { env: { NODE_ENV?: string } }

export interface DebugInfo {
    component: 'Chamber' | 'Tunnel'
    mode: string
    style: object
}

/**
 * Dev-only inspection for native Chamber/Tunnel. Logs the resolved style, render
 * count and measured size to the console on every render. No-op in production.
 * (No visual outline on native — RN has no CSS outline / portal.)
 */
export function useDebug(enabled: boolean | undefined, info: DebugInfo): {
    onLayout?: (e: LayoutChangeEvent) => void
} {
    const renders = useRef(0)
    renders.current += 1
    const size = useRef('?')

    const on = process.env.NODE_ENV !== 'production' && !!enabled

    useEffect(() => {
        if (!on) return
        // eslint-disable-next-line no-console
        console.log(
            `[bb] ${info.component}  ⟳${renders.current} · ${size.current} · ${info.mode}`,
            info.style,
        )
    })

    if (!on) return {}
    return {
        onLayout: (e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout
            size.current = `${Math.round(width)}×${Math.round(height)}`
        },
    }
}
