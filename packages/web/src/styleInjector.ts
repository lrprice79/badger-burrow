/**
 * Style injector for pseudo-class rules.
 *
 * Injects <style> tags into document.head for :hover, :focus, :active,
 * :focus-visible, and :disabled rules. Deduplicates by class name + pseudo
 * combo using reference counting — a style tag is only removed when the last
 * component using it unmounts.
 *
 * SSR safe — all DOM operations are guarded by typeof document checks.
 */

const ATTR = 'data-bb'

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

/** Map of "className:pseudo" → ref count */
const refCounts = new Map<string, number>()

/** The CSS pseudo-class string for a given pseudo key */
function pseudoSelector(pseudo: string): string {
    if (pseudo === 'focusVisible') return 'focus-visible'
    return pseudo
}

/** data-bb attribute value for a given className + pseudo */
function tagId(className: string, pseudo: string): string {
    return `${className}:${pseudo}`
}

/**
 * Inject a single pseudo-class rule for a class name.
 * Uses reference counting — safe to call from multiple mounted components
 * sharing the same generated class.
 */
export function injectPseudoRule(
    className: string,
    pseudo: string,
    styles: Record<string, string | number | undefined>,
): void {
    if (typeof document === 'undefined') return

    const css = styleObjectToCss(styles)
    if (!css) return

    const id = tagId(className, pseudo)
    const count = (refCounts.get(id) ?? 0) + 1
    refCounts.set(id, count)

    // Already injected — update content in case tokens changed (mode switch)
    const existing = document.head.querySelector(`[${ATTR}="${id}"]`)
    const rule = `.${className}:${pseudoSelector(pseudo)} { ${css} }`
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
 * Release a pseudo-class rule for a class name.
 * Removes the <style> tag when the ref count drops to zero.
 */
export function releasePseudoRule(className: string, pseudo: string): void {
    if (typeof document === 'undefined') return

    const id = tagId(className, pseudo)
    const count = (refCounts.get(id) ?? 1) - 1

    if (count <= 0) {
        refCounts.delete(id)
        document.head.querySelector(`[${ATTR}="${id}"]`)?.remove()
    } else {
        refCounts.set(id, count)
    }
}

/**
 * Inject all pseudo rules for a component instance.
 * Call in useEffect on mount / when pseudoStyles changes.
 */
export function acquirePseudoStyles(
    className: string,
    pseudoStyles: Record<string, Record<string, string | number | undefined>>,
): void {
    for (const [pseudo, styles] of Object.entries(pseudoStyles)) {
        injectPseudoRule(className, pseudo, styles)
    }
}

/**
 * Release all pseudo rules for a component instance.
 * Call in the useEffect cleanup (return function) — runs on unmount.
 */
export function releasePseudoStyles(
    className: string,
    pseudoKeys: string[],
): void {
    for (const pseudo of pseudoKeys) {
        releasePseudoRule(className, pseudo)
    }
}
