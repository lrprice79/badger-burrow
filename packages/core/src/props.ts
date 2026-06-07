import type { SxProp } from './sx'

// ─── shared ───────────────────────────────────────────────────────────────────

export type TokenValue = string | number
export type ShadowKey = 'none' | 'sm' | 'md' | 'lg'

// ─── box prop groups ──────────────────────────────────────────────────────────

export interface BackgroundProps {
    /** backgroundColor — token path or raw value */
    bg?: TokenValue
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
}

export interface BorderProps {
    /** border shorthand — raw CSS string */
    border?: string
    borderColor?: TokenValue
    borderWidth?: number
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

/** All box props combined — used by Chamber (web) and Chamber (native) */
export interface BurrowBoxProps
    extends BackgroundProps,
        PaddingProps,
        MarginProps,
        SizeProps,
        LayoutProps,
        GridProps,
        BorderProps,
        EffectProps,
        PositionProps,
        InteractionProps,
        TransitionProps {
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

/** All text props combined — used by Tunnel (web) and Tunnel (native) */
export interface BurrowTextProps extends FontProps, TextLayoutProps, TextHelperProps {
    sx?: SxProp
}

// ─── key sets (for splitting burrow props from host props) ────────────────────

export const BURROW_BOX_KEYS = new Set<string>([
    'bg',
    'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
    'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
    'w', 'h', 'minW', 'maxW', 'minH', 'maxH',
    'display', 'flex', 'flexDir', 'flexGrow', 'flexShrink', 'flexBasis',
    'align', 'alignSelf', 'alignContent',
    'justify', 'justifySelf',
    'wrap', 'gap', 'columnGap', 'rowGap', 'order',
    'gridTemplateColumns', 'gridTemplateRows', 'gridTemplateAreas',
    'gridColumn', 'gridRow', 'gridArea',
    'border', 'borderColor', 'borderWidth', 'radius',
    'borderTopLeftRadius', 'borderTopRightRadius',
    'borderBottomLeftRadius', 'borderBottomRightRadius',
    'outline', 'outlineColor', 'outlineWidth', 'outlineStyle', 'outlineOffset',
    'opacity', 'shadow', 'transform', 'filter', 'backdropFilter', 'mixBlendMode',
    'overflow', 'overflowX', 'overflowY',
    'position', 'top', 'right', 'bottom', 'left', 'zIndex',
    'cursor', 'pointerEvents', 'touchAction', 'userSelect',
    'visibility', 'boxSizing', 'aspectRatio',
    'transition', 'transitionProperty', 'transitionDuration',
    'transitionTimingFunction', 'transitionDelay',
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
    'sx',
])
