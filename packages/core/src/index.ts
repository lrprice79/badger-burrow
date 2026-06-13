// @badger-burrow/core — pub/sub store, token resolution, React hook
// Exports added as each task is completed
export { fnv1a, toClassName } from './hash'
export { resolveToken, resolvePrimitive } from './resolver'
export type { ColorMode } from './resolver'
export { toCssVar, buildCssVarMap, injectCssVars, removeCssVars } from './cssVars'
export { BadgerBase } from './store'
export type { BurrowSnapshot } from './store'
export { extendBurrow, mergeBurrow } from './extendBurrow'
export { createVariants } from './variants'
export { resolveSx } from './sx'
export type { SxProp } from './sx'
export { buildBoxStyles, buildTextStyles } from './buildStyles'
export {
    isResponsiveValue,
    splitResponsiveProps,
    resolveResponsiveValue,
    getActiveBreakpoint,
    getBreakpointOrder,
} from './responsive'
export type { Breakpoint, ResponsiveValue } from './responsive'
export { stepShade, resolveHoverBg, buildPseudoStyles, buildTextPseudoStyles } from './pseudo'
export type { ResolvedPseudoStyles } from './pseudo'
export type {
    ColorToken, SpaceToken, RadiusToken,
    FontSizeToken, FontWeightToken, LineHeightToken, LetterSpacingToken, FontFamilyToken,
    DurationToken, EasingToken,
} from '@badger-burrow/tokens'
export { resolveDuration, resolveEasing, resolveTransition } from './motion'
export type {
    BurrowBoxProps, BurrowBoxVisualProps, PseudoBoxProps,
    BurrowTextProps, BurrowTextVisualProps, PseudoTextProps,
    BackgroundProps, PaddingProps, MarginProps, SizeProps,
    LayoutProps, FlexProps, GridProps, InsetProps, BorderProps, EffectProps, PositionProps,
    InteractionProps, TransitionProps, AnimationProps, ScrollProps,
    FontProps, TextLayoutProps, TextHelperProps,
    TokenValue, RV, ShadowKey, DebugProps,
} from './props'
export { BURROW_BOX_KEYS, BURROW_TEXT_KEYS } from './props'
