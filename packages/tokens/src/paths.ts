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

/**
 * Short-form token values. The prop name supplies the category, so the value
 * omits the redundant prefix — `color="text.primary"`, `p="4"`, `fontSize="md"`.
 * Each type stays open (`string & {}`) so raw CSS (`#fff`, `100%`) and custom
 * extended tokens still type-check.
 */

/** Primitive colour values — e.g. 'primary.500', 'neutral.100' */
type ColorPrimitivePath = `${ColorScale}.${ColorShade}`

/** Semantic colour values from the default token set */
type SemanticColorPath =
    | 'interactive.primary'
    | 'interactive.primary.hover'
    | 'interactive.secondary'
    | 'interactive.secondary.hover'
    | 'bg.surface'
    | 'bg.surface.hover'
    | 'bg.elevated'
    | 'bg.elevated.hover'
    | 'bg.overlay'
    | 'text.primary'
    | 'text.primary.hover'
    | 'text.secondary'
    | 'text.secondary.hover'
    | 'text.inverse'
    | 'border.default'
    | 'border.default.hover'
    | 'feedback.success'
    | 'feedback.error'
    | 'feedback.warning'
    | 'feedback.info'

/**
 * Any known colour token — primitive or semantic — plus any string for raw CSS
 * values and custom extended tokens. No `color.` prefix — the prop implies it.
 *
 * @example 'primary.500'
 * @example 'bg.surface'
 * @example '#ff0000'
 */
export type ColorToken = ColorPrimitivePath | SemanticColorPath | (string & {})

// ─── space ────────────────────────────────────────────────────────────────────

/**
 * Known space token values (no `space.` prefix).
 *
 * @example '4'  → 16px
 * @example 'md' → 16px
 */
export type SpaceToken =
    | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16'
    | 'sm' | 'md' | 'lg' | 'xl'
    | (string & {})

// ─── radius ───────────────────────────────────────────────────────────────────

/**
 * Known radius token values (no `radius.` prefix).
 *
 * @example 'md' → 8px
 * @example 'full' → 9999px
 */
export type RadiusToken =
    | 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    | (string & {})

// ─── typography ───────────────────────────────────────────────────────────────

/**
 * Known fontSize token values (no `fontSize.` prefix).
 *
 * @example 'lg' → 20px
 */
export type FontSizeToken =
    | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    | (string & {})

/**
 * Known fontWeight token values (no `fontWeight.` prefix).
 *
 * @example 'bold' → 700
 */
export type FontWeightToken =
    | 'normal' | 'medium' | 'semibold' | 'bold'
    | (string & {})

/**
 * Known lineHeight token values (no `lineHeight.` prefix).
 *
 * @example 'normal' → 1.5
 */
export type LineHeightToken =
    | 'tight' | 'normal' | 'relaxed'
    | (string & {})

/**
 * Known letterSpacing token values (no `letterSpacing.` prefix).
 *
 * @example 'wide' → 0.5px
 */
export type LetterSpacingToken =
    | 'tight' | 'normal' | 'wide' | 'wider'
    | (string & {})

/**
 * Known fontFamily token values (no `fontFamily.` prefix).
 *
 * @example 'sans'
 * @example 'mono'
 */
export type FontFamilyToken =
    | 'sans' | 'mono'
    | (string & {})

// ─── motion ───────────────────────────────────────────────────────────────────

/**
 * Known motion duration keys. Used by `transition`, `transitionDuration`,
 * `animationDuration`, `transitionDelay`, `animationDelay`.
 *
 * @example 'fast'  → 150ms
 */
export type DurationToken =
    | 'instant'
    | 'fast'
    | 'normal'
    | 'slow'
    | 'glacial'
    | (string & {})

/**
 * Known easing keys. Used by `transitionTimingFunction` / `animationTimingFunction`.
 *
 * @example 'standard' → cubic-bezier(0.4, 0, 0.2, 1)
 */
export type EasingToken =
    | 'standard'
    | 'decelerate'
    | 'accelerate'
    | 'sharp'
    | (string & {})
