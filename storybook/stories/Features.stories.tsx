import type { Meta, StoryObj } from '@storybook/react'
import { Chamber, Tunnel } from '@badger-eco/burrow-web'

const meta: Meta = {
    title: 'Features',
    parameters: {
        docs: {
            description: { component: 'Cross-cutting features: motion tokens, pseudo states, smart hover, responsive token objects.' },
        },
    },
}
export default meta
type Story = StoryObj

// ─── motion ───────────────────────────────────────────────────────────────────

export const Motion: Story = {
    name: 'Motion tokens',
    parameters: {
        docs: { description: { story: '`transition="fast"` expands a duration keyword to a full CSS transition (`all 150ms cubic-bezier(…)`). Keywords: instant · fast · normal · slow · glacial. Raw CSS still works.' } },
    },
    render: () => (
        <Chamber display="flex" flexDir="column" gap="4">
            <Tunnel color="text.secondary">Hover the boxes — each uses a motion-token transition keyword.</Tunnel>
            <Chamber display="flex" gap="4" wrap="wrap">
                {(['fast', 'normal', 'slow', 'glacial'] as const).map((speed) => (
                    <Chamber key={speed} as="button" bg="interactive.primary" color="text.inverse"
                        px="5" py="4" radius="md" fontWeight="semibold" transition={speed}
                        _hover={{ bg: 'interactive.primary.hover', cursor: 'pointer', transform: 'translateY(-4px)' }}>
                        transition="{speed}"
                    </Chamber>
                ))}
            </Chamber>
        </Chamber>
    ),
}

// ─── smart hover ──────────────────────────────────────────────────────────────

export const SmartHover: Story = {
    name: 'Smart hover (auto shade-step)',
    parameters: {
        docs: { description: { story: 'Give a Chamber a primitive `bg` (e.g. `primary.400`) and on hover it auto-steps two shades darker — no `_hover` needed. Semantic backgrounds (`bg.surface`) aren’t auto-stepped; use `hoverScale` or an explicit `_hover`.' } },
    },
    render: () => (
        <Chamber display="flex" flexDir="column" gap="3" maxW="420px">
            <Tunnel color="text.secondary">
                Give a primitive <Tunnel as="span" fontFamily="mono">bg</Tunnel> and hover auto-steps two shades darker —
                no <Tunnel as="span" fontFamily="mono">_hover</Tunnel> needed.
            </Tunnel>
            <Chamber display="flex" gap="3" wrap="wrap">
                {(['primary.400', 'success.500', 'error.500', 'warning.500'] as const).map((bg) => (
                    <Chamber key={bg} as="button" bg={bg} color="text.inverse" px="5" py="3" radius="md" fontWeight="semibold"
                        _hover={{ cursor: 'pointer' }}>
                        {bg}
                    </Chamber>
                ))}
            </Chamber>
        </Chamber>
    ),
}

// ─── responsive ───────────────────────────────────────────────────────────────

export const ResponsiveProps: Story = {
    name: 'Responsive props',
    parameters: {
        layout: 'fullscreen',
        docs: { description: { story: 'Any token prop (and layout props like `flexDir`, `gridTemplateColumns`) accepts a breakpoint object: `{ base, sm, md, lg, xl }`. On web these inject `@media` rules; values cascade up like CSS min-width. Resize the preview.' } },
    },
    render: () => (
        <Chamber p="6" display="flex" flexDir="column" gap="4">
            <Tunnel as="h3" fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold">
                fontSize grows at the md breakpoint
            </Tunnel>
            <Chamber display="grid"
                gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                gap={{ base: '2', md: '4' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <Chamber key={i} bg="interactive.primary" color="text.inverse" p="4" radius="md" textAlign="center" fontWeight="bold">
                        {i + 1}
                    </Chamber>
                ))}
            </Chamber>
            <Tunnel fontSize="sm" color="text.secondary">1 column → 2 (sm) → 4 (lg). Resize the preview.</Tunnel>
        </Chamber>
    ),
}

// ─── pseudo matrix ────────────────────────────────────────────────────────────

export const PseudoMatrix: Story = {
    name: 'Pseudo states',
    render: () => (
        <Chamber display="flex" flexDir="column" gap="4" maxW="480px">
            <Chamber as="button" bg="interactive.primary" color="text.inverse" px="5" py="3" radius="md" fontWeight="semibold"
                _hover={{ bg: 'interactive.primary.hover' }}
                _active={{ opacity: 0.85 }}
                _focusVisible={{ outlineStyle: 'solid', outlineWidth: '3px', outlineColor: 'feedback.info', outlineOffset: '2px' }}
                style={{ cursor: 'pointer' }}>
                Hover · Active · Focus-visible
            </Chamber>
            <Chamber bg="bg.elevated" borderWidth={1} borderColor="border.default" p="4" radius="md"
                _hover={{ borderColor: 'interactive.primary', shadow: 'md' }}>
                <Tunnel>Card that lifts its border + shadow on hover</Tunnel>
            </Chamber>
        </Chamber>
    ),
}

// ─── __debug ──────────────────────────────────────────────────────────────────

export const Debug: Story = {
    name: 'Debug (__debug)',
    parameters: {
        docs: { description: { story: 'Add `__debug` to any Chamber/Tunnel: it outlines the element, exposes a `data-bb-debug="⟳N"` render counter (inspect it in devtools), and logs the resolved styles to a collapsed console group. Open the browser console and look at the elements panel. Dev-only — tree-shaken in production.' } },
    },
    render: () => (
        <Chamber display="flex" flexDir="column" gap="4" maxW="420px">
            <Tunnel color="text.secondary">Outlined in magenta · open the console + inspect <Tunnel as="span" fontFamily="mono">data-bb-debug</Tunnel></Tunnel>
            <Chamber __debug bg="primary.500" color="text.inverse" p="5" radius="lg">
                <Tunnel>Chamber with __debug</Tunnel>
            </Chamber>
            <Tunnel __debug fontSize="lg" fontWeight="bold" color="text.primary">Tunnel with __debug</Tunnel>
        </Chamber>
    ),
}
