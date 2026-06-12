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

// ─── helpers ──────────────────────────────────────────────────────────────────

function Swatch({ token, label }: { token: string; label?: string }) {
    return (
        <Chamber display="flex" flexDir="column" gap="1">
            <Chamber bg={token} h="56px" radius="md" borderWidth={1} borderColor="border.default" />
            <Tunnel fontSize="xs" fontFamily="mono">{label ?? token}</Tunnel>
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

// ─── light & dark ─────────────────────────────────────────────────────────────

export const LightAndDark: Story = {
    name: 'Light & Dark',
    render: () => (
        <Chamber display="flex" flexDir="column" gap="5">
            <Tunnel as="h3" fontSize="xl" fontWeight="bold">Semantic colours — toggle Mode in the toolbar ↑</Tunnel>
            <Grid cols={4}>
                <Swatch token="bg.surface" />
                <Swatch token="bg.elevated" />
                <Swatch token="text.primary" />
                <Swatch token="text.secondary" />
                <Swatch token="interactive.primary" />
                <Swatch token="interactive.secondary" />
                <Swatch token="border.default" />
                <Swatch token="text.inverse" />
            </Grid>
            <Tunnel as="h3" fontSize="lg" fontWeight="semibold">Feedback</Tunnel>
            <Grid cols={4}>
                <Swatch token="feedback.success" />
                <Swatch token="feedback.error" />
                <Swatch token="feedback.warning" />
                <Swatch token="feedback.info" />
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

const SCALES = ['primary', 'secondary', 'neutral', 'success', 'error', 'warning', 'info'] as const
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
