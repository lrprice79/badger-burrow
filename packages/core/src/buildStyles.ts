import type { BurrowTokens } from '@badger-burrow/tokens'
import { resolveScoped } from './resolver'
import type { ColorMode } from './resolver'
import type { BurrowBoxProps, BurrowTextProps } from './props'
import { resolveDuration, resolveEasing, resolveTransition } from './motion'

/**
 * Table-driven style builder.
 *
 * Both build functions iterate ONLY the props actually passed (typically 3–6)
 * against a module-level lookup table, instead of evaluating ~110 conditional
 * spreads per render. Entries carry a fixed priority index so precedence is
 * deterministic regardless of JSX attribute order:
 *
 *   - boolean helpers (italic/truncate/nowrap/lineClamp) have the lowest
 *     priority — explicit props always override them per-field
 *   - shorthands come before longhands (px before pl → pl wins)
 *   - text entries come before box entries (box overrides on shared CSS keys)
 */

// ─── value resolvers (module-level — created once, never per render) ──────────

type Ctx = { tokens: BurrowTokens; mode: ColorMode }

/**
 * Resolve a short-form token value within a category. The prop's category is
 * baked into the table entry, so the value omits the redundant prefix —
 * `p="4"` resolves `space.4`. Responsive objects are resolved before
 * buildStyles runs; a stray one is ignored gracefully. Numbers are raw values.
 * Unresolvable strings (raw CSS) pass through.
 */
function resolveIn(
    category: string,
    value: unknown,
    ctx: Ctx,
): string | number | undefined {
    if (typeof value === 'object') return undefined
    if (typeof value === 'number') return value
    return resolveScoped(category, value as string, ctx.tokens, ctx.mode)
}

function withPx(value: string | number | undefined): string | undefined {
    if (value === undefined) return undefined
    return typeof value === 'number' ? `${value}px` : value
}

function asString(value: string | number | undefined): string | undefined {
    if (value === undefined) return undefined
    return String(value)
}

type Resolver = (v: unknown, ctx: Ctx) => string | number | undefined

/** Pass the value through untouched (plain CSS props). */
const pass: Resolver = (v) => v as string | number

/** Enum-style props that may carry an unresolved responsive object — drop it. */
const flatPass: Resolver = (v) => (typeof v === 'object' ? undefined : (v as string | number))

const spacePx: Resolver  = (v, c) => withPx(resolveIn('space', v, c))
const colorVal: Resolver = (v, c) => withPx(resolveIn('color', v, c))
const radiusPx: Resolver = (v, c) => withPx(resolveIn('radius', v, c))
const fontSizePx: Resolver       = (v, c) => withPx(resolveIn('fontSize', v, c))
const fontWeightStr: Resolver    = (v, c) => asString(resolveIn('fontWeight', v, c))
const lineHeightStr: Resolver    = (v, c) => asString(resolveIn('lineHeight', v, c))
const letterSpacingPx: Resolver  = (v, c) => withPx(resolveIn('letterSpacing', v, c))
const fontFamilyStr: Resolver    = (v, c) => asString(resolveIn('fontFamily', v, c))

/** Literal-px props (borderWidth etc — numbers only by type). */
const pxLiteral: Resolver = (v) => `${v as number}px`

const motionTransition: Resolver = (v, c) => resolveTransition(v as string, c.tokens)
const motionDuration: Resolver   = (v, c) => resolveDuration(v as string | number, c.tokens)
const motionEasing: Resolver     = (v, c) => resolveEasing(v as string, c.tokens)

/** shadow token key → web box-shadow string (guarded — unknown key emits nothing). */
const shadowWeb: Resolver = (v, c) => c.tokens.primitive.shadow[v as string]?.web

// ─── lookup table ─────────────────────────────────────────────────────────────

interface Entry {
    /** CSS output key(s) — px/py/mx/my write two */
    out: string[]
    fn: Resolver
    /** Fixed application order — lower applies first, later entries override */
    pri: number
    /** Boolean helpers that expand to multiple fixed declarations */
    multi?: (v: unknown) => Record<string, string | number> | undefined
}

type Table = Map<string, Entry>

let _pri = 0
function addEntry(
    table: Table,
    key: string,
    out: string | string[],
    fn: Resolver = pass,
    multi?: Entry['multi'],
): void {
    table.set(key, { out: Array.isArray(out) ? out : [out], fn, pri: _pri++, multi })
}

/** Text/font entries — shared by Tunnel and Chamber (Chamber carries font props). */
const TEXT_TABLE: Table = new Map()
{
    const t = TEXT_TABLE
    // Boolean helpers FIRST (lowest priority) so explicit props override per-field.
    addEntry(t, 'italic', [], pass, (v) => (v === true ? { fontStyle: 'italic' } : undefined))
    addEntry(t, 'truncate', [], pass, (v) =>
        v === true ? { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } : undefined)
    addEntry(t, 'nowrap', [], pass, (v) => (v === true ? { whiteSpace: 'nowrap' } : undefined))
    addEntry(t, 'lineClamp', [], pass, (v) =>
        v !== undefined
            ? { display: '-webkit-box', WebkitLineClamp: v as number, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
            : undefined)
    // font
    addEntry(t, 'color', 'color', colorVal)
    addEntry(t, 'fontSize', 'fontSize', fontSizePx)
    addEntry(t, 'fontWeight', 'fontWeight', fontWeightStr)
    addEntry(t, 'fontFamily', 'fontFamily', fontFamilyStr)
    addEntry(t, 'fontStyle', 'fontStyle')
    addEntry(t, 'fontVariant', 'fontVariant')
    addEntry(t, 'fontStretch', 'fontStretch')
    addEntry(t, 'lineHeight', 'lineHeight', lineHeightStr)
    addEntry(t, 'letterSpacing', 'letterSpacing', letterSpacingPx)
    addEntry(t, 'wordSpacing', 'wordSpacing', spacePx)
    // text layout
    addEntry(t, 'textAlign', 'textAlign')
    addEntry(t, 'textTransform', 'textTransform')
    addEntry(t, 'textDecoration', 'textDecoration')
    addEntry(t, 'textDecorationColor', 'textDecorationColor', colorVal)
    addEntry(t, 'textDecorationStyle', 'textDecorationStyle')
    addEntry(t, 'textDecorationThickness', 'textDecorationThickness', spacePx)
    addEntry(t, 'textUnderlineOffset', 'textUnderlineOffset', spacePx)
    addEntry(t, 'textOverflow', 'textOverflow')
    addEntry(t, 'textShadow', 'textShadow')
    addEntry(t, 'textIndent', 'textIndent', spacePx)
    addEntry(t, 'textWrap', 'textWrap')
    addEntry(t, 'whiteSpace', 'whiteSpace')
    addEntry(t, 'overflow', 'overflow')
    addEntry(t, 'wordBreak', 'wordBreak')
    addEntry(t, 'overflowWrap', 'overflowWrap')
    addEntry(t, 'verticalAlign', 'verticalAlign')
    addEntry(t, 'userSelect', 'userSelect')
}

/** Box entries — everything Chamber accepts. Includes all text entries (Chamber
 * carries font props); box-specific entries are added after so they override
 * text entries on shared CSS keys, mirroring the previous spread order. */
const BOX_TABLE: Table = new Map(TEXT_TABLE)
{
    const t = BOX_TABLE
    // background
    addEntry(t, 'bg', 'backgroundColor', colorVal)
    addEntry(t, 'backgroundImage', 'backgroundImage')
    addEntry(t, 'backgroundSize', 'backgroundSize')
    addEntry(t, 'backgroundPosition', 'backgroundPosition')
    addEntry(t, 'backgroundRepeat', 'backgroundRepeat')
    addEntry(t, 'backgroundAttachment', 'backgroundAttachment')
    addEntry(t, 'backgroundClip', 'backgroundClip')
    addEntry(t, 'backgroundOrigin', 'backgroundOrigin')
    addEntry(t, 'backgroundBlendMode', 'backgroundBlendMode')
    // padding — shorthands before longhands so longhands win
    addEntry(t, 'p', 'padding', spacePx)
    addEntry(t, 'px', ['paddingLeft', 'paddingRight'], spacePx)
    addEntry(t, 'py', ['paddingTop', 'paddingBottom'], spacePx)
    addEntry(t, 'pt', 'paddingTop', spacePx)
    addEntry(t, 'pb', 'paddingBottom', spacePx)
    addEntry(t, 'pl', 'paddingLeft', spacePx)
    addEntry(t, 'pr', 'paddingRight', spacePx)
    // margin
    addEntry(t, 'm', 'margin', spacePx)
    addEntry(t, 'mx', ['marginLeft', 'marginRight'], spacePx)
    addEntry(t, 'my', ['marginTop', 'marginBottom'], spacePx)
    addEntry(t, 'mt', 'marginTop', spacePx)
    addEntry(t, 'mb', 'marginBottom', spacePx)
    addEntry(t, 'ml', 'marginLeft', spacePx)
    addEntry(t, 'mr', 'marginRight', spacePx)
    // dimensions
    addEntry(t, 'w', 'width', spacePx)
    addEntry(t, 'h', 'height', spacePx)
    addEntry(t, 'minW', 'minWidth', spacePx)
    addEntry(t, 'maxW', 'maxWidth', spacePx)
    addEntry(t, 'minH', 'minHeight', spacePx)
    addEntry(t, 'maxH', 'maxHeight', spacePx)
    // flex / layout — enum props use flatPass (drop stray responsive objects)
    addEntry(t, 'display', 'display', flatPass)
    addEntry(t, 'flex', 'flex')
    addEntry(t, 'flexDir', 'flexDirection', flatPass)
    addEntry(t, 'flexGrow', 'flexGrow')
    addEntry(t, 'flexShrink', 'flexShrink')
    addEntry(t, 'flexBasis', 'flexBasis', spacePx)
    addEntry(t, 'align', 'alignItems', flatPass)
    addEntry(t, 'alignSelf', 'alignSelf', flatPass)
    addEntry(t, 'alignContent', 'alignContent', flatPass)
    addEntry(t, 'justify', 'justifyContent', flatPass)
    addEntry(t, 'justifySelf', 'justifySelf', flatPass)
    addEntry(t, 'wrap', 'flexWrap', flatPass)
    addEntry(t, 'gap', 'gap', spacePx)
    addEntry(t, 'columnGap', 'columnGap', spacePx)
    addEntry(t, 'rowGap', 'rowGap', spacePx)
    addEntry(t, 'order', 'order')
    // grid
    addEntry(t, 'gridTemplateColumns', 'gridTemplateColumns', flatPass)
    addEntry(t, 'gridTemplateRows', 'gridTemplateRows', flatPass)
    addEntry(t, 'gridTemplateAreas', 'gridTemplateAreas', flatPass)
    addEntry(t, 'gridColumn', 'gridColumn', flatPass)
    addEntry(t, 'gridRow', 'gridRow', flatPass)
    addEntry(t, 'gridArea', 'gridArea', flatPass)
    addEntry(t, 'gridAutoColumns', 'gridAutoColumns', flatPass)
    addEntry(t, 'gridAutoRows', 'gridAutoRows', flatPass)
    addEntry(t, 'gridAutoFlow', 'gridAutoFlow', flatPass)
    // border
    addEntry(t, 'border', 'border')
    addEntry(t, 'borderStyle', 'borderStyle')
    addEntry(t, 'borderColor', 'borderColor', colorVal)
    addEntry(t, 'borderWidth', 'borderWidth', pxLiteral)
    addEntry(t, 'borderTop', 'borderTop')
    addEntry(t, 'borderRight', 'borderRight')
    addEntry(t, 'borderBottom', 'borderBottom')
    addEntry(t, 'borderLeft', 'borderLeft')
    addEntry(t, 'borderTopColor', 'borderTopColor', colorVal)
    addEntry(t, 'borderRightColor', 'borderRightColor', colorVal)
    addEntry(t, 'borderBottomColor', 'borderBottomColor', colorVal)
    addEntry(t, 'borderLeftColor', 'borderLeftColor', colorVal)
    addEntry(t, 'borderTopWidth', 'borderTopWidth', pxLiteral)
    addEntry(t, 'borderRightWidth', 'borderRightWidth', pxLiteral)
    addEntry(t, 'borderBottomWidth', 'borderBottomWidth', pxLiteral)
    addEntry(t, 'borderLeftWidth', 'borderLeftWidth', pxLiteral)
    addEntry(t, 'borderTopStyle', 'borderTopStyle')
    addEntry(t, 'borderRightStyle', 'borderRightStyle')
    addEntry(t, 'borderBottomStyle', 'borderBottomStyle')
    addEntry(t, 'borderLeftStyle', 'borderLeftStyle')
    addEntry(t, 'radius', 'borderRadius', radiusPx)
    addEntry(t, 'borderTopLeftRadius', 'borderTopLeftRadius', radiusPx)
    addEntry(t, 'borderTopRightRadius', 'borderTopRightRadius', radiusPx)
    addEntry(t, 'borderBottomLeftRadius', 'borderBottomLeftRadius', radiusPx)
    addEntry(t, 'borderBottomRightRadius', 'borderBottomRightRadius', radiusPx)
    // outline
    addEntry(t, 'outline', 'outline')
    addEntry(t, 'outlineColor', 'outlineColor', colorVal)
    addEntry(t, 'outlineWidth', 'outlineWidth', spacePx)
    addEntry(t, 'outlineStyle', 'outlineStyle')
    addEntry(t, 'outlineOffset', 'outlineOffset', spacePx)
    // effects
    addEntry(t, 'opacity', 'opacity')
    addEntry(t, 'shadow', 'boxShadow', shadowWeb)
    addEntry(t, 'transform', 'transform')
    addEntry(t, 'filter', 'filter')
    addEntry(t, 'backdropFilter', 'backdropFilter')
    addEntry(t, 'mixBlendMode', 'mixBlendMode')
    // inset / overflow / position
    addEntry(t, 'inset', 'inset', spacePx)
    addEntry(t, 'overflow', 'overflow')                       // overrides the text entry
    addEntry(t, 'overflowX', 'overflowX')
    addEntry(t, 'overflowY', 'overflowY')
    addEntry(t, 'position', 'position')
    addEntry(t, 'top', 'top', spacePx)
    addEntry(t, 'right', 'right', spacePx)
    addEntry(t, 'bottom', 'bottom', spacePx)
    addEntry(t, 'left', 'left', spacePx)
    addEntry(t, 'zIndex', 'zIndex')
    // interaction
    addEntry(t, 'cursor', 'cursor')
    addEntry(t, 'pointerEvents', 'pointerEvents')
    addEntry(t, 'touchAction', 'touchAction')
    addEntry(t, 'userSelect', 'userSelect')                   // overrides the text entry
    addEntry(t, 'visibility', 'visibility')
    addEntry(t, 'boxSizing', 'boxSizing')
    addEntry(t, 'aspectRatio', 'aspectRatio')
    // transition — motion token keywords resolve, raw CSS passes through
    addEntry(t, 'transition', 'transition', motionTransition)
    addEntry(t, 'transitionProperty', 'transitionProperty')
    addEntry(t, 'transitionDuration', 'transitionDuration', motionDuration)
    addEntry(t, 'transitionTimingFunction', 'transitionTimingFunction', motionEasing)
    addEntry(t, 'transitionDelay', 'transitionDelay', motionDuration)
    // animation
    addEntry(t, 'animation', 'animation')
    addEntry(t, 'animationName', 'animationName')
    addEntry(t, 'animationDuration', 'animationDuration', motionDuration)
    addEntry(t, 'animationTimingFunction', 'animationTimingFunction', motionEasing)
    addEntry(t, 'animationDelay', 'animationDelay', motionDuration)
    addEntry(t, 'animationIterationCount', 'animationIterationCount')
    addEntry(t, 'animationDirection', 'animationDirection')
    addEntry(t, 'animationFillMode', 'animationFillMode')
    addEntry(t, 'animationPlayState', 'animationPlayState')
    // scroll
    addEntry(t, 'scrollSnapType', 'scrollSnapType')
    addEntry(t, 'scrollSnapAlign', 'scrollSnapAlign')
    addEntry(t, 'overscrollBehavior', 'overscrollBehavior')
    addEntry(t, 'overscrollBehaviorX', 'overscrollBehaviorX')
    addEntry(t, 'overscrollBehaviorY', 'overscrollBehaviorY')
    addEntry(t, 'scrollBehavior', 'scrollBehavior')
}

// ─── builder ──────────────────────────────────────────────────────────────────

interface Pending { entry: Entry; value: unknown }

/**
 * Apply the props present against the table, in fixed priority order.
 * O(props passed) — props without a table entry (sx, _hover, hoverScale, …)
 * are skipped.
 */
function applyTable(
    table: Table,
    props: Record<string, unknown>,
    ctx: Ctx,
): Record<string, string | number | undefined> {
    // Collect entries for the props that are actually present
    const pending: Pending[] = []
    for (const key in props) {
        const value = props[key]
        if (value === undefined) continue
        const entry = table.get(key)
        if (entry) pending.push({ entry, value })
    }

    // Fixed priority order, independent of JSX attribute order
    if (pending.length > 1) pending.sort((a, b) => a.entry.pri - b.entry.pri)

    const result: Record<string, string | number | undefined> = {}
    for (const { entry, value } of pending) {
        if (entry.multi) {
            const expanded = entry.multi(value)
            if (expanded) Object.assign(result, expanded)
            continue
        }
        const resolved = entry.fn(value, ctx)
        if (resolved === undefined) continue
        for (const cssKey of entry.out) result[cssKey] = resolved
    }
    return result
}

/** Build the resolved style object for box (Chamber) props. */
export function buildBoxStyles(
    props: BurrowBoxProps,
    tokens: BurrowTokens,
    mode: ColorMode
): Record<string, string | number | undefined> {
    return applyTable(BOX_TABLE, props as Record<string, unknown>, { tokens, mode })
}

/** Build the resolved style object for text (Tunnel) props. */
export function buildTextStyles(
    props: BurrowTextProps,
    tokens: BurrowTokens,
    mode: ColorMode
): Record<string, string | number | undefined> {
    return applyTable(TEXT_TABLE, props as Record<string, unknown>, { tokens, mode })
}
