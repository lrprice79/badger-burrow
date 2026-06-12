/**
 * Shared Storybook argTypes — token-aware select controls so every prop is
 * changeable from the Controls panel with the real short-form token values.
 */

const colorOptions = [
    'text.primary', 'text.secondary', 'text.inverse',
    'bg.surface', 'bg.elevated', 'bg.overlay',
    'interactive.primary', 'interactive.primary.hover',
    'interactive.secondary',
    'border.default',
    'feedback.success', 'feedback.error', 'feedback.warning', 'feedback.info',
    'primary.50', 'primary.100', 'primary.300', 'primary.500', 'primary.700', 'primary.900',
    'neutral.100', 'neutral.500', 'neutral.900',
]

const spaceOptions = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', 'sm', 'md', 'lg', 'xl']
const radiusOptions = ['none', 'sm', 'md', 'lg', 'xl', 'full']
const fontSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
const fontWeightOptions = ['normal', 'medium', 'semibold', 'bold']
const lineHeightOptions = ['tight', 'normal', 'relaxed']
const letterSpacingOptions = ['tight', 'normal', 'wide', 'wider']
const shadowOptions = ['none', 'sm', 'md', 'lg']
const displayOptions = ['block', 'flex', 'inline-flex', 'grid', 'none']
const flexDirOptions = ['row', 'column', 'row-reverse', 'column-reverse']
const alignOptions = ['flex-start', 'center', 'flex-end', 'stretch', 'baseline']
const justifyOptions = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']

const sel = (options: string[], category: string) => ({
    control: 'select' as const,
    options: [undefined, ...options],
    table: { category },
})

/** Box (Chamber) controls. */
export const chamberArgTypes = {
    bg: sel(colorOptions, 'Background'),
    color: sel(colorOptions, 'Typography'),
    p: sel(spaceOptions, 'Spacing'),
    px: sel(spaceOptions, 'Spacing'),
    py: sel(spaceOptions, 'Spacing'),
    m: sel(spaceOptions, 'Spacing'),
    gap: sel(spaceOptions, 'Layout'),
    w: { control: 'text', table: { category: 'Size' } },
    h: { control: 'text', table: { category: 'Size' } },
    maxW: { control: 'text', table: { category: 'Size' } },
    radius: sel(radiusOptions, 'Border'),
    borderWidth: { control: { type: 'number', min: 0, max: 8 }, table: { category: 'Border' } },
    borderColor: sel(colorOptions, 'Border'),
    borderStyle: { control: 'select', options: [undefined, 'solid', 'dashed', 'dotted'], table: { category: 'Border' } },
    shadow: sel(shadowOptions, 'Effects'),
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, table: { category: 'Effects' } },
    display: sel(displayOptions, 'Layout'),
    flexDir: sel(flexDirOptions, 'Layout'),
    align: sel(alignOptions, 'Layout'),
    justify: sel(justifyOptions, 'Layout'),
    fontSize: sel(fontSizeOptions, 'Typography'),
    fontWeight: sel(fontWeightOptions, 'Typography'),
    as: { control: 'select', options: ['div', 'section', 'button', 'a', 'nav', 'header', 'footer', 'main', 'article', 'ul', 'li', 'label'], table: { category: 'Element' } },
}

/** Text (Tunnel) controls. */
export const tunnelArgTypes = {
    as: { control: 'select', options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label'], table: { category: 'Element' } },
    color: sel(colorOptions, 'Colour'),
    fontSize: sel(fontSizeOptions, 'Font'),
    fontWeight: sel(fontWeightOptions, 'Font'),
    lineHeight: sel(lineHeightOptions, 'Font'),
    letterSpacing: sel(letterSpacingOptions, 'Font'),
    italic: { control: 'boolean', table: { category: 'Font' } },
    textAlign: { control: 'select', options: [undefined, 'left', 'center', 'right', 'justify'], table: { category: 'Layout' } },
    textTransform: { control: 'select', options: [undefined, 'none', 'uppercase', 'lowercase', 'capitalize'], table: { category: 'Layout' } },
    truncate: { control: 'boolean', table: { category: 'Layout' } },
    lineClamp: { control: { type: 'number', min: 0, max: 6 }, table: { category: 'Layout' } },
}

export const TOKENS = {
    colorOptions, spaceOptions, radiusOptions, fontSizeOptions,
    fontWeightOptions, lineHeightOptions, shadowOptions,
}
