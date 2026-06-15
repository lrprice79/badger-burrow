import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { Chamber, Tunnel, useBurrow } from '@badger-eco/burrow-web'
import { generateHarmonics, generateScale, generateTheme, type GeneratedTheme, type ThemeHarmony } from '@badger-eco/burrow-tokens'
import { getTheme } from '../.storybook/themes'

/** Storybook's colour control can hand back hex or rgb(a) — normalise to #rrggbb. */
function normalizeHex(input: string): string {
    if (/^#[0-9a-fA-F]{6}$/.test(input)) return input.toLowerCase()
    const m = input.match(/(\d+)\D+(\d+)\D+(\d+)/)
    if (m) {
        const h = (n: string) => Math.max(0, Math.min(255, parseInt(n, 10))).toString(16).padStart(2, '0')
        return `#${h(m[1])}${h(m[2])}${h(m[3])}`
    }
    return '#8b5cf6'
}

const ALL_SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const

function ScaleStrip({ label, scale }: { label: string; scale: Record<string, string> }) {
    return (
        <Chamber display="flex" align="center" gap="3">
            <Chamber w="120px"><Tunnel fontFamily="mono" fontSize="sm" color="text.secondary">{label}</Tunnel></Chamber>
            <Chamber display="flex" flex="1" radius="md" overflow="hidden" borderWidth={1} borderColor="border.default">
                {ALL_SHADES.map((s) => <Chamber key={s} bg={scale[s]} h="36px" flex="1" />)}
            </Chamber>
        </Chamber>
    )
}

const meta: Meta = {
    title: 'Theme',
    parameters: {
        docs: {
            description: {
                component:
                    'Use the **Mode** and **Brand** toolbar controls (top bar) to switch light/dark and recolour the whole library live. These stories read the current token store via `useBurrow`, so they react instantly.',
            },
        },
    },
}
export default meta
type Story = StoryObj

// ─── what each semantic token means ───────────────────────────────────────────

const MEANINGS: Record<string, string> = {
    'bg.surface': 'Page / app background — the base layer everything sits on',
    'bg.elevated': 'Raised surfaces above the page — cards, modals, dropdowns',
    'bg.overlay': 'Scrims behind modals (semi-transparent black)',
    'text.primary': 'Main body & heading text',
    'text.secondary': 'Supporting text — captions, labels, placeholders',
    'text.inverse': 'Text that sits on a coloured / brand background (e.g. a primary button)',
    'interactive.primary': 'Primary actions — main buttons, links, focus rings',
    'interactive.secondary': 'Secondary actions — the harmonic partner colour',
    'border.default': 'Dividers, outlines, card borders',
    'feedback.success': 'Positive / confirmation states',
    'feedback.error': 'Errors & destructive actions',
    'feedback.warning': 'Caution states',
    'feedback.info': 'Informational notices',
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function Swatch({ token, label, desc }: { token: string; label?: string; desc?: boolean }) {
    return (
        <Chamber display="flex" flexDir="column" gap="1">
            <Chamber bg={token} h="56px" radius="md" borderWidth={1} borderColor="border.default" shadow="sm" />
            <Tunnel fontSize="xs" fontFamily="mono" fontWeight="medium">{label ?? token}</Tunnel>
            {desc && MEANINGS[token] && (
                <Tunnel fontSize="xs" color="text.secondary" lineHeight="tight">{MEANINGS[token]}</Tunnel>
            )}
        </Chamber>
    )
}

function Grid({ children, cols = 4 }: { children: React.ReactNode; cols?: number }) {
    return (
        <Chamber display="grid" gridTemplateColumns={`repeat(${cols}, 1fr)`} gap="3">
            {children}
        </Chamber>
    )
}

// ─── naming explainer ─────────────────────────────────────────────────────────

export const TokenNaming: Story = {
    name: 'Token Naming',
    parameters: {
        docs: { description: { story: 'How BadgerBurrow token names are structured, and what each part means.' } },
    },
    render: () => (
        <Chamber display="flex" flexDir="column" gap="5" maxW="640px">
            <Tunnel as="h3" fontSize="xl" fontWeight="bold">How token names work</Tunnel>

            <Chamber display="flex" flexDir="column" gap="2">
                <Tunnel fontWeight="semibold">Two layers</Tunnel>
                <Tunnel color="text.secondary">
                    <Tunnel as="span" fontWeight="medium" color="text.primary">Primitive</Tunnel> tokens are raw scale values —
                    <Tunnel as="span" fontFamily="mono"> primary.500</Tunnel>, <Tunnel as="span" fontFamily="mono">neutral.100</Tunnel>.
                    Ten shades (50 → 900) per colour.
                </Tunnel>
                <Tunnel color="text.secondary">
                    <Tunnel as="span" fontWeight="medium" color="text.primary">Semantic</Tunnel> tokens point at primitives by
                    <Tunnel as="span" fontWeight="medium" color="text.primary"> role</Tunnel>, not hue —
                    <Tunnel as="span" fontFamily="mono"> bg.surface</Tunnel>, <Tunnel as="span" fontFamily="mono">text.primary</Tunnel>.
                    Dark mode swaps the semantic layer only, so your components never mention a raw colour.
                </Tunnel>
            </Chamber>

            <Chamber display="flex" flexDir="column" gap="2">
                <Tunnel fontWeight="semibold">The category prefix tells you the role</Tunnel>
                {([
                    ['bg.*', 'Backgrounds / surfaces'],
                    ['text.*', 'Text colours'],
                    ['interactive.*', 'Actionable things — buttons, links, focus'],
                    ['border.*', 'Borders & dividers'],
                    ['feedback.*', 'Status — success / error / warning / info'],
                ] as const).map(([name, meaning]) => (
                    <Chamber key={name} display="flex" gap="3" align="baseline">
                        <Chamber w="130px"><Tunnel fontFamily="mono" fontSize="sm" color="interactive.primary">{name}</Tunnel></Chamber>
                        <Tunnel fontSize="sm" color="text.secondary">{meaning}</Tunnel>
                    </Chamber>
                ))}
            </Chamber>

            <Chamber display="flex" flexDir="column" gap="2">
                <Tunnel fontWeight="semibold">In props you drop the category</Tunnel>
                <Tunnel color="text.secondary">
                    The prop name already implies it, so you write <Tunnel as="span" fontFamily="mono">bg="bg.surface"</Tunnel>,
                    <Tunnel as="span" fontFamily="mono"> color="text.primary"</Tunnel>,
                    <Tunnel as="span" fontFamily="mono"> p="4"</Tunnel> — never the full
                    <Tunnel as="span" fontFamily="mono"> color.</Tunnel> / <Tunnel as="span" fontFamily="mono">space.</Tunnel> path.
                </Tunnel>
            </Chamber>
        </Chamber>
    ),
}

// ─── light & dark ─────────────────────────────────────────────────────────────

export const LightAndDark: Story = {
    name: 'Light & Dark',
    parameters: {
        docs: { description: { story: 'Every semantic colour with a plain-English note on its role. Toggle the Mode toolbar to see the same names resolve to different values in light vs dark.' } },
    },
    render: () => (
        <Chamber display="flex" flexDir="column" gap="5">
            <Tunnel as="h3" fontSize="xl" fontWeight="bold">Semantic colours — toggle Mode in the toolbar ↑</Tunnel>
            <Tunnel color="text.secondary">Each name is a role; the value behind it changes with the mode. Hover descriptions explain what each is for.</Tunnel>
            <Grid cols={3}>
                <Swatch token="bg.surface" desc />
                <Swatch token="bg.elevated" desc />
                <Swatch token="border.default" desc />
                <Swatch token="text.primary" desc />
                <Swatch token="text.secondary" desc />
                <Swatch token="text.inverse" desc />
                <Swatch token="interactive.primary" desc />
                <Swatch token="interactive.secondary" desc />
            </Grid>
            <Tunnel as="h3" fontSize="lg" fontWeight="semibold">Feedback</Tunnel>
            <Grid cols={4}>
                <Swatch token="feedback.success" desc />
                <Swatch token="feedback.error" desc />
                <Swatch token="feedback.warning" desc />
                <Swatch token="feedback.info" desc />
            </Grid>
        </Chamber>
    ),
}

// ─── brand colours ────────────────────────────────────────────────────────────

export const ThemePalette: Story = {
    name: 'Theme Palette',
    render: () => (
        <Chamber display="flex" flexDir="column" gap="4" maxW="560px">
            <Tunnel as="h3" fontSize="xl" fontWeight="bold">Switch the Theme toolbar control ↑</Tunnel>
            <Tunnel color="text.secondary">
                Each theme builds a coordinated palette from one brand hex: <Tunnel as="span" fontFamily="mono">primary</Tunnel> from
                the hex, and <Tunnel as="span" fontFamily="mono">secondary</Tunnel> via <Tunnel as="span" fontFamily="mono">generateHarmonics</Tunnel>.
                The semantic tokens reference <Tunnel as="span" fontFamily="mono">{'{color.primary.*}'}</Tunnel> and
                <Tunnel as="span" fontFamily="mono"> {'{color.secondary.*}'}</Tunnel>, so everything recolours automatically.
            </Tunnel>
            <Chamber display="flex" gap="3" wrap="wrap">
                <Chamber as="button" onClick={action('primary clicked')}
                    bg="interactive.primary" color="text.inverse" px="5" py="3" radius="md"
                    fontWeight="semibold" cursor="pointer" _hover={{ bg: 'interactive.primary.hover' }}
                    _active={{ opacity: 0.85 }}>
                    Primary action
                </Chamber>
                <Chamber as="button" onClick={action('secondary clicked')}
                    bg="interactive.secondary" color="text.inverse" px="5" py="3" radius="md" fontWeight="semibold"
                    cursor="pointer" _hover={{ bg: 'interactive.secondary.hover' }} _active={{ opacity: 0.85 }}>
                    Secondary action
                </Chamber>
                <Chamber as="button" onClick={action('outline clicked')}
                    bg="bg.elevated" color="interactive.primary" borderWidth={1}
                    borderColor="interactive.primary" px="5" py="3" radius="md" fontWeight="semibold"
                    cursor="pointer" _hover={{ bg: 'bg.surface.hover' }} _active={{ opacity: 0.85 }}>
                    Outline
                </Chamber>
            </Chamber>
            <Tunnel fontSize="sm" fontWeight="semibold" color="text.secondary">primary</Tunnel>
            <Grid cols={5}>
                {(['100', '300', '500', '700', '900'] as const).map((s) => (
                    <Swatch key={s} token={`primary.${s}`} label={s} />
                ))}
            </Grid>
            <Tunnel fontSize="sm" fontWeight="semibold" color="text.secondary">secondary (harmonic)</Tunnel>
            <Grid cols={5}>
                {(['100', '300', '500', '700', '900'] as const).map((s) => (
                    <Swatch key={s} token={`secondary.${s}`} label={s} />
                ))}
            </Grid>
        </Chamber>
    ),
}

// ─── harmonics ────────────────────────────────────────────────────────────────

type HexHarmonics = {
    complementary: string
    analogous: string[]
    triadic: string[]
    splitComplementary: string[]
    tetradic: string[]
}

function HarmonyRow({ label, hexes, active }: { label: string; hexes: string[]; active?: boolean }) {
    return (
        <Chamber display="flex" align="center" gap="3">
            <Chamber w="160px">
                <Tunnel fontFamily="mono" fontSize="sm" fontWeight={active ? 'bold' : 'normal'}
                    color={active ? 'interactive.primary' : 'text.secondary'}>
                    {label}{active ? '  ← secondary' : ''}
                </Tunnel>
            </Chamber>
            <Chamber display="flex" gap="2">
                {hexes.map((hex) => (
                    <Chamber key={hex} display="flex" flexDir="column" gap="1" align="center">
                        <Chamber bg={hex} w="64px" h="44px" radius="md" borderWidth={1} borderColor="border.default" />
                        <Tunnel fontFamily="mono" fontSize="xs" color="text.secondary">{hex}</Tunnel>
                    </Chamber>
                ))}
            </Chamber>
        </Chamber>
    )
}

export const Harmonics: Story = {
    name: 'Colour Harmonics',
    render: (_args, context) => {
        const theme = getTheme((context.globals?.theme ?? 'badger') as string)
        const h = generateHarmonics(theme.base, { scales: false }) as unknown as HexHarmonics
        return (
            <Chamber display="flex" flexDir="column" gap="4">
                <Chamber display="flex" flexDir="column" gap="1">
                    <Tunnel as="h3" fontSize="xl" fontWeight="bold">Harmonics for the active theme</Tunnel>
                    <Tunnel color="text.secondary">
                        Switch the <Tunnel as="span" fontWeight="medium" color="text.primary">Theme</Tunnel> toolbar ↑ —
                        each theme is one base hex; <Tunnel as="span" fontFamily="mono">generateHarmonics</Tunnel> derives
                        the rest. The row marked <Tunnel as="span" fontWeight="medium" color="interactive.primary">← secondary</Tunnel> is
                        what this theme uses for its secondary scale.
                    </Tunnel>
                </Chamber>
                {theme.defaults && (
                    <Tunnel fontSize="sm" color="text.secondary">
                        This theme uses the shipped defaults — <Tunnel as="span" fontFamily="mono">secondary</Tunnel> is
                        the built-in teal, not derived from the rows below.
                    </Tunnel>
                )}
                <HarmonyRow label="base (primary)" hexes={[theme.base]} />
                <HarmonyRow label="complementary" hexes={[h.complementary]} active={theme.harmony === 'complementary'} />
                <HarmonyRow label="analogous" hexes={h.analogous} active={theme.harmony === 'analogous'} />
                <HarmonyRow label="triadic" hexes={h.triadic} active={theme.harmony === 'triadic'} />
                <HarmonyRow label="splitComplementary" hexes={h.splitComplementary} active={theme.harmony === 'splitComplementary'} />
                <HarmonyRow label="tetradic" hexes={h.tetradic} />
            </Chamber>
        )
    },
}

// ─── interactive harmonics explorer ───────────────────────────────────────────

export const HarmonicsExplorer: Story = {
    name: 'Harmonics Explorer',
    argTypes: { base: { control: 'color', name: 'Base colour' } },
    args: { base: '#8B5CF6' },
    parameters: {
        docs: { description: { story: 'Pick any colour in the Controls panel — its complementary (and the other harmonies) are generated live with `generateHarmonics`. The two full scales are ready to drop straight into `extendBurrow`.' } },
    },
    render: (args) => {
        const base = normalizeHex(String((args as { base?: string }).base ?? '#8b5cf6'))
        const hexes = generateHarmonics(base, { scales: false }) as unknown as HexHarmonics
        const baseScale = generateScale(base) as unknown as Record<string, string>
        const compScale = generateScale(hexes.complementary) as unknown as Record<string, string>
        return (
            <Chamber display="flex" flexDir="column" gap="6" maxW="760px">
                <Tunnel as="h3" fontSize="xl" fontWeight="bold">Pick a colour in the Controls panel → find its complement</Tunnel>

                <Chamber display="flex" gap="6" align="center" wrap="wrap">
                    <Chamber display="flex" flexDir="column" gap="1" align="center">
                        <Chamber bg={base} w="120px" h="80px" radius="lg" shadow="sm" borderWidth={1} borderColor="border.default" />
                        <Tunnel fontWeight="semibold">Your colour</Tunnel>
                        <Tunnel fontFamily="mono" fontSize="sm" color="text.secondary">{base}</Tunnel>
                    </Chamber>
                    <Tunnel fontSize="2xl" color="text.secondary">+180° →</Tunnel>
                    <Chamber display="flex" flexDir="column" gap="1" align="center">
                        <Chamber bg={hexes.complementary} w="120px" h="80px" radius="lg" shadow="sm" borderWidth={1} borderColor="border.default" />
                        <Tunnel fontWeight="semibold">Complementary</Tunnel>
                        <Tunnel fontFamily="mono" fontSize="sm" color="text.secondary">{hexes.complementary}</Tunnel>
                    </Chamber>
                </Chamber>

                <Chamber display="flex" flexDir="column" gap="2">
                    <Tunnel fontWeight="semibold">Generated scales — ready for <Tunnel as="span" fontFamily="mono">extendBurrow</Tunnel></Tunnel>
                    <ScaleStrip label="base → primary" scale={baseScale} />
                    <ScaleStrip label="complementary" scale={compScale} />
                </Chamber>

                <Chamber display="flex" flexDir="column" gap="3">
                    <Tunnel fontWeight="semibold">Other harmonies of your colour</Tunnel>
                    <HarmonyRow label="analogous" hexes={hexes.analogous} />
                    <HarmonyRow label="triadic" hexes={hexes.triadic} />
                    <HarmonyRow label="splitComplementary" hexes={hexes.splitComplementary} />
                    <HarmonyRow label="tetradic" hexes={hexes.tetradic} />
                </Chamber>
            </Chamber>
        )
    },
}

// ─── generateTheme — one hex → an AA-checked theme ────────────────────────────

/** WCAG relative luminance + contrast, so the story can prove its own AA claim. */
function lin(c: number): number {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
function lum(hex: string): number {
    const h = hex.replace('#', '')
    const r = parseInt(h.slice(0, 2), 16) / 255
    const g = parseInt(h.slice(2, 4), 16) / 255
    const b = parseInt(h.slice(4, 6), 16) / 255
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
function contrastRatio(a: string, b: string): number {
    const la = lum(a), lb = lum(b)
    const [hi, lo] = la > lb ? [la, lb] : [lb, la]
    return (hi + 0.05) / (lo + 0.05)
}

/** Resolve a `{color.scale.shade}` reference (or raw hex) against a generated theme. */
function resolveRef(theme: GeneratedTheme, value: string): string {
    const m = value.match(/^\{color\.(\w+)\.(\d+)\}$/)
    if (!m) return value
    return (theme.primitive.color[m[1]] as Record<string, string>)[m[2]]
}

/** A live themed button pair with its measured contrast ratio + AA verdict. */
function ThemedButtons({ theme }: { theme: GeneratedTheme }) {
    const s = theme.semantic.light
    const label = resolveRef(theme, s['color.text.inverse'])
    const rows = [
        ['Primary', resolveRef(theme, s['color.interactive.primary']), resolveRef(theme, s['color.interactive.primary.hover'])],
        ['Secondary', resolveRef(theme, s['color.interactive.secondary']), resolveRef(theme, s['color.interactive.secondary.hover'])],
    ] as const
    return (
        <Chamber display="flex" flexDir="column" gap="3">
            {rows.map(([name, bg, hover]) => {
                const ratio = contrastRatio(bg, label)
                const pass = ratio >= 4.5
                return (
                    <Chamber key={name} display="flex" align="center" gap="3" wrap="wrap">
                        <Chamber as="button" bg={bg} color={label} px="5" py="3" radius="md"
                            fontWeight="semibold" cursor="pointer" borderWidth={0}
                            _hover={{ bg: hover }} _active={{ opacity: 0.85 }}>
                            {name} action
                        </Chamber>
                        <Tunnel fontFamily="mono" fontSize="sm" color="text.secondary">{bg}</Tunnel>
                        <Tunnel fontFamily="mono" fontSize="sm"
                            color={pass ? 'feedback.success' : 'feedback.error'} fontWeight="semibold">
                            {ratio.toFixed(2)}:1 {pass ? 'AA ✓' : 'FAIL'}
                        </Tunnel>
                        <Tunnel fontSize="xs" color="text.secondary">
                            label {label.toLowerCase() === '#ffffff' ? 'white' : 'dark'}
                        </Tunnel>
                    </Chamber>
                )
            })}
        </Chamber>
    )
}

export const ThemeGenerator: Story = {
    name: 'generateTheme — live',
    argTypes: {
        brand: { control: 'color', name: 'Brand colour' },
        harmony: {
            control: 'select',
            options: ['complementary', 'analogous', 'triadic', 'splitComplementary'],
            name: 'Secondary harmony',
        },
    },
    args: { brand: '#8B5CF6', harmony: 'complementary' },
    parameters: {
        docs: {
            description: {
                story:
                    'Pick **any** brand colour in the Controls panel. `generateTheme(brand)` returns a complete, ready-for-`extendBurrow` theme — and chooses each button’s shade + label colour so it stays WCAG-AA readable. The measured contrast ratio is shown next to every button; it never drops below 4.5:1, whatever hue you choose. Note how light brands (try yellow) flip the label to dark automatically.',
            },
        },
    },
    render: (args) => {
        const brand = normalizeHex(String((args as { brand?: string }).brand ?? '#8b5cf6'))
        const harmony = ((args as { harmony?: string }).harmony ?? 'complementary') as ThemeHarmony
        const theme = generateTheme(brand, { harmony })
        return (
            <Chamber display="flex" flexDir="column" gap="6" maxW="720px">
                <Chamber display="flex" flexDir="column" gap="1">
                    <Tunnel as="h3" fontSize="xl" fontWeight="bold">One hex → a complete, accessible theme</Tunnel>
                    <Tunnel color="text.secondary">
                        <Tunnel as="span" fontFamily="mono">extendBurrow(generateTheme('{brand}'))</Tunnel> — that’s the whole setup.
                    </Tunnel>
                </Chamber>
                <ThemedButtons theme={theme} />
                <Chamber display="flex" flexDir="column" gap="2">
                    <Tunnel fontWeight="semibold">Generated scales</Tunnel>
                    <ScaleStrip label="primary" scale={theme.primitive.color.primary as Record<string, string>} />
                    <ScaleStrip label="secondary" scale={theme.primitive.color.secondary as Record<string, string>} />
                    <ScaleStrip label="neutral" scale={theme.primitive.color.neutral as Record<string, string>} />
                    <ScaleStrip label="ink" scale={theme.primitive.color.ink as Record<string, string>} />
                </Chamber>
            </Chamber>
        )
    },
}

const TRICKY_HUES: [string, string][] = [
    ['Violet', '#8B5CF6'],
    ['Yellow', '#F5D90A'],
    ['Lime', '#84CC16'],
    ['Cyan', '#06B6D4'],
    ['Red', '#EF4444'],
    ['Navy', '#1E293B'],
    ['Near-white', '#F8FAFC'],
]

export const ThemeGeneratorHues: Story = {
    name: 'generateTheme — any hue stays AA',
    parameters: {
        docs: {
            description: {
                story:
                    'The same `generateTheme` call across hues that normally break a fixed “white label on shade 600” rule — light yellows, limes, cyans, near-whites. Every primary button still clears 4.5:1; the label flips white↔dark as needed.',
            },
        },
    },
    render: () => (
        <Chamber display="flex" flexDir="column" gap="4" maxW="720px">
            <Tunnel as="h3" fontSize="xl" fontWeight="bold">Readable buttons for every brand colour</Tunnel>
            {TRICKY_HUES.map(([name, hex]) => {
                const theme = generateTheme(hex)
                return (
                    <Chamber key={hex} display="flex" align="center" gap="4" wrap="wrap">
                        <Chamber w="100px" display="flex" flexDir="column">
                            <Tunnel fontWeight="semibold">{name}</Tunnel>
                            <Tunnel fontFamily="mono" fontSize="xs" color="text.secondary">{hex}</Tunnel>
                        </Chamber>
                        <ThemedButtons theme={theme} />
                    </Chamber>
                )
            })}
        </Chamber>
    ),
}

// ─── colour scales ────────────────────────────────────────────────────────────

const SCALES = ['primary', 'secondary', 'neutral', 'ink', 'success', 'error', 'warning', 'info'] as const
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const

export const ColourScales: Story = {
    name: 'Colour Scales',
    render: () => (
        <Chamber display="flex" flexDir="column" gap="4">
            {SCALES.map((scale) => (
                <Chamber key={scale} display="flex" flexDir="column" gap="1">
                    <Tunnel fontWeight="semibold" textTransform="capitalize">{scale}</Tunnel>
                    <Chamber display="grid" gridTemplateColumns="repeat(10, 1fr)" gap="1">
                        {SHADES.map((shade) => (
                            <Chamber key={shade} bg={`${scale}.${shade}`} h="44px" radius="sm"
                                display="flex" align="flex-end" justify="center">
                                <Tunnel fontSize="xs" color={Number(shade) >= 500 ? 'text.inverse' : 'text.primary'}>{shade}</Tunnel>
                            </Chamber>
                        ))}
                    </Chamber>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── spacing ──────────────────────────────────────────────────────────────────

export const Spacing: Story = {
    render: () => {
        const { tokens } = useBurrow()
        const keys = Object.keys(tokens.primitive.space)
        return (
            <Chamber display="flex" flexDir="column" gap="2">
                {keys.map((k) => (
                    <Chamber key={k} display="flex" align="center" gap="4">
                        <Chamber w="56px"><Tunnel fontFamily="mono" fontSize="sm">{k}</Tunnel></Chamber>
                        <Chamber w="48px">
                            <Tunnel fontFamily="mono" fontSize="sm" color="text.secondary">
                                {tokens.primitive.space[k as never]}px
                            </Tunnel>
                        </Chamber>
                        <Chamber bg="interactive.primary" h="16px" w={k} radius="sm" />
                    </Chamber>
                ))}
            </Chamber>
        )
    },
}

// ─── typography ───────────────────────────────────────────────────────────────

export const Typography: Story = {
    render: () => {
        const { tokens } = useBurrow()
        return (
            <Chamber display="flex" flexDir="column" gap="3">
                {Object.keys(tokens.primitive.fontSize).map((k) => (
                    <Chamber key={k} display="flex" align="baseline" gap="4">
                        <Chamber w="40px"><Tunnel fontFamily="mono" fontSize="xs" color="text.secondary">{k}</Tunnel></Chamber>
                        <Tunnel fontSize={k}>Badger {tokens.primitive.fontSize[k as never]}px</Tunnel>
                    </Chamber>
                ))}
            </Chamber>
        )
    },
}

// ─── radii ────────────────────────────────────────────────────────────────────

export const Radii: Story = {
    render: () => (
        <Chamber display="flex" gap="5" wrap="wrap">
            {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((r) => (
                <Chamber key={r} display="flex" flexDir="column" gap="2" align="center">
                    <Chamber bg="interactive.primary" w="80px" h="80px" radius={r} />
                    <Tunnel fontFamily="mono" fontSize="sm">{r}</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── shadows ──────────────────────────────────────────────────────────────────

export const Shadows: Story = {
    render: () => (
        <Chamber display="flex" gap="8" wrap="wrap" p="4">
            {(['none', 'sm', 'md', 'lg'] as const).map((s) => (
                <Chamber key={s} display="flex" flexDir="column" gap="3" align="center">
                    <Chamber bg="bg.elevated" w="100px" h="100px" radius="lg" shadow={s} />
                    <Tunnel fontFamily="mono" fontSize="sm">{s}</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}
