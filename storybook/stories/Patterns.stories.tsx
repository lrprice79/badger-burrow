import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { Chamber, Tunnel } from '@purple-brock/burrow-web'

const meta: Meta = {
    title: 'Patterns',
    parameters: {
        docs: {
            description: {
                component: 'Real UI components composed purely from `Chamber` + `Tunnel` — no extra CSS. All recolour with the Brand toolbar and respond to Light/Dark.',
            },
        },
    },
}
export default meta
type Story = StoryObj

// ─── building blocks ──────────────────────────────────────────────────────────

function Button({ children, variant = 'primary', disabled, ...rest }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean; [k: string]: unknown }) {
    const base = {
        as: 'button' as const, onClick: action('button clicked'), disabled,
        px: '5', py: '3', radius: 'md', fontWeight: 'semibold' as const, fontSize: 'sm' as const,
        // A disabled button must not react to pointer/hover/active — drop the
        // interactive props entirely (browsers still match :hover on a disabled
        // <button>, so it isn't enough to rely on the attribute alone).
        ...(disabled ? {} : { cursor: 'pointer', _active: { opacity: 0.85 } }),
    }
    const hover = (h: Record<string, unknown>) => (disabled ? {} : { _hover: h })
    if (variant === 'primary')
        return <Chamber {...base} bg="interactive.primary" color="text.inverse" {...hover({ bg: 'interactive.primary.hover' })} {...rest}>{children}</Chamber>
    if (variant === 'secondary')
        return <Chamber {...base} bg="bg.elevated" color="interactive.primary" borderWidth={1} borderColor="interactive.primary" {...hover({ bg: 'bg.surface.hover' })} {...rest}>{children}</Chamber>
    // ghost — no border/chrome; brand-coloured text, subtle fill on hover.
    // Hover uses `bg.surface.hover` (one step off the surface) rather than
    // `bg.surface` — the story canvas IS `bg.surface`, so hovering to it would be
    // invisible. `.hover` stays distinct from the canvas in both light and dark.
    return <Chamber {...base} bg="transparent" color="interactive.primary" {...hover({ bg: 'bg.surface.hover' })} {...rest}>{children}</Chamber>
}

function Badge({ children, tone = 'primary' }: { children: React.ReactNode; tone?: 'primary' | 'success' | 'error' | 'warning' }) {
    const bg = tone === 'primary' ? 'interactive.primary' : `feedback.${tone}`
    return <Chamber as="span" display="inline-flex" bg={bg} color="text.inverse" px="2" py="1" radius="full" fontSize="xs" fontWeight="bold">{children}</Chamber>
}

// ─── buttons ──────────────────────────────────────────────────────────────────

export const Buttons: Story = {
    render: () => (
        <Chamber display="flex" gap="3" wrap="wrap" align="center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}>Disabled</Button>
        </Chamber>
    ),
}

// ─── badges ───────────────────────────────────────────────────────────────────

export const Badges: Story = {
    render: () => (
        <Chamber display="flex" gap="2" align="center">
            <Badge tone="primary">New</Badge>
            <Badge tone="success">Active</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="error">Failed</Badge>
        </Chamber>
    ),
}

// ─── card ─────────────────────────────────────────────────────────────────────

export const Card: Story = {
    render: () => (
        <Chamber bg="bg.elevated" radius="lg" shadow="md" maxW="360px" overflow="hidden" borderWidth={1} borderColor="border.default">
            <Chamber bg="interactive.primary" h="120px" display="flex" align="flex-end" p="4">
                <Tunnel color="text.inverse" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">Featured</Tunnel>
            </Chamber>
            <Chamber p="5" display="flex" flexDir="column" gap="3">
                <Chamber display="flex" justify="space-between" align="center">
                    <Tunnel as="h3" fontSize="xl" fontWeight="bold">Monthly Budget</Tunnel>
                    <Badge tone="success">On track</Badge>
                </Chamber>
                <Tunnel color="text.secondary" lineHeight="relaxed" lineClamp={3}>
                    A summary of your spending this month, composed entirely from Chamber and Tunnel primitives — no
                    bespoke CSS, fully themeable, and dark-mode aware out of the box.
                </Tunnel>
                <Chamber display="flex" gap="2" pt="2">
                    <Button variant="primary">View</Button>
                    <Button variant="ghost">Dismiss</Button>
                </Chamber>
            </Chamber>
        </Chamber>
    ),
}

// ─── alerts ───────────────────────────────────────────────────────────────────

export const Alerts: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="3" maxW="480px">
            {(['success', 'error', 'warning', 'info'] as const).map((tone) => (
                <Chamber key={tone} display="flex" gap="3" align="center" bg="bg.elevated"
                    borderWidth={1} borderColor={`feedback.${tone}`} borderLeftWidth={4} p="4" radius="md">
                    <Chamber bg={`feedback.${tone}`} w="10px" h="10px" radius="full" />
                    <Tunnel fontWeight="medium" textTransform="capitalize">{tone}</Tunnel>
                    <Tunnel color="text.secondary" fontSize="sm">Something {tone}-worthy just happened.</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── avatar + list row ────────────────────────────────────────────────────────

export const ListRows: Story = {
    render: () => (
        <Chamber as="ul" display="flex" flexDir="column" gap="1" maxW="420px" bg="bg.elevated" radius="lg" p="2" borderWidth={1} borderColor="border.default">
            {['Ada', 'Bea', 'Cleo'].map((name, i) => (
                <Chamber as="li" key={name} display="flex" align="center" gap="3" px="3" py="3" radius="md"
                    _hover={{ bg: 'bg.surface', cursor: 'pointer' }}>
                    <Chamber w="40px" h="40px" radius="full" bg={i === 0 ? 'interactive.primary' : i === 1 ? 'feedback.success' : 'feedback.warning'}
                        display="flex" align="center" justify="center">
                        <Tunnel color="text.inverse" fontWeight="bold">{name[0]}</Tunnel>
                    </Chamber>
                    <Chamber display="flex" flexDir="column">
                        <Tunnel fontWeight="medium">{name} Badger</Tunnel>
                        <Tunnel fontSize="sm" color="text.secondary">{name.toLowerCase()}@badger.dev</Tunnel>
                    </Chamber>
                    <Chamber ml="auto"><Badge tone="primary">{i + 1}</Badge></Chamber>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── stat tiles ───────────────────────────────────────────────────────────────

export const StatTiles: Story = {
    render: () => (
        <Chamber display="grid" gridTemplateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap="4" maxW="640px">
            {[
                { label: 'Spent', value: '£1,240', tone: 'error' as const },
                { label: 'Saved', value: '£860', tone: 'success' as const },
                { label: 'Left', value: '£400', tone: 'warning' as const },
            ].map((s) => (
                <Chamber key={s.label} bg="bg.elevated" p="5" radius="lg" shadow="sm" borderWidth={1} borderColor="border.default"
                    display="flex" flexDir="column" gap="1">
                    <Tunnel fontSize="sm" color="text.secondary" textTransform="uppercase" letterSpacing="wide">{s.label}</Tunnel>
                    <Tunnel fontSize="3xl" fontWeight="bold" color={`feedback.${s.tone}`}>{s.value}</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}
