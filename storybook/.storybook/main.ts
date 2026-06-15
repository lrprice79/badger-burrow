import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const pkg = (p: string) => fileURLToPath(new URL(`../../packages/${p}/src/index.ts`, import.meta.url))

const config: StorybookConfig = {
    stories: ['../stories/**/*.stories.@(ts|tsx)', '../stories/**/*.mdx'],
    addons: ['@storybook/addon-essentials'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    core: { disableTelemetry: true },
    // Resolve the workspace packages from their SOURCE, not built dist — editing
    // a component reflects in Storybook instantly, and a stale/missing dist can
    // never make Storybook lie.
    viteFinal: async (vite) => {
        vite.resolve = vite.resolve ?? {}
        vite.resolve.alias = {
            ...(vite.resolve.alias as Record<string, string>),
            '@badger-eco/burrow-tokens': pkg('tokens'),
            '@badger-eco/burrow-core': pkg('core'),
            '@badger-eco/burrow-web': pkg('web'),
        }
        return vite
    },
}

export default config
