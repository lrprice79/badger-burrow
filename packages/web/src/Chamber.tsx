import React, { useEffect, useMemo } from 'react'
import {
    resolveSx,
    buildBoxStyles,
    buildPseudoStyles,
    toClassName,
    BURROW_BOX_KEYS,
} from '@badger-burrow/core'
import type { BurrowBoxProps } from '@badger-burrow/core'
import { useBurrow } from './useBurrow'
import { acquirePseudoStyles, releasePseudoStyles } from './styleInjector'

export interface ChamberProps
    extends React.HTMLAttributes<HTMLDivElement>,
        BurrowBoxProps {}

/**
 * A styled box component backed by BadgerBurrow tokens.
 * Accepts shorthand token props alongside all standard div props.
 *
 * Priority (lowest → highest): sx → named props → style
 *
 * Pseudo-state styling via _hover, _focus, _active, _focusVisible, _disabled.
 * Smart hover bg: if `bg` is a primitive path, hover bg auto-steps one shade darker.
 * Use `hoverScale` to specify which colour scale to step on, `hoverShade` for an
 * exact shade, or `hoverScale={false}` to disable the smart default entirely.
 *
 * @example
 * <Chamber
 *   bg="color.primary.500"
 *   p="space.4" radius="radius.md"
 *   _hover={{ shadow: 'md', cursor: 'pointer' }}
 *   _focus={{ outlineStyle: 'solid', outlineColor: 'color.interactive.primary', outlineWidth: '2px' }}
 * />
 */
export function Chamber({ sx, style, children, ...props }: ChamberProps) {
    const { tokens, mode } = useBurrow()

    // Split props into burrow props vs plain HTML props
    const burrowProps: Record<string, unknown> = {}
    const htmlProps: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props)) {
        if (BURROW_BOX_KEYS.has(key)) burrowProps[key] = value
        else htmlProps[key] = value
    }

    const boxPropsTyped = burrowProps as BurrowBoxProps

    // Resolve inline styles
    const tokenStyles = buildBoxStyles(boxPropsTyped, tokens, mode)
    const sxStyles    = sx ? resolveSx(sx, tokens, mode) : {}

    // Resolve pseudo styles — memoised so they only recompute on prop/token/mode change
    const pseudoStyles = useMemo(
        () => buildPseudoStyles(boxPropsTyped, tokens, mode),
        // JSON.stringify is intentional — props object reference changes every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(burrowProps), mode, tokens],
    )

    const hasPseudo = Object.keys(pseudoStyles).length > 0

    // Stable class name derived from resolved pseudo CSS + mode
    // Including mode ensures light/dark get separate class names (different resolved colours)
    const className = useMemo(() => {
        if (!hasPseudo) return undefined
        return toClassName(JSON.stringify(pseudoStyles) + mode)
    }, [pseudoStyles, hasPseudo, mode])

    // Inject pseudo <style> tags; clean up on unmount
    useEffect(() => {
        if (!className || !hasPseudo) return
        acquirePseudoStyles(className, pseudoStyles)
        const keys = Object.keys(pseudoStyles)
        return () => releasePseudoStyles(className, keys)
    }, [className, pseudoStyles, hasPseudo])

    return (
        <div
            className={className}
            style={{ ...sxStyles, ...tokenStyles, ...style } as React.CSSProperties}
            {...(htmlProps as React.HTMLAttributes<HTMLDivElement>)}
        >
            {children}
        </div>
    )
}
