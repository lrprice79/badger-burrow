import { defaultTokens } from '../defaults'

// Audit B4: the DEFAULT theme must be readable (WCAG AA 4.5:1 for text) in both modes, on both the
// page (bg.surface) and cards (bg.elevated) — feedback colours are used as text.

const lum = (hex: string): number => {
    const n = hex.replace('#', '')
    const [r, g, b] = [0, 2, 4]
        .map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string): number => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
}
const resolve = (value: string): string => {
    const m = value.match(/^\{([^}]+)\}$/)
    if (!m) return value
    let cur: unknown = defaultTokens.primitive
    for (const seg of m[1].split('.')) cur = (cur as Record<string, unknown>)[seg]
    return cur as string
}

const TEXT = [
    'color.text.primary',
    'color.text.secondary',
    'color.feedback.error',
    'color.feedback.success',
    'color.feedback.warning',
    'color.feedback.info',
]

for (const mode of ['light', 'dark'] as const) {
    const sem = defaultTokens.semantic[mode]
    describe(`default ${mode} theme is AA-readable`, () => {
        for (const bg of ['color.bg.surface', 'color.bg.elevated']) {
            for (const fg of TEXT) {
                it(`${fg} on ${bg} ≥ 4.5:1`, () => {
                    expect(contrast(resolve(sem[fg]), resolve(sem[bg]))).toBeGreaterThanOrEqual(4.5)
                })
            }
        }
    })
}
