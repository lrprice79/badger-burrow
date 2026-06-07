import type { SxProp } from './sx'

// ─── shared ───────────────────────────────────────────────────────────────────

export type TokenValue = string | number
export type ShadowKey = 'none' | 'sm' | 'md' | 'lg'

// ─── box prop groups ──────────────────────────────────────────────────────────

export interface BackgroundProps {
    /** backgroundColor — token path or raw value */
    bg?: TokenValue
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
    p?: TokenValue
    px?: TokenValue
    py?: TokenValue
    pt?: TokenValue
    pb?: TokenValue
    pl?: TokenValue
    pr?: TokenValue
}

export interface MarginProps {
    m?: TokenValue
    mx?: TokenValue
    my?: TokenValue
    mt?: TokenValue
    mb?: TokenValue
    ml?: TokenValue
    mr?: TokenValue
}

export interface SizeProps {
    /** width — token path, raw number (px) or string ('100%') */
    w?: TokenValue
    h?: TokenValue
    minW?: TokenValue
    maxW?: TokenValue
    minH?: TokenValue
    maxH?: TokenValue
}

export interface LayoutProps {
    display?: string
    flex?: string | number
    flexDir?: string
    flexGrow?: number
    flexShrink?: number
    flexBasis?: TokenValue
    align?: string
    alignSelf?: string
    alignContent?: string
    justify?: string
    justifySelf?: string
    wrap?: string
    gap?: TokenValue
    columnGap?: TokenValue
    rowGap?: TokenValue
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
    inset?: TokenValue
}

export interface BorderProps {
    /** border shorthand — raw CSS string */
    border?: string
    borderStyle?: string
    borderColor?: TokenValue
    borderWidth?: number
    /** Per-side border shorthands */
    borderTop?: string
    borderRight?: string
    borderBottom?: string
    borderLeft?: string
    /** Per-side colours — token path or raw value */
    borderTopColor?: TokenValue
    borderRightColor?: TokenValue
    borderBottomColor?: TokenValue
    borderLeftColor?: TokenValue
    /** Per-side widths */
    borderTopWidth?: number
    borderRightWidth?: number
    borderBottomWidth?: number
    borderLeftWidth?: number
    /** Per-side styles */
    borderTopStyle?: string
    borderRightStyle?: string
    borderBottomStyle?: string
    borderLeftStyle?: string
    /** borderRadius — all corners — token path or raw value */
    radius?: TokenValue
    /** Per-corner radius — token path or raw value */
    borderTopLeftRadius?: TokenValue
    borderTopRightRadius?: TokenValue
    borderBottomLeftRadius?: TokenValue
    borderBottomRightRadius?: TokenValue
    /** outline */
    outline?: string
    outlineColor?: TokenValue
    outlineWidth?: TokenValue
    outlineStyle?: string
    outlineOffset?: TokenValue
}

export interface EffectProps {
    opacity?: number
    /** boxShadow — shadow token key ('none' | 'sm' | 'md' | 'lg') */
    shadow?: ShadowKey
    transform?: string
    filter?: string
    backdropFilter?: string
    mixBlendMode?: string
}

export interface PositionProps {
    overflow?: string
    overflowX?: string
    overflowY?: string
    position?: string
    top?: TokenValue
    right?: TokenValue
    bottom?: TokenValue
    left?: TokenValue
    zIndex?: number
}

export interface InteractionProps {
    cursor?: string
    pointerEvents?: string
    touchAction?: string
    userSelect?: string
    visibility?: string
    boxSizing?: string
    aspectRatio?: string
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
    scrollSnapType?: string
    scrollSnapAlign?: string
    overscrollBehavior?: string
    overscrollBehaviorX?: string
    overscrollBehaviorY?: string
    scrollBehavior?: string
}

/**
 * Visual-only box props — all style groups without pseudo-state props.
 * Safe to nest inside _hover, _focus etc (no recursive pseudo nesting).
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
        ScrollProps {}

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
    color?: TokenValue
    fontSize?: TokenValue
    fontWeight?: TokenValue
    fontFamily?: TokenValue
    fontStyle?: string
    fontVariant?: string
    fontStretch?: string
    lineHeight?: TokenValue
    letterSpacing?: TokenValue
    wordSpacing?: TokenValue
}

export interface TextLayoutProps {
    textAlign?: 'left' | 'right' | 'center' | 'justify'
    textTransform?: string
    textDecoration?: string
    textDecorationColor?: TokenValue
    textDecorationStyle?: string
    textDecorationThickness?: TokenValue
    textUnderlineOffset?: TokenValue
    textOverflow?: string
    textShadow?: string
    textIndent?: TokenValue
    textWrap?: string
    whiteSpace?: string
    overflow?: string
    wordBreak?: string
    overflowWrap?: string
    verticalAlign?: string
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
    userSelect?: string
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
