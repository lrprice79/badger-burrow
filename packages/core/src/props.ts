import type { CSSProperties } from 'react'
import type { SxProp } from './sx'
import type { ResponsiveValue } from './responsive'
import type {
    ColorToken,
    SpaceToken,
    RadiusToken,
    FontSizeToken,
    FontWeightToken,
    LineHeightToken,
    LetterSpacingToken,
    FontFamilyToken,
} from '@badger-burrow/tokens'

// ─── shared ───────────────────────────────────────────────────────────────────

export type TokenValue = string | number

/**
 * A token value that can also accept a responsive object.
 * e.g. `p="space.4"` or `p={{ base: 'space.2', md: 'space.6', xxl: 'space.8' }}`
 */
export type RV = ResponsiveValue<TokenValue>

// ─── typed responsive helpers ─────────────────────────────────────────────────

/** Responsive colour token — e.g. 'color.primary.500', 'color.bg.surface' */
type RC = ResponsiveValue<ColorToken>

/** Responsive space token — e.g. 'space.4', 'space.md', or raw number */
type RS = ResponsiveValue<SpaceToken | number>

/** Responsive radius token — e.g. 'radius.md', 'radius.full', or raw number */
type RR = ResponsiveValue<RadiusToken | number>

/** Responsive fontSize token — e.g. 'fontSize.lg', or raw number */
type RF = ResponsiveValue<FontSizeToken | number>

/** Responsive fontWeight token — e.g. 'fontWeight.bold', or raw number */
type RW = ResponsiveValue<FontWeightToken | number>

/** Responsive lineHeight token — e.g. 'lineHeight.normal', or raw number */
type RL = ResponsiveValue<LineHeightToken | number>

/** Responsive letterSpacing token — e.g. 'letterSpacing.wide', or raw number */
type RLS = ResponsiveValue<LetterSpacingToken | number>

/** Responsive fontFamily token — e.g. 'fontFamily.sans' */
type RFF = ResponsiveValue<FontFamilyToken>

export type ShadowKey = 'none' | 'sm' | 'md' | 'lg'

// ─── box prop groups ──────────────────────────────────────────────────────────

export interface BackgroundProps {
    /** backgroundColor — token path or raw value, or a responsive object */
    bg?: RC
    backgroundImage?: string
    backgroundSize?: string
    backgroundPosition?: string
    backgroundRepeat?: string
    backgroundAttachment?: string
    backgroundClip?: string
    backgroundOrigin?: string
    backgroundBlendMode?: string
}

export interface PaddingProps {
    p?: RS
    px?: RS
    py?: RS
    pt?: RS
    pb?: RS
    pl?: RS
    pr?: RS
}

export interface MarginProps {
    m?: RS
    mx?: RS
    my?: RS
    mt?: RS
    mb?: RS
    ml?: RS
    mr?: RS
}

export interface SizeProps {
    /** width — token path, raw number (px) or string ('100%'), or a responsive object */
    w?: RS
    h?: RS
    minW?: RS
    maxW?: RS
    minH?: RS
    maxH?: RS
}

export interface LayoutProps {
    display?: CSSProperties["display"]
    flex?: string | number
    flexDir?: CSSProperties["flexDirection"]
    flexGrow?: number
    flexShrink?: number
    flexBasis?: RS
    align?: CSSProperties["alignItems"]
    alignSelf?: CSSProperties["alignSelf"]
    alignContent?: CSSProperties["alignContent"]
    justify?: CSSProperties["justifyContent"]
    justifySelf?: CSSProperties["justifySelf"]
    wrap?: CSSProperties["flexWrap"]
    gap?: RS
    columnGap?: RS
    rowGap?: RS
    order?: number
}

export interface GridProps {
    gridTemplateColumns?: string
    gridTemplateRows?: string
    gridTemplateAreas?: string
    gridColumn?: string
    gridRow?: string
    gridArea?: string
    gridAutoColumns?: string
    gridAutoRows?: string
    gridAutoFlow?: string
}

export interface InsetProps {
    /** Shorthand for top/right/bottom/left — token path or raw value */
    inset?: RS
}

export interface BorderProps {
    /** border shorthand — raw CSS string */
    border?: string
    borderStyle?: string
    borderColor?: RC
    borderWidth?: number
    /** Per-side border shorthands */
    borderTop?: string
    borderRight?: string
    borderBottom?: string
    borderLeft?: string
    /** Per-side colours — token path or raw value */
    borderTopColor?: RC
    borderRightColor?: RC
    borderBottomColor?: RC
    borderLeftColor?: RC
    /** Per-side widths */
    borderTopWidth?: number
    borderRightWidth?: number
    borderBottomWidth?: number
    borderLeftWidth?: number
    /** Per-side styles */
    borderTopStyle?: CSSProperties["borderTopStyle"]
    borderRightStyle?: CSSProperties["borderRightStyle"]
    borderBottomStyle?: CSSProperties["borderBottomStyle"]
    borderLeftStyle?: CSSProperties["borderLeftStyle"]
    /** borderRadius — all corners — token path or raw value, or a responsive object */
    radius?: RR
    /** Per-corner radius — token path or raw value */
    borderTopLeftRadius?: RR
    borderTopRightRadius?: RR
    borderBottomLeftRadius?: RR
    borderBottomRightRadius?: RR
    /** outline */
    outline?: string
    outlineColor?: RC
    outlineWidth?: RS
    outlineStyle?: CSSProperties["outlineStyle"]
    outlineOffset?: RS
}

export interface EffectProps {
    opacity?: number
    /** boxShadow — shadow token key ('none' | 'sm' | 'md' | 'lg') */
    shadow?: ShadowKey
    transform?: CSSProperties["transform"]
    filter?: CSSProperties["filter"]
    backdropFilter?: CSSProperties["backdropFilter"]
    mixBlendMode?: CSSProperties["mixBlendMode"]
}

export interface PositionProps {
    overflow?: CSSProperties["overflow"]
    overflowX?: CSSProperties["overflowX"]
    overflowY?: CSSProperties["overflowY"]
    position?: CSSProperties["position"]
    top?: RS
    right?: RS
    bottom?: RS
    left?: RS
    zIndex?: number
}

export interface InteractionProps {
    cursor?: CSSProperties["cursor"]
    pointerEvents?: CSSProperties["pointerEvents"]
    touchAction?: CSSProperties["touchAction"]
    userSelect?: CSSProperties["userSelect"]
    visibility?: CSSProperties["visibility"]
    boxSizing?: CSSProperties["boxSizing"]
    aspectRatio?: CSSProperties["aspectRatio"]
}

export interface TransitionProps {
    transition?: string
    transitionProperty?: string
    transitionDuration?: string
    transitionTimingFunction?: string
    transitionDelay?: string
}

export interface AnimationProps {
    animation?: string
    animationName?: string
    animationDuration?: string
    animationTimingFunction?: string
    animationDelay?: string
    animationIterationCount?: string | number
    animationDirection?: string
    animationFillMode?: string
    animationPlayState?: string
}

export interface ScrollProps {
    scrollSnapType?: CSSProperties["scrollSnapType"]
    scrollSnapAlign?: CSSProperties["scrollSnapAlign"]
    overscrollBehavior?: CSSProperties["overscrollBehavior"]
    overscrollBehaviorX?: CSSProperties["overscrollBehaviorX"]
    overscrollBehaviorY?: CSSProperties["overscrollBehaviorY"]
    scrollBehavior?: CSSProperties["scrollBehavior"]
}

/**
 * Visual-only box props — all style groups without pseudo-state props.
 * Safe to nest inside _hover, _focus etc (no recursive pseudo nesting).
 *
 * Includes all font/text props so Chamber can style text inside it without
 * needing a wrapping Tunnel. Tunnel remains the semantic HTML element
 * (h1, h2, p, span) — Chamber always renders as a block element.
 */
export interface BurrowBoxVisualProps
    extends BackgroundProps,
        PaddingProps,
        MarginProps,
        SizeProps,
        LayoutProps,
        GridProps,
        InsetProps,
        BorderProps,
        EffectProps,
        PositionProps,
        InteractionProps,
        TransitionProps,
        AnimationProps,
        ScrollProps,
        FontProps,
        TextLayoutProps,
        TextHelperProps {}

/** Pseudo-state style props */
export interface PseudoBoxProps {
    /** Styles applied on :hover */
    _hover?: BurrowBoxVisualProps
    /** Styles applied on :focus */
    _focus?: BurrowBoxVisualProps
    /** Styles applied on :active */
    _active?: BurrowBoxVisualProps
    /** Styles applied on :focus-visible */
    _focusVisible?: BurrowBoxVisualProps
    /** Styles applied on :disabled */
    _disabled?: BurrowBoxVisualProps
    /**
     * Name of a primitive colour scale to use for the auto hover background.
     * e.g. 'primary' → steps one shade darker on the primary scale.
     * Set to false to disable the smart hover default entirely.
     */
    hoverScale?: string | false
    /**
     * Explicit shade (50–900) to use with hoverScale.
     * If omitted, the shade is auto-stepped one darker from the current bg shade.
     */
    hoverShade?: number
}

/** All box props combined — used by Chamber (web) and Chamber (native) */
export interface BurrowBoxProps extends BurrowBoxVisualProps, PseudoBoxProps {
    sx?: SxProp
}

// ─── text prop groups ─────────────────────────────────────────────────────────

export interface FontProps {
    color?: RC
    fontSize?: RF
    fontWeight?: RW
    fontFamily?: RFF
    fontStyle?: CSSProperties["fontStyle"]
    fontVariant?: CSSProperties["fontVariant"]
    fontStretch?: CSSProperties["fontStretch"]
    lineHeight?: RL
    letterSpacing?: RLS
    wordSpacing?: RV
}

export interface TextLayoutProps {
    textAlign?: CSSProperties["textAlign"]
    textTransform?: CSSProperties["textTransform"]
    textDecoration?: CSSProperties["textDecoration"]
    textDecorationColor?: RC
    textDecorationStyle?: CSSProperties["textDecorationStyle"]
    textDecorationThickness?: RS
    textUnderlineOffset?: RS
    textOverflow?: CSSProperties["textOverflow"]
    textShadow?: CSSProperties["textShadow"]
    textIndent?: RS
    textWrap?: CSSProperties["textWrap"]
    whiteSpace?: CSSProperties["whiteSpace"]
    overflow?: CSSProperties["overflow"]
    wordBreak?: CSSProperties["wordBreak"]
    overflowWrap?: CSSProperties["overflowWrap"]
    verticalAlign?: CSSProperties["verticalAlign"]
}

export interface TextHelperProps {
    /** fontStyle: italic shorthand */
    italic?: boolean
    /** overflow:hidden + whiteSpace:nowrap + textOverflow:ellipsis shorthand */
    truncate?: boolean
    /** whiteSpace: nowrap shorthand */
    nowrap?: boolean
    /** Multi-line clamp — sets -webkit-line-clamp with required companions */
    lineClamp?: number
    userSelect?: CSSProperties["userSelect"]
}

/**
 * Visual-only text props — safe to nest inside _hover, _focus etc.
 */
export interface BurrowTextVisualProps extends FontProps, TextLayoutProps, TextHelperProps {}

/** Pseudo-state style props for text */
export interface PseudoTextProps {
    /** Styles applied on :hover */
    _hover?: BurrowTextVisualProps
    /** Styles applied on :focus */
    _focus?: BurrowTextVisualProps
    /** Styles applied on :active */
    _active?: BurrowTextVisualProps
    /** Styles applied on :focus-visible */
    _focusVisible?: BurrowTextVisualProps
    /** Styles applied on :disabled */
    _disabled?: BurrowTextVisualProps
}

/** All text props combined — used by Tunnel (web) and Tunnel (native) */
export interface BurrowTextProps extends BurrowTextVisualProps, PseudoTextProps {
    sx?: SxProp
}

// ─── key sets (for splitting burrow props from host props) ────────────────────

export const BURROW_BOX_KEYS = new Set<string>([
    // background
    'bg',
    'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
    'backgroundAttachment', 'backgroundClip', 'backgroundOrigin', 'backgroundBlendMode',
    // spacing
    'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
    'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
    // size
    'w', 'h', 'minW', 'maxW', 'minH', 'maxH',
    // layout
    'display', 'flex', 'flexDir', 'flexGrow', 'flexShrink', 'flexBasis',
    'align', 'alignSelf', 'alignContent',
    'justify', 'justifySelf',
    'wrap', 'gap', 'columnGap', 'rowGap', 'order',
    // grid
    'gridTemplateColumns', 'gridTemplateRows', 'gridTemplateAreas',
    'gridColumn', 'gridRow', 'gridArea',
    'gridAutoColumns', 'gridAutoRows', 'gridAutoFlow',
    // border
    'border', 'borderStyle', 'borderColor', 'borderWidth',
    'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle',
    'radius',
    'borderTopLeftRadius', 'borderTopRightRadius',
    'borderBottomLeftRadius', 'borderBottomRightRadius',
    // outline
    'outline', 'outlineColor', 'outlineWidth', 'outlineStyle', 'outlineOffset',
    // effects
    'opacity', 'shadow', 'transform', 'filter', 'backdropFilter', 'mixBlendMode',
    // position
    'inset',
    'overflow', 'overflowX', 'overflowY',
    'position', 'top', 'right', 'bottom', 'left', 'zIndex',
    // interaction
    'cursor', 'pointerEvents', 'touchAction', 'userSelect',
    'visibility', 'boxSizing', 'aspectRatio',
    // transition
    'transition', 'transitionProperty', 'transitionDuration',
    'transitionTimingFunction', 'transitionDelay',
    // animation
    'animation', 'animationName', 'animationDuration', 'animationTimingFunction',
    'animationDelay', 'animationIterationCount', 'animationDirection',
    'animationFillMode', 'animationPlayState',
    // scroll
    'scrollSnapType', 'scrollSnapAlign',
    'overscrollBehavior', 'overscrollBehaviorX', 'overscrollBehaviorY',
    'scrollBehavior',
    // font / typography
    'color',
    'fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'fontVariant', 'fontStretch',
    'lineHeight', 'letterSpacing', 'wordSpacing',
    // text layout
    'textAlign', 'textTransform',
    'textDecoration', 'textDecorationColor', 'textDecorationStyle', 'textDecorationThickness',
    'textUnderlineOffset',
    'textOverflow', 'textShadow', 'textIndent', 'textWrap',
    'whiteSpace', 'wordBreak', 'overflowWrap', 'verticalAlign',
    // text helpers
    'italic', 'truncate', 'nowrap', 'lineClamp',
    // pseudo
    '_hover', '_focus', '_active', '_focusVisible', '_disabled',
    'hoverScale', 'hoverShade',
    'sx',
])

export const BURROW_TEXT_KEYS = new Set<string>([
    'color',
    'fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'fontVariant', 'fontStretch',
    'lineHeight', 'letterSpacing', 'wordSpacing',
    'textAlign', 'textTransform',
    'textDecoration', 'textDecorationColor', 'textDecorationStyle', 'textDecorationThickness',
    'textUnderlineOffset',
    'textOverflow', 'textShadow', 'textIndent', 'textWrap',
    'whiteSpace', 'overflow', 'wordBreak', 'overflowWrap', 'verticalAlign',
    'italic', 'truncate', 'nowrap', 'lineClamp', 'userSelect',
    // pseudo
    '_hover', '_focus', '_active', '_focusVisible', '_disabled',
    'sx',
])
