import type { BurrowTokens } from '@badger-burrow/tokens'
import { resolveToken } from './resolver'
import type { ColorMode } from './resolver'
import type { BurrowBoxProps, BurrowTextProps, BurrowTextVisualProps, RV } from './props'

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve a token value to a CSS-ready string or number.
 * Accepts RV (ResponsiveValue<TokenValue>) — responsive objects are never
 * expected here (splitResponsiveProps resolves them before buildStyles runs),
 * but if one does arrive it returns undefined gracefully rather than throwing.
 */
function resolve(
    value: RV | undefined,
    tokens: BurrowTokens,
    mode: ColorMode
): string | number | undefined {
    if (value === undefined) return undefined
    // Responsive object that wasn't pre-resolved — ignore gracefully
    if (typeof value === 'object') return undefined
    if (typeof value === 'number') return value
    const resolved = resolveToken(value, tokens, mode)
    return resolved !== undefined ? resolved : value
}

function withPx(value: string | number | undefined): string | undefined {
    if (value === undefined) return undefined
    return typeof value === 'number' ? `${value}px` : value
}

function asString(value: string | number | undefined): string | undefined {
    if (value === undefined) return undefined
    return String(value)
}

// ─── box styles ───────────────────────────────────────────────────────────────

export function buildBoxStyles(
    props: BurrowBoxProps,
    tokens: BurrowTokens,
    mode: ColorMode
): Record<string, string | number | undefined> {
    const r = (v: RV | undefined) => resolve(v, tokens, mode)

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
        ...(bg                    !== undefined && { backgroundColor:         withPx(r(bg)) }),
        ...(backgroundImage       !== undefined && { backgroundImage }),
        ...(backgroundSize        !== undefined && { backgroundSize }),
        ...(backgroundPosition    !== undefined && { backgroundPosition }),
        ...(backgroundRepeat      !== undefined && { backgroundRepeat }),
        ...(backgroundAttachment  !== undefined && { backgroundAttachment }),
        ...(backgroundClip        !== undefined && { backgroundClip }),
        ...(backgroundOrigin      !== undefined && { backgroundOrigin }),
        ...(backgroundBlendMode   !== undefined && { backgroundBlendMode }),
        // padding
        ...(p                     !== undefined && { padding:                  withPx(r(p)) }),
        ...(px                    !== undefined && { paddingLeft:              withPx(r(px)), paddingRight:  withPx(r(px)) }),
        ...(py                    !== undefined && { paddingTop:               withPx(r(py)), paddingBottom: withPx(r(py)) }),
        ...(pt                    !== undefined && { paddingTop:               withPx(r(pt)) }),
        ...(pb                    !== undefined && { paddingBottom:            withPx(r(pb)) }),
        ...(pl                    !== undefined && { paddingLeft:              withPx(r(pl)) }),
        ...(pr                    !== undefined && { paddingRight:             withPx(r(pr)) }),
        // margin
        ...(m                     !== undefined && { margin:                   withPx(r(m)) }),
        ...(mx                    !== undefined && { marginLeft:               withPx(r(mx)), marginRight:  withPx(r(mx)) }),
        ...(my                    !== undefined && { marginTop:                withPx(r(my)), marginBottom: withPx(r(my)) }),
        ...(mt                    !== undefined && { marginTop:                withPx(r(mt)) }),
        ...(mb                    !== undefined && { marginBottom:             withPx(r(mb)) }),
        ...(ml                    !== undefined && { marginLeft:               withPx(r(ml)) }),
        ...(mr                    !== undefined && { marginRight:              withPx(r(mr)) }),
        // dimensions
        ...(w                     !== undefined && { width:                    withPx(r(w)) }),
        ...(h                     !== undefined && { height:                   withPx(r(h)) }),
        ...(minW                  !== undefined && { minWidth:                 withPx(r(minW)) }),
        ...(maxW                  !== undefined && { maxWidth:                 withPx(r(maxW)) }),
        ...(minH                  !== undefined && { minHeight:                withPx(r(minH)) }),
        ...(maxH                  !== undefined && { maxHeight:                withPx(r(maxH)) }),
        // flex / layout
        ...(display               !== undefined && { display }),
        ...(flex                  !== undefined && { flex }),
        ...(flexDir               !== undefined && { flexDirection:            flexDir }),
        ...(flexGrow              !== undefined && { flexGrow }),
        ...(flexShrink            !== undefined && { flexShrink }),
        ...(flexBasis             !== undefined && { flexBasis:                withPx(r(flexBasis)) }),
        ...(align                 !== undefined && { alignItems:               align }),
        ...(alignSelf             !== undefined && { alignSelf }),
        ...(alignContent          !== undefined && { alignContent }),
        ...(justify               !== undefined && { justifyContent:           justify }),
        ...(justifySelf           !== undefined && { justifySelf }),
        ...(wrap                  !== undefined && { flexWrap:                 wrap }),
        ...(gap                   !== undefined && { gap:                      withPx(r(gap)) }),
        ...(columnGap             !== undefined && { columnGap:                withPx(r(columnGap)) }),
        ...(rowGap                !== undefined && { rowGap:                   withPx(r(rowGap)) }),
        ...(order                 !== undefined && { order }),
        // grid
        ...(gridTemplateColumns   !== undefined && { gridTemplateColumns }),
        ...(gridTemplateRows      !== undefined && { gridTemplateRows }),
        ...(gridTemplateAreas     !== undefined && { gridTemplateAreas }),
        ...(gridColumn            !== undefined && { gridColumn }),
        ...(gridRow               !== undefined && { gridRow }),
        ...(gridArea              !== undefined && { gridArea }),
        ...(gridAutoColumns       !== undefined && { gridAutoColumns }),
        ...(gridAutoRows          !== undefined && { gridAutoRows }),
        ...(gridAutoFlow          !== undefined && { gridAutoFlow }),
        // border
        ...(border                !== undefined && { border }),
        ...(borderStyle           !== undefined && { borderStyle }),
        ...(borderColor           !== undefined && { borderColor:              withPx(r(borderColor)) }),
        ...(borderWidth           !== undefined && { borderWidth:              `${borderWidth}px` }),
        ...(borderTop             !== undefined && { borderTop }),
        ...(borderRight           !== undefined && { borderRight }),
        ...(borderBottom          !== undefined && { borderBottom }),
        ...(borderLeft            !== undefined && { borderLeft }),
        ...(borderTopColor        !== undefined && { borderTopColor:           withPx(r(borderTopColor)) }),
        ...(borderRightColor      !== undefined && { borderRightColor:         withPx(r(borderRightColor)) }),
        ...(borderBottomColor     !== undefined && { borderBottomColor:        withPx(r(borderBottomColor)) }),
        ...(borderLeftColor       !== undefined && { borderLeftColor:          withPx(r(borderLeftColor)) }),
        ...(borderTopWidth        !== undefined && { borderTopWidth:           `${borderTopWidth}px` }),
        ...(borderRightWidth      !== undefined && { borderRightWidth:         `${borderRightWidth}px` }),
        ...(borderBottomWidth     !== undefined && { borderBottomWidth:        `${borderBottomWidth}px` }),
        ...(borderLeftWidth       !== undefined && { borderLeftWidth:          `${borderLeftWidth}px` }),
        ...(borderTopStyle        !== undefined && { borderTopStyle }),
        ...(borderRightStyle      !== undefined && { borderRightStyle }),
        ...(borderBottomStyle     !== undefined && { borderBottomStyle }),
        ...(borderLeftStyle       !== undefined && { borderLeftStyle }),
        ...(radius                !== undefined && { borderRadius:             withPx(r(radius)) }),
        ...(borderTopLeftRadius   !== undefined && { borderTopLeftRadius:      withPx(r(borderTopLeftRadius)) }),
        ...(borderTopRightRadius  !== undefined && { borderTopRightRadius:     withPx(r(borderTopRightRadius)) }),
        ...(borderBottomLeftRadius  !== undefined && { borderBottomLeftRadius:  withPx(r(borderBottomLeftRadius)) }),
        ...(borderBottomRightRadius !== undefined && { borderBottomRightRadius: withPx(r(borderBottomRightRadius)) }),
        // outline
        ...(outline               !== undefined && { outline }),
        ...(outlineColor          !== undefined && { outlineColor:             withPx(r(outlineColor)) }),
        ...(outlineWidth          !== undefined && { outlineWidth:             withPx(r(outlineWidth)) }),
        ...(outlineStyle          !== undefined && { outlineStyle }),
        ...(outlineOffset         !== undefined && { outlineOffset:            withPx(r(outlineOffset)) }),
        // effects
        ...(opacity               !== undefined && { opacity }),
        ...(boxShadow             !== undefined && { boxShadow }),
        ...(transform             !== undefined && { transform }),
        ...(filter                !== undefined && { filter }),
        ...(backdropFilter        !== undefined && { backdropFilter }),
        ...(mixBlendMode          !== undefined && { mixBlendMode }),
        // inset / overflow / position
        ...(inset                 !== undefined && { inset:                    withPx(r(inset)) }),
        ...(overflow              !== undefined && { overflow }),
        ...(overflowX             !== undefined && { overflowX }),
        ...(overflowY             !== undefined && { overflowY }),
        ...(position              !== undefined && { position }),
        ...(top                   !== undefined && { top:                      withPx(r(top)) }),
        ...(right                 !== undefined && { right:                    withPx(r(right)) }),
        ...(bottom                !== undefined && { bottom:                   withPx(r(bottom)) }),
        ...(left                  !== undefined && { left:                     withPx(r(left)) }),
        ...(zIndex                !== undefined && { zIndex }),
        // interaction
        ...(cursor                !== undefined && { cursor }),
        ...(pointerEvents         !== undefined && { pointerEvents }),
        ...(touchAction           !== undefined && { touchAction }),
        ...(userSelect            !== undefined && { userSelect }),
        ...(visibility            !== undefined && { visibility }),
        ...(boxSizing             !== undefined && { boxSizing }),
        ...(aspectRatio           !== undefined && { aspectRatio }),
        // transition
        ...(transition            !== undefined && { transition }),
        ...(transitionProperty    !== undefined && { transitionProperty }),
        ...(transitionDuration    !== undefined && { transitionDuration }),
        ...(transitionTimingFunction !== undefined && { transitionTimingFunction }),
        ...(transitionDelay       !== undefined && { transitionDelay }),
        // animation
        ...(animation             !== undefined && { animation }),
        ...(animationName         !== undefined && { animationName }),
        ...(animationDuration     !== undefined && { animationDuration }),
        ...(animationTimingFunction !== undefined && { animationTimingFunction }),
        ...(animationDelay        !== undefined && { animationDelay }),
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
    const r = (v: RV | undefined) => resolve(v, tokens, mode)

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
        ...(color                  !== undefined && { color:                  withPx(r(color)) }),
        ...(fontSize               !== undefined && { fontSize:               withPx(r(fontSize)) }),
        ...(fontWeight             !== undefined && { fontWeight:             asString(r(fontWeight)) }),
        ...(fontFamily             !== undefined && { fontFamily:             asString(r(fontFamily)) }),
        ...(fontStyle              !== undefined && { fontStyle }),
        ...(fontVariant            !== undefined && { fontVariant }),
        ...(fontStretch            !== undefined && { fontStretch }),
        ...(lineHeight             !== undefined && { lineHeight:             asString(r(lineHeight)) }),
        ...(letterSpacing          !== undefined && { letterSpacing:          withPx(r(letterSpacing)) }),
        ...(wordSpacing            !== undefined && { wordSpacing:            withPx(r(wordSpacing)) }),
        ...(textAlign              !== undefined && { textAlign }),
        ...(textTransform          !== undefined && { textTransform }),
        ...(textDecoration         !== undefined && { textDecoration }),
        ...(textDecorationColor    !== undefined && { textDecorationColor:    withPx(r(textDecorationColor)) }),
        ...(textDecorationStyle    !== undefined && { textDecorationStyle }),
        ...(textDecorationThickness !== undefined && { textDecorationThickness: withPx(r(textDecorationThickness)) }),
        ...(textUnderlineOffset    !== undefined && { textUnderlineOffset:    withPx(r(textUnderlineOffset)) }),
        ...(textOverflow           !== undefined && { textOverflow }),
        ...(textShadow             !== undefined && { textShadow }),
        ...(textIndent             !== undefined && { textIndent:             withPx(r(textIndent)) }),
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
