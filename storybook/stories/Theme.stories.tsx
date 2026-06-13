import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { Chamber, Tunnel, useBurrow } from '@badger-burrow/web'
import { generateHarmonics } from '@badger-burrow/tokens'
import { getTheme } from '../.storybook/themes'

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
                    cursor="pointer" _active={{ opacity: 0.85 }}>
                    Secondary action
                </Chamber>
                <Chamber as="button" onClick={action('outline clicked')}
                    bg="bg.elevated" color="interactive.primary" borderWidth={1}
                    borderColor="interactive.primary" px="5" py="3" radius="md" fontWeight="semibold"
                    cursor="pointer" _hover={{ bg: 'bg.surface' }} _active={{ opacity: 0.85 }}>
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
