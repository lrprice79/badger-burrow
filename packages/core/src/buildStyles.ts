import type { BurrowTokens } from '@badger-burrow/tokens'
import { resolveScoped } from './resolver'
import type { ColorMode } from './resolver'
import type { BurrowBoxProps, BurrowTextProps, BurrowTextVisualProps, RV } from './props'
import type { ResponsiveValue } from './responsive'
import { resolveDuration, resolveEasing, resolveTransition } from './motion'

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve a short-form token value within a category to a CSS-ready value.
 * The prop's category (e.g. 'space', 'color') is supplied by the caller so the
 * value omits the redundant prefix — `p="4"` resolves `space.4`.
 *
 * Responsive objects are resolved before buildStyles runs; a stray one here is
 * ignored gracefully. Numbers are raw values. Anything unresolvable (raw CSS)
 * passes through.
 */
function resolveIn(
    category: string,
    value: RV | undefined,
    tokens: BurrowTokens,
    mode: ColorMode
): string | number | undefined {
    if (value === undefined) return undefined
    // Responsive object that wasn't pre-resolved — ignore gracefully
    if (typeof value === 'object') return undefined
    if (typeof value === 'number') return value
    return resolveScoped(category, value, tokens, mode)
}

function withPx(value: string | number | undefined): string | undefined {
    if (value === undefined) return undefined
    return typeof value === 'number' ? `${value}px` : value
}

function asString(value: string | number | undefined): string | undefined {
    if (value === undefined) return undefined
    return String(value)
}

/**
 * Collapse a non-token responsive value to a plain value. Responsive objects
 * are resolved to base/breakpoint values before buildStyles runs, so a stray
 * object here is treated as undefined (defensive — same posture as `resolve`).
 * Used for enum-style layout/grid props that pass straight through (no token
 * lookup).
 */
function flat<T extends string | number>(value: ResponsiveValue<T> | undefined): T | undefined {
    if (value === undefined || typeof value === 'object') return undefined
    return value
}

// ─── box styles ───────────────────────────────────────────────────────────────

export function buildBoxStyles(
    props: BurrowBoxProps,
    tokens: BurrowTokens,
    mode: ColorMode
): Record<string, string | number | undefined> {
    const rColor  = (v: RV | undefined) => resolveIn('color', v, tokens, mode)
    const rSpace  = (v: RV | undefined) => resolveIn('space', v, tokens, mode)
    const rRadius = (v: RV | undefined) => resolveIn('radius', v, tokens, mode)

    const {
        bg,
        backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat,
        backgroundAttachment, backgroundClip, backgroundOrigin, backgroundBlendMode,
        p, px, py, pt, pb, pl, pr,
        m, mx, my, mt, mb, ml, mr,
        w, h, minW, maxW, minH, maxH,
        display, flex, flexDir, flexGrow, flexShrink, flexBasis,
        align, alignSelf, alignContent,
        justify, justifySelf,
        wrap, gap, columnGap, rowGap, order,
        gridTemplateColumns, gridTemplateRows, gridTemplateAreas,
        gridColumn, gridRow, gridArea,
        gridAutoColumns, gridAutoRows, gridAutoFlow,
        border, borderStyle, borderColor, borderWidth,
        borderTop, borderRight, borderBottom, borderLeft,
        borderTopColor, borderRightColor, borderBottomColor, borderLeftColor,
        borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
        borderTopStyle, borderRightStyle, borderBottomStyle, borderLeftStyle,
        radius,
        borderTopLeftRadius, borderTopRightRadius,
        borderBottomLeftRadius, borderBottomRightRadius,
        outline, outlineColor, outlineWidth, outlineStyle, outlineOffset,
        opacity, shadow, transform, filter, backdropFilter, mixBlendMode,
        inset,
        overflow, overflowX, overflowY,
        position, top, right, bottom, left, zIndex,
        cursor, pointerEvents, touchAction, userSelect,
        visibility, boxSizing, aspectRatio,
        transition, transitionProperty, transitionDuration,
        transitionTimingFunction, transitionDelay,
        animation, animationName, animationDuration, animationTimingFunction,
        animationDelay, animationIterationCount, animationDirection,
        animationFillMode, animationPlayState,
        scrollSnapType, scrollSnapAlign,
        overscrollBehavior, overscrollBehaviorX, overscrollBehaviorY,
        scrollBehavior,
    } = props

    const boxShadow = shadow !== undefined
        ? tokens.primitive.shadow[shadow]?.web
        : undefined

    // Font/text props are valid on Chamber too — resolve them first so any box
    // props that overlap (e.g. overflow) take priority when spread last.
    const fontStyles = buildFontAndTextStyles(props, tokens, mode)

    return {
        ...fontStyles,
        // background
        ...(bg                    !== undefined && { backgroundColor:         withPx(rColor(bg)) }),
        ...(backgroundImage       !== undefined && { backgroundImage }),
        ...(backgroundSize        !== undefined && { backgroundSize }),
        ...(backgroundPosition    !== undefined && { backgroundPosition }),
        ...(backgroundRepeat      !== undefined && { backgroundRepeat }),
        ...(backgroundAttachment  !== undefined && { backgroundAttachment }),
        ...(backgroundClip        !== undefined && { backgroundClip }),
        ...(backgroundOrigin      !== undefined && { backgroundOrigin }),
        ...(backgroundBlendMode   !== undefined && { backgroundBlendMode }),
        // padding
        ...(p                     !== undefined && { padding:                  withPx(rSpace(p)) }),
        ...(px                    !== undefined && { paddingLeft:              withPx(rSpace(px)), paddingRight:  withPx(rSpace(px)) }),
        ...(py                    !== undefined && { paddingTop:               withPx(rSpace(py)), paddingBottom: withPx(rSpace(py)) }),
        ...(pt                    !== undefined && { paddingTop:               withPx(rSpace(pt)) }),
        ...(pb                    !== undefined && { paddingBottom:            withPx(rSpace(pb)) }),
        ...(pl                    !== undefined && { paddingLeft:              withPx(rSpace(pl)) }),
        ...(pr                    !== undefined && { paddingRight:             withPx(rSpace(pr)) }),
        // margin
        ...(m                     !== undefined && { margin:                   withPx(rSpace(m)) }),
        ...(mx                    !== undefined && { marginLeft:               withPx(rSpace(mx)), marginRight:  withPx(rSpace(mx)) }),
        ...(my                    !== undefined && { marginTop:                withPx(rSpace(my)), marginBottom: withPx(rSpace(my)) }),
        ...(mt                    !== undefined && { marginTop:                withPx(rSpace(mt)) }),
        ...(mb                    !== undefined && { marginBottom:             withPx(rSpace(mb)) }),
        ...(ml                    !== undefined && { marginLeft:               withPx(rSpace(ml)) }),
        ...(mr                    !== undefined && { marginRight:              withPx(rSpace(mr)) }),
        // dimensions
        ...(w                     !== undefined && { width:                    withPx(rSpace(w)) }),
        ...(h                     !== undefined && { height:                   withPx(rSpace(h)) }),
        ...(minW                  !== undefined && { minWidth:                 withPx(rSpace(minW)) }),
        ...(maxW                  !== undefined && { maxWidth:                 withPx(rSpace(maxW)) }),
        ...(minH                  !== undefined && { minHeight:                withPx(rSpace(minH)) }),
        ...(maxH                  !== undefined && { maxHeight:                withPx(rSpace(maxH)) }),
        // flex / layout
        ...(display               !== undefined && { display:                  flat(display) }),
        ...(flex                  !== undefined && { flex }),
        ...(flexDir               !== undefined && { flexDirection:            flat(flexDir) }),
        ...(flexGrow              !== undefined && { flexGrow }),
        ...(flexShrink            !== undefined && { flexShrink }),
        ...(flexBasis             !== undefined && { flexBasis:                withPx(rSpace(flexBasis)) }),
        ...(align                 !== undefined && { alignItems:               flat(align) }),
        ...(alignSelf             !== undefined && { alignSelf:                flat(alignSelf) }),
        ...(alignContent          !== undefined && { alignContent:            flat(alignContent) }),
        ...(justify               !== undefined && { justifyContent:           flat(justify) }),
        ...(justifySelf           !== undefined && { justifySelf:             flat(justifySelf) }),
        ...(wrap                  !== undefined && { flexWrap:                 flat(wrap) }),
        ...(gap                   !== undefined && { gap:                      withPx(rSpace(gap)) }),
        ...(columnGap             !== undefined && { columnGap:                withPx(rSpace(columnGap)) }),
        ...(rowGap                !== undefined && { rowGap:                   withPx(rSpace(rowGap)) }),
        ...(order                 !== undefined && { order }),
        // grid
        ...(gridTemplateColumns   !== undefined && { gridTemplateColumns:      flat(gridTemplateColumns) }),
        ...(gridTemplateRows      !== undefined && { gridTemplateRows:         flat(gridTemplateRows) }),
        ...(gridTemplateAreas     !== undefined && { gridTemplateAreas:        flat(gridTemplateAreas) }),
        ...(gridColumn            !== undefined && { gridColumn:               flat(gridColumn) }),
        ...(gridRow               !== undefined && { gridRow:                  flat(gridRow) }),
        ...(gridArea              !== undefined && { gridArea:                 flat(gridArea) }),
        ...(gridAutoColumns       !== undefined && { gridAutoColumns:          flat(gridAutoColumns) }),
        ...(gridAutoRows          !== undefined && { gridAutoRows:             flat(gridAutoRows) }),
        ...(gridAutoFlow          !== undefined && { gridAutoFlow:             flat(gridAutoFlow) }),
        // border
        ...(border                !== undefined && { border }),
        ...(borderStyle           !== undefined && { borderStyle }),
        ...(borderColor           !== undefined && { borderColor:              withPx(rColor(borderColor)) }),
        ...(borderWidth           !== undefined && { borderWidth:              `${borderWidth}px` }),
        ...(borderTop             !== undefined && { borderTop }),
        ...(borderRight           !== undefined && { borderRight }),
        ...(borderBottom          !== undefined && { borderBottom }),
        ...(borderLeft            !== undefined && { borderLeft }),
        ...(borderTopColor        !== undefined && { borderTopColor:           withPx(rColor(borderTopColor)) }),
        ...(borderRightColor      !== undefined && { borderRightColor:         withPx(rColor(borderRightColor)) }),
        ...(borderBottomColor     !== undefined && { borderBottomColor:        withPx(rColor(borderBottomColor)) }),
        ...(borderLeftColor       !== undefined && { borderLeftColor:          withPx(rColor(borderLeftColor)) }),
        ...(borderTopWidth        !== undefined && { borderTopWidth:           `${borderTopWidth}px` }),
        ...(borderRightWidth      !== undefined && { borderRightWidth:         `${borderRightWidth}px` }),
        ...(borderBottomWidth     !== undefined && { borderBottomWidth:        `${borderBottomWidth}px` }),
        ...(borderLeftWidth       !== undefined && { borderLeftWidth:          `${borderLeftWidth}px` }),
        ...(borderTopStyle        !== undefined && { borderTopStyle }),
        ...(borderRightStyle      !== undefined && { borderRightStyle }),
        ...(borderBottomStyle     !== undefined && { borderBottomStyle }),
        ...(borderLeftStyle       !== undefined && { borderLeftStyle }),
        ...(radius                !== undefined && { borderRadius:             withPx(rRadius(radius)) }),
        ...(borderTopLeftRadius   !== undefined && { borderTopLeftRadius:      withPx(rRadius(borderTopLeftRadius)) }),
        ...(borderTopRightRadius  !== undefined && { borderTopRightRadius:     withPx(rRadius(borderTopRightRadius)) }),
        ...(borderBottomLeftRadius  !== undefined && { borderBottomLeftRadius:  withPx(rRadius(borderBottomLeftRadius)) }),
        ...(borderBottomRightRadius !== undefined && { borderBottomRightRadius: withPx(rRadius(borderBottomRightRadius)) }),
        // outline
        ...(outline               !== undefined && { outline }),
        ...(outlineColor          !== undefined && { outlineColor:             withPx(rColor(outlineColor)) }),
        ...(outlineWidth          !== undefined && { outlineWidth:             withPx(rSpace(outlineWidth)) }),
        ...(outlineStyle          !== undefined && { outlineStyle }),
        ...(outlineOffset         !== undefined && { outlineOffset:            withPx(rSpace(outlineOffset)) }),
        // effects
        ...(opacity               !== undefined && { opacity }),
        ...(boxShadow             !== undefined && { boxShadow }),
        ...(transform             !== undefined && { transform }),
        ...(filter                !== undefined && { filter }),
        ...(backdropFilter        !== undefined && { backdropFilter }),
        ...(mixBlendMode          !== undefined && { mixBlendMode }),
        // inset / overflow / position
        ...(inset                 !== undefined && { inset:                    withPx(rSpace(inset)) }),
        ...(overflow              !== undefined && { overflow }),
        ...(overflowX             !== undefined && { overflowX }),
        ...(overflowY             !== undefined && { overflowY }),
        ...(position              !== undefined && { position }),
        ...(top                   !== undefined && { top:                      withPx(rSpace(top)) }),
        ...(right                 !== undefined && { right:                    withPx(rSpace(right)) }),
        ...(bottom                !== undefined && { bottom:                   withPx(rSpace(bottom)) }),
        ...(left                  !== undefined && { left:                     withPx(rSpace(left)) }),
        ...(zIndex                !== undefined && { zIndex }),
        // interaction
        ...(cursor                !== undefined && { cursor }),
        ...(pointerEvents         !== undefined && { pointerEvents }),
        ...(touchAction           !== undefined && { touchAction }),
        ...(userSelect            !== undefined && { userSelect }),
        ...(visibility            !== undefined && { visibility }),
        ...(boxSizing             !== undefined && { boxSizing }),
        ...(aspectRatio           !== undefined && { aspectRatio }),
        // transition — motion token keywords resolve, raw CSS passes through
        ...(transition            !== undefined && { transition:               resolveTransition(transition, tokens) }),
        ...(transitionProperty    !== undefined && { transitionProperty }),
        ...(transitionDuration    !== undefined && { transitionDuration:       resolveDuration(transitionDuration, tokens) }),
        ...(transitionTimingFunction !== undefined && { transitionTimingFunction: resolveEasing(transitionTimingFunction, tokens) }),
        ...(transitionDelay       !== undefined && { transitionDelay:          resolveDuration(transitionDelay, tokens) }),
        // animation — duration / easing sub-props resolve motion tokens
        ...(animation             !== undefined && { animation }),
        ...(animationName         !== undefined && { animationName }),
        ...(animationDuration     !== undefined && { animationDuration:        resolveDuration(animationDuration, tokens) }),
        ...(animationTimingFunction !== undefined && { animationTimingFunction: resolveEasing(animationTimingFunction, tokens) }),
        ...(animationDelay        !== undefined && { animationDelay:           resolveDuration(animationDelay, tokens) }),
        ...(animationIterationCount !== undefined && { animationIterationCount }),
        ...(animationDirection    !== undefined && { animationDirection }),
        ...(animationFillMode     !== undefined && { animationFillMode }),
        ...(animationPlayState    !== undefined && { animationPlayState }),
        // scroll
        ...(scrollSnapType        !== undefined && { scrollSnapType }),
        ...(scrollSnapAlign       !== undefined && { scrollSnapAlign }),
        ...(overscrollBehavior    !== undefined && { overscrollBehavior }),
        ...(overscrollBehaviorX   !== undefined && { overscrollBehaviorX }),
        ...(overscrollBehaviorY   !== undefined && { overscrollBehaviorY }),
        ...(scrollBehavior        !== undefined && { scrollBehavior }),
    }
}

// ─── shared font / typography resolver ───────────────────────────────────────

/**
 * Resolves all font and text layout props to CSS-ready values.
 * Called by both buildBoxStyles (Chamber) and buildTextStyles (Tunnel) so
 * Chamber can carry font props without duplicating the resolution logic.
 */
function buildFontAndTextStyles(
    props: BurrowTextVisualProps,
    tokens: BurrowTokens,
    mode: ColorMode,
): Record<string, string | number | undefined> {
    const rColor         = (v: RV | undefined) => resolveIn('color', v, tokens, mode)
    const rSpace         = (v: RV | undefined) => resolveIn('space', v, tokens, mode)
    const rFontSize      = (v: RV | undefined) => resolveIn('fontSize', v, tokens, mode)
    const rFontWeight    = (v: RV | undefined) => resolveIn('fontWeight', v, tokens, mode)
    const rLineHeight    = (v: RV | undefined) => resolveIn('lineHeight', v, tokens, mode)
    const rLetterSpacing = (v: RV | undefined) => resolveIn('letterSpacing', v, tokens, mode)
    const rFontFamily    = (v: RV | undefined) => resolveIn('fontFamily', v, tokens, mode)

    const {
        color, fontSize, fontWeight, fontFamily, fontStyle, fontVariant, fontStretch,
        lineHeight, letterSpacing, wordSpacing,
        textAlign, textTransform,
        textDecoration, textDecorationColor, textDecorationStyle, textDecorationThickness,
        textUnderlineOffset,
        textOverflow, textShadow, textIndent, textWrap,
        whiteSpace, overflow, wordBreak, overflowWrap, verticalAlign,
        italic, truncate, nowrap, lineClamp, userSelect,
    } = props

    return {
        // Boolean helpers go first so any explicit prop spread below overrides
        // them per-field (#7 — explicit props win over shorthand helpers).
        ...(italic   === true && { fontStyle: 'italic' }),
        ...(truncate === true && { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }),
        ...(nowrap   === true && { whiteSpace: 'nowrap' }),
        ...(lineClamp !== undefined && {
            display: '-webkit-box',
            WebkitLineClamp: lineClamp,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
        }),
        ...(color                  !== undefined && { color:                  withPx(rColor(color)) }),
        ...(fontSize               !== undefined && { fontSize:               withPx(rFontSize(fontSize)) }),
        ...(fontWeight             !== undefined && { fontWeight:             asString(rFontWeight(fontWeight)) }),
        ...(fontFamily             !== undefined && { fontFamily:             asString(rFontFamily(fontFamily)) }),
        ...(fontStyle              !== undefined && { fontStyle }),
        ...(fontVariant            !== undefined && { fontVariant }),
        ...(fontStretch            !== undefined && { fontStretch }),
        ...(lineHeight             !== undefined && { lineHeight:             asString(rLineHeight(lineHeight)) }),
        ...(letterSpacing          !== undefined && { letterSpacing:          withPx(rLetterSpacing(letterSpacing)) }),
        ...(wordSpacing            !== undefined && { wordSpacing:            withPx(rSpace(wordSpacing)) }),
        ...(textAlign              !== undefined && { textAlign }),
        ...(textTransform          !== undefined && { textTransform }),
        ...(textDecoration         !== undefined && { textDecoration }),
        ...(textDecorationColor    !== undefined && { textDecorationColor:    withPx(rColor(textDecorationColor)) }),
        ...(textDecorationStyle    !== undefined && { textDecorationStyle }),
        ...(textDecorationThickness !== undefined && { textDecorationThickness: withPx(rSpace(textDecorationThickness)) }),
        ...(textUnderlineOffset    !== undefined && { textUnderlineOffset:    withPx(rSpace(textUnderlineOffset)) }),
        ...(textOverflow           !== undefined && { textOverflow }),
        ...(textShadow             !== undefined && { textShadow }),
        ...(textIndent             !== undefined && { textIndent:             withPx(rSpace(textIndent)) }),
        ...(textWrap               !== undefined && { textWrap }),
        ...(whiteSpace             !== undefined && { whiteSpace }),
        ...(overflow               !== undefined && { overflow }),
        ...(wordBreak              !== undefined && { wordBreak }),
        ...(overflowWrap           !== undefined && { overflowWrap }),
        ...(verticalAlign          !== undefined && { verticalAlign }),
        ...(userSelect             !== undefined && { userSelect }),
    }
}

// ─── text styles ──────────────────────────────────────────────────────────────

export function buildTextStyles(
    props: BurrowTextProps,
    tokens: BurrowTokens,
    mode: ColorMode
): Record<string, string | number | undefined> {
    return buildFontAndTextStyles(props, tokens, mode)
}
