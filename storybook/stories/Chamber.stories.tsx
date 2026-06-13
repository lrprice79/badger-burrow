import type { Meta, StoryObj } from '@storybook/react'
import { Chamber, Tunnel } from '@badger-burrow/web'
import { chamberArgTypes } from './_controls'

const meta: Meta<typeof Chamber> = {
    title: 'Components/Chamber',
    component: Chamber,
    argTypes: chamberArgTypes as never,
    parameters: {
        docs: {
            description: {
                component:
                    'The box primitive. Renders a `<div>` by default, or any element via `as`. Every token prop below is a live control — change them and watch the box update.',
            },
        },
    },
}
export default meta
type Story = StoryObj<typeof Chamber>

// ─── interactive playground ───────────────────────────────────────────────────

export const Playground: Story = {
    parameters: {
        docs: { description: { story: 'The live sandbox. Each control is a real prop: token dropdowns (`bg`, `p`, `radius`, `shadow`…) take short-form token values, `as` switches the rendered element. Numbers like `borderWidth` are raw pixels.' } },
    },
    args: {
        bg: 'bg.elevated',
        color: 'text.primary',
        p: '6',
        radius: 'lg',
        shadow: 'md',
        borderWidth: 0,
        opacity: 1,
        children: 'Edit my props in the Controls panel →',
    },
}

// ─── as prop — every supported element ────────────────────────────────────────

export const Elements: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="3">
            {(['div', 'section', 'article', 'header', 'footer', 'main', 'nav', 'button', 'a', 'ul', 'li', 'label'] as const).map((tag) => (
                <Chamber
                    key={tag}
                    as={tag}
                    {...(tag === 'a' ? { href: '#' } : {})}
                    bg="bg.elevated"
                    borderWidth={1}
                    borderColor="border.default"
                    px="4"
                    py="3"
                    radius="md"
                >
                    <Tunnel fontFamily="mono" fontSize="sm">{`<Chamber as="${tag}" />`}</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── spacing scale ────────────────────────────────────────────────────────────

export const Padding: Story = {
    render: () => (
        <Chamber display="flex" gap="4" align="flex-start" wrap="wrap">
            {(['2', '4', '6', '8', '12'] as const).map((p) => (
                <Chamber key={p} bg="interactive.primary" p={p} radius="md">
                    <Chamber bg="bg.surface" px="2" py="1" radius="sm">
                        <Tunnel fontSize="sm">p="{p}"</Tunnel>
                    </Chamber>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── radius + shadow ──────────────────────────────────────────────────────────

export const RadiusAndShadow: Story = {
    render: () => (
        <Chamber display="flex" gap="6" wrap="wrap">
            {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((r) => (
                <Chamber key={r} bg="bg.elevated" w="96px" h="96px" radius={r} shadow="md"
                    display="flex" align="center" justify="center">
                    <Tunnel fontSize="sm" fontFamily="mono">{r}</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── flex layout ──────────────────────────────────────────────────────────────

export const FlexLayout: Story = {
    render: () => (
        <Chamber display="flex" flexDir="column" gap="6">
            {(['flex-start', 'center', 'flex-end', 'space-between'] as const).map((justify) => (
                <Chamber key={justify} display="flex" justify={justify} align="center" gap="2"
                    bg="bg.elevated" p="3" radius="md" borderWidth={1} borderColor="border.default" h="72px">
                    {[1, 2, 3].map((n) => (
                        <Chamber key={n} bg="interactive.primary" w="48px" h="48px" radius="sm" />
                    ))}
                    <Tunnel fontSize="xs" color="text.secondary" fontFamily="mono">justify="{justify}"</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── grid layout ──────────────────────────────────────────────────────────────

export const GridLayout: Story = {
    render: () => (
        <Chamber display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="3">
            {Array.from({ length: 8 }).map((_, i) => (
                <Chamber key={i} bg={i % 2 ? 'interactive.primary' : 'interactive.secondary'}
                    h="64px" radius="md" display="flex" align="center" justify="center">
                    <Tunnel color="text.inverse" fontWeight="bold">{i + 1}</Tunnel>
                </Chamber>
            ))}
        </Chamber>
    ),
}

// ─── pseudo states ────────────────────────────────────────────────────────────

export const PseudoStates: Story = {
    name: 'Pseudo states (hover / focus / disabled)',
    render: () => (
        <Chamber display="flex" gap="4" wrap="wrap">
            <Chamber as="button" bg="interactive.primary" color="text.inverse" px="5" py="3" radius="md"
                _hover={{ bg: 'interactive.primary.hover', cursor: 'pointer' }}>
                Hover me (auto-darkens)
            </Chamber>
            <Chamber as="button" bg="interactive.primary" color="text.inverse" px="5" py="3" radius="md"
                _focusVisible={{ outlineStyle: 'solid', outlineWidth: '3px', outlineColor: 'feedback.info', outlineOffset: '2px' }}>
                Tab to me (focus ring)
            </Chamber>
            <Chamber as="button" aria-disabled bg="interactive.primary" color="text.inverse" px="5" py="3" radius="md"
                opacity={0.4} style={{ cursor: 'not-allowed' }}>
                Disabled
            </Chamber>
        </Chamber>
    ),
}

// ─── responsive ───────────────────────────────────────────────────────────────

export const Responsive: Story = {
    name: 'Responsive (resize the viewport)',
    render: () => (
        <Chamber
            bg="bg.elevated" p="6" radius="lg" borderWidth={1} borderColor="border.default"
            display="flex" flexDir={{ base: 'column', md: 'row' }} gap={{ base: '2', md: '6' }}
            align={{ base: 'stretch', md: 'center' }}>
            {[1, 2, 3].map((n) => (
                <Chamber key={n} bg="interactive.primary" color="text.inverse" p="4" radius="md" flex="1"
                    textAlign="center">
                    <Tunnel fontWeight="bold">Item {n}</Tunnel>
                </Chamber>
            ))}
            <Tunnel fontSize="sm" color="text.secondary">column on mobile → row from md up</Tunnel>
        </Chamber>
    ),
    parameters: { layout: 'fullscreen' },
}
