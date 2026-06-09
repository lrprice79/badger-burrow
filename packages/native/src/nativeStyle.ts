/**
 * Native style sanitizer.
 *
 * Core's buildBoxStyles / buildTextStyles emit *web-shaped* CSS:
 *   - dimensional values as 'px' strings ('16px', '20px')
 *   - web-only keys (cursor, filter, transition, outline, grid, boxShadow…)
 *   - lineHeight as a unitless string ('1.5')
 *   - lineClamp/truncate as -webkit-box / overflow / textOverflow
 *
 * React Native needs raw numbers, a restricted key set, and handles line
 * clamping via the `numberOfLines` *prop* (not a style). This module converts
 * the web-shaped output into a valid RN ViewStyle / TextStyle and extracts the
 * line count, so the leaks never reach a real native View/Text.
 */

// ─── valid RN style keys ──────────────────────────────────────────────────────

/** Keys valid on a React Native ViewStyle (the subset BadgerBurrow can emit). */
const VIEW_STYLE_KEYS: ReadonlySet<string> = new Set([
    // background / effects
    'backgroundColor', 'opacity',
    // padding
    'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    'paddingHorizontal', 'paddingVertical', 'paddingStart', 'paddingEnd',
    // margin
    'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'marginHorizontal', 'marginVertical', 'marginStart', 'marginEnd',
    // size
    'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
    // flex / layout
    'display', 'flex', 'flexDirection', 'flexGrow', 'flexShrink', 'flexBasis',
    'alignItems', 'alignSelf', 'alignContent', 'justifyContent', 'flexWrap',
    'gap', 'columnGap', 'rowGap',
    // border
    'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
    'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'borderStyle',
    'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius',
    'borderBottomLeftRadius', 'borderBottomRightRadius',
    // position
    'position', 'top', 'right', 'bottom', 'left', 'zIndex',
    // misc view
    'transform', 'aspectRatio', 'pointerEvents', 'overflow', 'backfaceVisibility',
    // native shadow (spread separately, but allowed here too)
    'elevation', 'shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius',
])

/** Keys valid on a React Native TextStyle — ViewStyle plus text-specific. */
const TEXT_STYLE_KEYS: ReadonlySet<string> = new Set([
    ...VIEW_STYLE_KEYS,
    'color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'fontVariant',
    'letterSpacing', 'lineHeight',
    'textAlign', 'textAlignVertical', 'verticalAlign',
    'textDecorationLine', 'textDecorationStyle', 'textDecorationColor',
    'textShadowColor', 'textShadowOffset', 'textShadowRadius',
    'textTransform', 'writingDirection', 'userSelect', 'includeFontPadding',
])

/** Valid values for RN `display`. */
const VALID_DISPLAY: ReadonlySet<string> = new Set(['flex', 'none', 'contents'])

// ─── value conversion ─────────────────────────────────────────────────────────

const PX_RE = /^-?\d*\.?\d+px$/
const NUM_RE = /^-?\d*\.?\d+$/

/**
 * Convert a single style value from web shape to native shape.
 *   '16px' → 16        (strip px unit)
 *   '1.5'  → 1.5       (pure numeric string → number)
 *   '100%' → '100%'    (percentage kept)
 *   'red'  → 'red'     (non-numeric kept)
 */
function toNativeValue(value: string | number): string | number {
    if (typeof value === 'number') return value
    if (PX_RE.test(value)) return Number(value.slice(0, -2))
    if (NUM_RE.test(value)) return Number(value)
    return value
}

// ─── public API ───────────────────────────────────────────────────────────────

export interface SanitizeOptions {
    /** Sanitize against the TextStyle whitelist (keeps font props). */
    text?: boolean
}

/**
 * Strip web-only keys and convert web-shaped values to valid React Native
 * style values.
 *
 * @example
 * sanitizeNativeStyle({ padding: '16px', boxShadow: '...', cursor: 'pointer' })
 * // → { padding: 16 }   (px stripped, web-only keys removed)
 */
export function sanitizeNativeStyle(
    style: Record<string, string | number | undefined>,
    opts: SanitizeOptions = {},
): Record<string, string | number> {
    const allowed = opts.text ? TEXT_STYLE_KEYS : VIEW_STYLE_KEYS
    const out: Record<string, string | number> = {}

    for (const [key, raw] of Object.entries(style)) {
        if (raw === undefined) continue
        if (!allowed.has(key)) continue

        const value = toNativeValue(raw)

        // display only accepts flex | none | contents in RN — drop -webkit-box etc.
        if (key === 'display' && (typeof value !== 'string' || !VALID_DISPLAY.has(value))) {
            continue
        }

        out[key] = value
    }

    // Resolve a unitless lineHeight multiplier (e.g. 1.5) against fontSize so RN
    // gets an absolute pixel value rather than a ~1px line height.
    if (
        opts.text &&
        typeof out.lineHeight === 'number' &&
        out.lineHeight > 0 &&
        out.lineHeight < 4 &&
        typeof out.fontSize === 'number'
    ) {
        out.lineHeight = Math.round(out.lineHeight * out.fontSize)
    }

    return out
}

/**
 * Derive the React Native `numberOfLines` prop value from truncation props.
 * Native truncation is a Text prop, not a style.
 *
 *   truncate     → 1 line
 *   lineClamp=n  → n lines
 *   (truncate wins if both are set)
 */
export function nativeLineCount(props: {
    truncate?: boolean
    lineClamp?: number
}): number | undefined {
    if (props.truncate) return 1
    if (typeof props.lineClamp === 'number') return props.lineClamp
    return undefined
}
