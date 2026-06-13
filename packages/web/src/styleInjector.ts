/**
 * Style injector for pseudo-class rules.
 *
 * Injects <style> tags into document.head for :hover, :focus, :active,
 * :focus-visible, and :disabled rules.
 *
 * Injection is idempotent — calling it multiple times with the same class name
 * and pseudo is safe. Tags are keyed by [data-bb] attribute so duplicates are
 * never created. Style tags are not cleaned up on unmount (they are tiny,
 * uniquely scoped, and cause no correctness issues — same approach as
 * styled-components and emotion).
 *
 * SSR safe — all DOM operations are guarded by typeof document checks.
 */

const ATTR = 'data-bb'
const RESPONSIVE_ATTR = 'data-bb-responsive'

/**
 * Ids already injected this page-load. Class names are content-addressed
 * (hash of resolved styles + mode), so once an id is written its rule never
 * changes — re-renders can skip the DOM entirely.
 */
const _injected = new Set<string>()

/** Test-only: forget what has been injected (pair with clearing head tags). */
export function __resetStyleInjectorCache(): void {
    _injected.clear()
}

/**
 * JSON.stringify with object keys sorted (two levels deep) — so responsive
 * objects written in different key order hash to the same class name.
 */
export function stableStringify(obj: Record<string, unknown>): string {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(obj).sort()) {
        const value = obj[key]
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            const inner: Record<string, unknown> = {}
            for (const k of Object.keys(value as object).sort()) {
                inner[k] = (value as Record<string, unknown>)[k]
            }
            sorted[key] = inner
        } else {
            sorted[key] = value
        }
    }
    return JSON.stringify(sorted)
}

/** camelCase → kebab-case, e.g. backgroundColor → background-color */
function toKebab(prop: string): string {
    return prop.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/** Convert a resolved style object to a CSS rule body string */
function styleObjectToCss(styles: Record<string, string | number | undefined>): string {
    return Object.entries(styles)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${toKebab(k)}: ${v};`)
        .join(' ')
}

/** The CSS pseudo-class selector string for a given pseudo key */
function pseudoSelector(pseudo: string): string {
    if (pseudo === 'focusVisible') return 'focus-visible'
    return pseudo
}

/**
 * Inject a single pseudo-class rule for a class name.
 * Idempotent — if a tag already exists for this class+pseudo, updates it
 * in place only if the content changed (e.g. on dark mode switch).
 */
export function injectPseudoRule(
    className: string,
    pseudo: string,
    styles: Record<string, string | number | undefined>,
): void {
    if (typeof document === 'undefined') return

    const id = `${className}:${pseudo}`
    if (_injected.has(id)) return

    const css = styleObjectToCss(styles)
    if (!css) return

    const rule = `.${className}:${pseudoSelector(pseudo)} { ${css} }`
    // One DOM read per unique id total (covers SSR-rendered or pre-existing tags)
    const existing = document.head.querySelector(`[${ATTR}="${id}"]`)
    _injected.add(id)

    if (existing) {
        if (existing.textContent !== rule) existing.textContent = rule
        return
    }

    const tag = document.createElement('style')
    tag.setAttribute(ATTR, id)
    tag.textContent = rule
    document.head.appendChild(tag)
}

/**
 * Inject all pseudo rules for a component.
 * Call directly during render — no useEffect needed.
 */
export function injectPseudoStyles(
    className: string,
    pseudoStyles: Record<string, Record<string, string | number | undefined>>,
): void {
    for (const [pseudo, styles] of Object.entries(pseudoStyles)) {
        injectPseudoRule(className, pseudo, styles)
    }
}

/**
 * Inject media-query rules for responsive token props.
 *
 * Generates one <style> tag per className (keyed by [data-bb-responsive]).
 * The `base` entry (if present) becomes an unwrapped `.className { … }` rule;
 * each named breakpoint (sm/md/lg/xl) becomes an `@media (min-width: X)` block.
 *
 * The base value MUST be emitted as a class rule here rather than as an inline
 * style on the element: inline styles outrank any `@media` rule in the cascade,
 * so a base applied inline would suppress every breakpoint override. Keeping
 * base and the breakpoints at the same (class) specificity lets the natural
 * source-order cascade — base first, then ascending min-width — pick the winner.
 *
 * Idempotent — re-render with the same className is a no-op. SSR safe.
 *
 * @param className       Scoped class name applied to the element
 * @param bpStyles        Map of breakpoint name (incl. 'base') → resolved CSS object
 * @param breakpoints     Token breakpoints map e.g. { sm: '576px', md: '768px', ... }
 */
export function injectResponsiveStyles(
    className: string,
    bpStyles: Partial<Record<string, Record<string, string | number | undefined>>>,
    breakpoints: Record<string, string>,
): void {
    if (typeof document === 'undefined') return

    const id = `resp:${className}`
    if (_injected.has(id)) return

    const rules: string[] = []

    // Base rule first (no media) so the ascending media rules below override it.
    const baseStyles = bpStyles.base
    if (baseStyles) {
        const css = styleObjectToCss(baseStyles)
        if (css) rules.push(`.${className} { ${css} }`)
    }

    // Media rules in ascending min-width order so larger breakpoints win,
    // independent of the breakpoints map's key insertion order.
    const ordered = Object.entries(breakpoints)
        .map(([bp, minWidth]) => ({ bp, minWidth, px: parseInt(minWidth, 10) }))
        .sort((a, b) => a.px - b.px)
    for (const { bp, minWidth } of ordered) {
        const styles = bpStyles[bp]
        if (!styles) continue
        const css = styleObjectToCss(styles)
        if (!css) continue
        rules.push(`@media (min-width: ${minWidth}) { .${className} { ${css} } }`)
    }

    if (rules.length === 0) return

    const content = rules.join('\n')
    // One DOM read per unique className total
    const existing = document.head.querySelector(`[${RESPONSIVE_ATTR}="${className}"]`)
    _injected.add(id)

    if (existing) {
        if (existing.textContent !== content) existing.textContent = content
        return
    }

    const tag = document.createElement('style')
    tag.setAttribute(RESPONSIVE_ATTR, className)
    tag.textContent = content
    document.head.appendChild(tag)
}
