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

    const css = styleObjectToCss(styles)
    if (!css) return

    const id = `${className}:${pseudo}`
    const rule = `.${className}:${pseudoSelector(pseudo)} { ${css} }`
    const existing = document.head.querySelector(`[${ATTR}="${id}"]`)

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
 * Each named breakpoint (sm/md/lg/xl) becomes an `@media (min-width: X)` block.
 * Idempotent — re-render with the same className is a no-op.
 * SSR safe.
 *
 * @param className       Scoped class name applied to the element
 * @param bpStyles        Map of breakpoint name → resolved CSS-property object
 * @param breakpoints     Token breakpoints map e.g. { sm: '576px', md: '768px', ... }
 */
export function injectResponsiveStyles(
    className: string,
    bpStyles: Partial<Record<string, Record<string, string | number | undefined>>>,
    breakpoints: Record<string, string>,
): void {
    if (typeof document === 'undefined') return

    const rules: string[] = []
    for (const [bp, minWidth] of Object.entries(breakpoints)) {
        const styles = bpStyles[bp]
        if (!styles) continue
        const css = styleObjectToCss(styles)
        if (!css) continue
        rules.push(`@media (min-width: ${minWidth}) { .${className} { ${css} } }`)
    }

    if (rules.length === 0) return

    const content = rules.join('\n')
    const existing = document.head.querySelector(`[${RESPONSIVE_ATTR}="${className}"]`)

    if (existing) {
        if (existing.textContent !== content) existing.textContent = content
        return
    }

    const tag = document.createElement('style')
    tag.setAttribute(RESPONSIVE_ATTR, className)
    tag.textContent = content
    document.head.appendChild(tag)
}
