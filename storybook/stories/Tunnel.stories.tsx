import type { Meta, StoryObj } from '@storybook/react'
import { Chamber, Tunnel } from '@purple-brock/burrow-web'
import { tunnelArgTypes } from './_controls'

const meta: Meta<typeof Tunnel> = {
    title: 'Components/Tunnel',
    component: Tunnel,
    argTypes: tunnelArgTypes as never,
    parameters: {
        docs: {
            description: {
                component:
                    'The text primitive. Renders `<span>` by default; use `as` for `h1`–`h6`, `p`, `label`. Every font/typography prop is a live control.',
            },
        },
    },
}
export default meta
type Story = StoryObj<typeof Tunnel>

export const Playground: Story = {
    parameters: {
        docs: { description: { story: 'Live text sandbox. `as` picks the element (`h1`–`h6`, `p`, `span`, `label`); font/typography props take short-form tokens (`fontSize="lg"`, `fontWeight="bold"`). Tunnel has no layout props — wrap it in a Chamber to position it.' } },
    },
    args: {
        as: 'p',
        color: 'text.primary',
        fontSize: 'lg',
        fontWeight: 'normal',
        lineHeight: 'normal',
        italic: false,
        children: 'The quick brown badger jumps over the lazy fox. Edit my props →',
    },
}

// ─── type scale ───────────────────────────────────────────────────────────────

export const TypeScale: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="3">
            {(['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const).map((size) => (
                <Chamber key={size} display="flex" align="baseline" gap="4">
                    <Chamber w="48px"><Tunnel fontFamily="mono" fontSize="xs" color="text.secondary">{size}</Tunnel></Chamber>
                    <Tunnel fontSize={size}>Badger styling library</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── weights ──────────────────────────────────────────────────────────────────

export const Weights: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="2">
            {(['normal', 'medium', 'semibold', 'bold'] as const).map((w) => (
                <Tunnel key={w} fontSize="xl" fontWeight={w}>{w} — The quick brown badger</Tunnel>
            ))}
        </Chamber>
    ),
}

// ─── headings ─────────────────────────────────────────────────────────────────

export const Headings: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="2">
            <Tunnel as="h1" fontSize="3xl" fontWeight="bold">Heading 1</Tunnel>
            <Tunnel as="h2" fontSize="2xl" fontWeight="bold">Heading 2</Tunnel>
            <Tunnel as="h3" fontSize="xl" fontWeight="semibold">Heading 3</Tunnel>
            <Tunnel as="h4" fontSize="lg" fontWeight="semibold">Heading 4</Tunnel>
            <Tunnel as="p" color="text.secondary">Body paragraph — secondary text colour, default weight.</Tunnel>
        </Chamber>
    ),
}

// ─── colours ──────────────────────────────────────────────────────────────────

export const Colours: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="2">
            {(['text.primary', 'text.secondary', 'interactive.primary', 'feedback.success', 'feedback.error', 'feedback.warning', 'feedback.info'] as const).map((c) => (
                <Tunnel key={c} fontSize="lg" fontWeight="medium" color={c}>{c}</Tunnel>
            ))}
        </Chamber>
    ),
}

// ─── truncate & line clamp ────────────────────────────────────────────────────

export const TruncateAndClamp: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="5" maxW="320px">
            <Chamber>
                <Tunnel fontSize="xs" color="text.secondary">truncate</Tunnel>
                <Tunnel truncate as="p">This single line is far too long to fit and will be cut off with an ellipsis.</Tunnel>
            </Chamber>
            <Chamber>
                <Tunnel fontSize="xs" color="text.secondary">lineClamp=2</Tunnel>
                <Tunnel lineClamp={2} as="p">
                    This paragraph is clamped to two lines. Any text beyond the second line is hidden behind an ellipsis,
                    which is handy for card descriptions and previews where vertical space is limited.
                </Tunnel>
            </Chamber>
        </Chamber>
    ),
}

// ─── decoration / transform ───────────────────────────────────────────────────

export const Styling: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="2">
            <Tunnel italic>Italic text</Tunnel>
            <Tunnel textTransform="uppercase" letterSpacing="wide">Uppercase, wide tracking</Tunnel>
            <Tunnel textDecoration="underline" color="interactive.primary">Underlined link-style</Tunnel>
            <Tunnel fontFamily="mono">Monospace: const badger = true</Tunnel>
        </Chamber>
    ),
}
