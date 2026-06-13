import React, { useRef, useLayoutEffect } from 'react'

// Declared locally so the package needs no node types. Consumer bundlers replace
// `process.env.NODE_ENV` at build time, so the debug branch is dead-code
// eliminated in their production build.
declare const process: { env: { NODE_ENV?: string } }

const DEBUG_COLOR = '#c026d3'

export interface DebugInfo {
    component: 'Chamber' | 'Tunnel'
    tag: string
    mode: string
    style: object
}

export interface DebugHandle {
    /** Attach to the element (merged with the forwarded ref) for measurement. */
    debugRef: React.RefObject<HTMLElement>
    /** Dashed outline to merge into the element style — undefined when off. */
    outline?: string
    /** Value for the `data-bb-debug` attribute (render count) — undefined when off. */
    attr?: string
}

/**
 * Dev-only inspection for Chamber/Tunnel. When `__debug` is set (and it isn't a
 * production build) it outlines the element, exposes a `data-bb-debug` render
 * counter, and logs the resolved styles + size to a collapsed console group on
 * every render. Entirely inert (and tree-shaken) in production.
 */
export function useDebug(enabled: boolean | undefined, info: DebugInfo): DebugHandle {
    const ref = useRef<HTMLElement>(null)
    const renders = useRef(0)
    renders.current += 1

    const on = process.env.NODE_ENV !== 'production' && !!enabled

    useLayoutEffect(() => {
        if (!on) return
        const el = ref.current
        const r = el?.getBoundingClientRect()
        const size = r ? `${Math.round(r.width)}×${Math.round(r.height)}` : '?'
        /* eslint-disable no-console */
        console.groupCollapsed(
            `%c[bb] ${info.component} <${info.tag}>  ⟳${renders.current} · ${size} · ${info.mode}`,
            `color:${DEBUG_COLOR};font-weight:bold`,
        )
        console.table(info.style)
        console.groupEnd()
        /* eslint-enable no-console */
    })

    if (!on) return { debugRef: ref }
    return { debugRef: ref, outline: `1px dashed ${DEBUG_COLOR}`, attr: `⟳${renders.current}` }
}

/** Combine several refs (objects or callbacks) into one callback ref. */
export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
    return (node) => {
        for (const ref of refs) {
            if (!ref) continue
            if (typeof ref === 'function') ref(node)
            else (ref as React.MutableRefObject<T | null>).current = node
        }
    }
}
