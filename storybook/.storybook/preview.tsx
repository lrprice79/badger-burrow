import React, { useEffect } from 'react'
import type { Preview, Decorator } from '@storybook/react'
import { Chamber } from '@badger-eco/burrow-web'
import { THEMES, applyTheme } from './themes'

const withBurrowTheme: Decorator = (Story, context) => {
    const mode = (context.globals.mode ?? 'light') as 'light' | 'dark'
    const theme = (context.globals.theme ?? 'badger') as string

    // Apply on mount and whenever the toolbar changes. Components subscribed via
    // useBurrow re-render from the store notification — no provider needed.
    useEffect(() => {
        applyTheme(theme, mode)
    }, [mode, theme])

    // Apply synchronously for the very first paint too (before effect runs).
    applyTheme(theme, mode)

    return (
        <Chamber
            data-theme={mode}
            bg="bg.surface"
            color="text.primary"
            p="6"
            style={{ minHeight: '100vh', boxSizing: 'border-box' }}
        >
            <Story />
        </Chamber>
    )
}

const preview: Preview = {
    parameters: {
        controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
        options: {
            storySort: {
                order: [
                    'Introduction',
                    'Theme',
                    ['Token Naming', 'Light & Dark', 'Theme Palette', 'Colour Harmonics', 'Harmonics Explorer', 'Colour Scales', 'Spacing', 'Typography', 'Radii', 'Shadows'],
                    'Components',
                    ['Chamber', 'Tunnel'],
                    'Patterns',
                    'Features',
                ],
            },
        },
    },
    globalTypes: {
        mode: {
            description: 'Light / dark colour mode',
            defaultValue: 'light',
            toolbar: {
                title: 'Mode',
                icon: 'circlehollow',
                items: [
                    { value: 'light', title: 'Light', icon: 'sun' },
                    { value: 'dark', title: 'Dark', icon: 'moon' },
                ],
                dynamicTitle: true,
            },
        },
        theme: {
            description: 'Theme — a brand hex + harmony, building primary & secondary scales',
            defaultValue: 'default',
            toolbar: {
                title: 'Theme',
                icon: 'paintbrush',
                items: THEMES.map((t) => ({ value: t.key, title: t.title })),
                dynamicTitle: true,
            },
        },
    },
    decorators: [withBurrowTheme],
}

export default preview
