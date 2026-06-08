/**
 * Known breakpoints for autocomplete. Open-ended so users can add custom
 * breakpoints (xs, xxl, etc.) via extendBurrow without TypeScript errors.
 *
 * `string & {}` preserves autocomplete for the named values while accepting
 * any string key — e.g. p={{ xs: 'space.1', xxl: 'space.8' }} is valid.
 */
export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | (string & {})

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

/** Default breakpoint order — used when no token breakpoints are available */
const DEFAULT_BREAKPOINT_ORDER: string[] = ['base', 'sm', 'md', 'lg', 'xl']

/**
 * Returns the full ordered breakpoint list (base → largest) derived from
 * tokens.breakpoints. Custom breakpoints (xs, xxl, etc.) are automatically
 * included and sorted by their pixel value.
 *
 * @example
 * getBreakpointOrder({ sm: '576px', md: '768px', xl: '1200px' })
 * // → ['base', 'sm', 'md', 'xl']
 */
export function getBreakpointOrder(breakpoints: Record<string, string>): string[] {
    const sorted = Object.entries(breakpoints)
        .map(([bp, val]) => ({ bp, px: parseInt(val, 10) }))
        .sort((a, b) => a.px - b.px)
        .map(({ bp }) => bp)
    return ['base', ...sorted]
}

/**
 * Returns true if the value is a responsive object (has at least one key
 * that matches a known breakpoint).
 *
 * @param knownBreakpoints Optional override of the breakpoint key set.
 *   Defaults to the 5 built-in keys. Pass Object.keys(tokens.breakpoints)
 *   to support custom breakpoints.
 */
export function isResponsiveValue(
    v: unknown,
    knownBreakpoints?: string[],
): v is Partial<Record<string, unknown>> {
    if (v === null || typeof v !== 'object' || Array.isArray(v)) return false
    const keys = knownBreakpoints
        ? ['base', ...knownBreakpoints]
        : DEFAULT_BREAKPOINT_ORDER
    return keys.some(bp => bp in (v as object))
}

/**
 * Resolves a responsive value to a single value for the given breakpoint.
 * Cascades down: if the exact breakpoint isn't set, falls back to the nearest
 * smaller breakpoint that is set (same as CSS min-width media queries).
 *
 * @param breakpointOrder Full ordered list ['base', 'sm', 'md', ...] from
 *   getBreakpointOrder(). Defaults to the 5 built-in keys. Pass the result
 *   of getBreakpointOrder(tokens.breakpoints) to support custom breakpoints.
 */
export function resolveResponsiveValue<T>(
    v: ResponsiveValue<T>,
    breakpoint: string,
    breakpointOrder?: string[],
): T | undefined {
    const order = breakpointOrder ?? DEFAULT_BREAKPOINT_ORDER
    if (!isResponsiveValue(v, order.filter(bp => bp !== 'base'))) return v as T

    const obj = v as Partial<Record<string, T>>
    const idx = order.indexOf(breakpoint)

    // Walk from current breakpoint down to base, return first value found
    for (let i = idx; i >= 0; i--) {
        const bp = order[i]
        if (bp in obj && obj[bp] !== undefined) return obj[bp]
    }
    return undefined
}

/**
 * Given a pixel width and the token breakpoints map, returns the active breakpoint.
 * Breakpoint values are CSS strings like '576px' — we strip 'px' and compare numerically.
 *
 * Works with any custom breakpoints (xs, xxl, etc.) — derives order dynamically
 * from the pixel values in the map rather than using a hardcoded list.
 */
export function getActiveBreakpoint(
    width: number,
    breakpoints: Record<string, string>,
): string {
    // Sorted from largest to smallest so we find the highest matching one first
    const sorted = Object.entries(breakpoints)
        .map(([bp, val]) => ({ bp, px: parseInt(val, 10) }))
        .sort((a, b) => b.px - a.px)

    for (const { bp, px } of sorted) {
        if (width >= px) return bp
    }
    return 'base'
}

/**
 * Splits props into:
 * - baseProps: plain values + base values extracted from responsive objects
 * - responsiveProps: responsive objects (breakpoint-keyed), kept for media query / resolve
 *
 * @param knownBreakpoints Optional token breakpoints map (tokens.breakpoints).
 *   Pass this to recognise custom breakpoints (xs, xxl, etc.) as responsive values.
 *   Defaults to the 5 built-in keys when omitted.
 */
export function splitResponsiveProps(
    props: Record<string, unknown>,
    knownBreakpoints?: Record<string, string>,
): {
    baseProps: Record<string, unknown>
    responsiveProps: Record<string, Partial<Record<string, unknown>>>
} {
    const bpKeys = knownBreakpoints ? Object.keys(knownBreakpoints) : undefined
    const baseProps: Record<string, unknown> = {}
    const responsiveProps: Record<string, Partial<Record<string, unknown>>> = {}

    for (const [key, value] of Object.entries(props)) {
        if (isResponsiveValue(value, bpKeys)) {
            const obj = value as Partial<Record<string, unknown>>
            // Extract base for inline styles
            if ('base' in obj && obj.base !== undefined) {
                baseProps[key] = obj.base
            }
            // Keep the full responsive object (including any base) for media queries
            responsiveProps[key] = obj
        } else {
            baseProps[key] = value
        }
    }

    return { baseProps, responsiveProps }
}
