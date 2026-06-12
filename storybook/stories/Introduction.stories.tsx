import type { Meta, StoryObj } from '@storybook/react'
import { Chamber, Tunnel } from '@badger-burrow/web'

const meta: Meta = {
    title: 'Introduction',
    parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const Welcome: Story = {
    render: () => (
        <Chamber p="8" display="flex" flexDir="column" gap="6" maxW="760px">
            <Chamber display="flex" flexDir="column" gap="2">
                <Tunnel as="h1" fontSize="3xl" fontWeight="bold" color="interactive.primary">BadgerBurrow</Tunnel>
                <Tunnel fontSize="lg" color="text.secondary">
                    Provider-less, token-driven styling for React. Two primitives — <Tunnel as="span" fontFamily="mono">Chamber</Tunnel> (box)
                    and <Tunnel as="span" fontFamily="mono">Tunnel</Tunnel> (text) — backed by a single store.
                </Tunnel>
            </Chamber>

            <Chamber bg="bg.elevated" borderWidth={1} borderColor="border.default" radius="lg" p="5" display="flex" flexDir="column" gap="3">
                <Tunnel fontWeight="semibold">Try the toolbar ↑</Tunnel>
                <Chamber display="flex" flexDir="column" gap="2">
                    <Tunnel color="text.secondary">• <Tunnel as="span" fontWeight="medium" color="text.primary">Mode</Tunnel> — switch the whole UI between light and dark.</Tunnel>
                    <Tunnel color="text.secondary">• <Tunnel as="span" fontWeight="medium" color="text.primary">Theme</Tunnel> — cycle coordinated palettes built from one hex via colour harmonics (primary + harmonic secondary).</Tunnel>
                </Chamber>
            </Chamber>

            <Chamber display="flex" flexDir="column" gap="2">
                <Tunnel fontWeight="semibold">Where to look</Tunnel>
                <Tunnel color="text.secondary">• <Tunnel as="span" fontWeight="medium" color="text.primary">Theme</Tunnel> — colour scales, spacing, type, radii, shadows, light/dark.</Tunnel>
                <Tunnel color="text.secondary">• <Tunnel as="span" fontWeight="medium" color="text.primary">Components</Tunnel> — Chamber & Tunnel playgrounds with every prop as a live control.</Tunnel>
                <Tunnel color="text.secondary">• <Tunnel as="span" fontWeight="medium" color="text.primary">Patterns</Tunnel> — buttons, cards, badges, alerts, lists built from the primitives.</Tunnel>
                <Tunnel color="text.secondary">• <Tunnel as="span" fontWeight="medium" color="text.primary">Features</Tunnel> — motion, smart hover, responsive, pseudo states.</Tunnel>
            </Chamber>
        </Chamber>
    ),
}
