/**
 * String literal union types for every token category.
 *
 * The `(string & {})` suffix in each type keeps autocomplete for the known
 * literals while still accepting any string — so raw CSS values ('100%',
 * '#ff0000') and custom extended tokens both work without type errors.
 */

// ─── colour ───────────────────────────────────────────────────────────────────

type ColorScale = 'primary' | 'secondary' | 'neutral' | 'success' | 'error' | 'warning' | 'info'
type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

/** Primitive colour paths — e.g. 'color.primary.500', 'color.neutral.100' */
type ColorPrimitivePath = `color.${ColorScale}.${ColorShade}`

/** Semantic colour paths from the default token set */
type SemanticColorPath =
    | 'color.interactive.primary'
    | 'color.interactive.primary.hover'
    | 'color.interactive.secondary'
    | 'color.interactive.secondary.hover'
    | 'color.bg.surface'
    | 'color.bg.surface.hover'
    | 'color.bg.elevated'
    | 'color.bg.elevated.hover'
    | 'color.bg.overlay'
    | 'color.text.primary'
    | 'color.text.primary.hover'
    | 'color.text.secondary'
    | 'color.text.secondary.hover'
    | 'color.text.inverse'
    | 'color.border.default'
    | 'color.border.default.hover'
    | 'color.feedback.success'
    | 'color.feedback.error'
    | 'color.feedback.warning'
    | 'color.feedback.info'

/**
 * Any known colour token path — primitive or semantic — plus any string for
 * raw CSS values and custom extended tokens.
 *
 * @example 'color.primary.500'
 * @example 'color.bg.surface'
 * @example '#ff0000'
 */
export type ColorToken = ColorPrimitivePath | SemanticColorPath | (string & {})

// ─── space ────────────────────────────────────────────────────────────────────

/**
 * Known space token paths.
 *
 * @example 'space.4'  → 16px
 * @example 'space.md' → 16px
 */
export type SpaceToken =
    | 'space.0'
    | 'space.1'
    | 'space.2'
    | 'space.3'
    | 'space.4'
    | 'space.5'
    | 'space.6'
    | 'space.8'
    | 'space.10'
    | 'space.12'
    | 'space.16'
    | 'space.sm'
    | 'space.md'
    | 'space.lg'
    | 'space.xl'
    | (string & {})

// ─── radius ───────────────────────────────────────────────────────────────────

/**
 * Known radius token paths.
 *
 * @example 'radius.md' → 8px
 * @example 'radius.full' → 9999px
 */
export type RadiusToken =
    | 'radius.none'
    | 'radius.sm'
    | 'radius.md'
    | 'radius.lg'
    | 'radius.xl'
    | 'radius.full'
    | (string & {})

// ─── typography ───────────────────────────────────────────────────────────────

/**
 * Known fontSize token paths.
 *
 * @example 'fontSize.lg' → 20px
 */
export type FontSizeToken =
    | 'fontSize.xs'
    | 'fontSize.sm'
    | 'fontSize.md'
    | 'fontSize.lg'
    | 'fontSize.xl'
    | 'fontSize.2xl'
    | 'fontSize.3xl'
    | (string & {})

/**
 * Known fontWeight token paths.
 *
 * @example 'fontWeight.bold' → 700
 */
export type FontWeightToken =
    | 'fontWeight.normal'
    | 'fontWeight.medium'
    | 'fontWeight.semibold'
    | 'fontWeight.bold'
    | (string & {})

/**
 * Known lineHeight token paths.
 *
 * @example 'lineHeight.normal' → 1.5
 */
export type LineHeightToken =
    | 'lineHeight.tight'
    | 'lineHeight.normal'
    | 'lineHeight.relaxed'
    | (string & {})

/**
 * Known letterSpacing token paths.
 *
 * @example 'letterSpacing.wide' → 0.5px
 */
export type LetterSpacingToken =
    | 'letterSpacing.tight'
    | 'letterSpacing.normal'
    | 'letterSpacing.wide'
    | 'letterSpacing.wider'
    | (string & {})

/**
 * Known fontFamily token paths.
 *
 * @example 'fontFamily.sans'
 * @example 'fontFamily.mono'
 */
export type FontFamilyToken =
    | 'fontFamily.sans'
    | 'fontFamily.mono'
    | (string & {})
