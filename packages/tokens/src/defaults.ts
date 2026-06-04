import type { BurrowTokens } from './schema'
import { palette } from './palette'
import { defaultMotion } from './motion'

export const defaultTokens: BurrowTokens = {
  primitive: {
    color: palette,
    space: {
      0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20,
      6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
      sm: 8, md: 16, lg: 24, xl: 32,
    },
    radius: { none: 0, sm: 4, md: 8, lg: 16, xl: 24, full: 9999 },
    fontSize: { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, '2xl': 32, '3xl': 40 },
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
    letterSpacing: { tight: -0.5, normal: 0, wide: 0.5, wider: 1 },
    fontFamily: { sans: 'system-ui, sans-serif', mono: 'monospace' },
    shadow: {
      none: {
        web: 'none',
        native: { elevation: 0, shadowColor: '#000', shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 } },
      },
      sm: {
        web: '0px 1px 3px rgba(0,0,0,0.12)',
        native: { elevation: 2, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
      },
      md: {
        web: '0px 4px 12px rgba(0,0,0,0.15)',
        native: { elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      },
      lg: {
        web: '0px 8px 24px rgba(0,0,0,0.2)',
        native: { elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      },
    },
  },
  semantic: {
    light: {
      'color.interactive.primary': '{color.teal.500}',
      'color.interactive.primary.hover': '{color.teal.400}',
      'color.interactive.secondary': '{color.lavBlue.400}',
      'color.bg.surface': '#ffffff',
      'color.bg.elevated': '#f8f8ff',
      'color.bg.overlay': 'rgba(0,0,0,0.5)',
      'color.text.primary': '{color.blue.900}',
      'color.text.secondary': '{color.gray.500}',
      'color.text.inverse': '#ffffff',
      'color.border.default': '{color.gray.200}',
    },
    dark: {
      'color.interactive.primary': '{color.teal.400}',
      'color.interactive.primary.hover': '{color.teal.300}',
      'color.interactive.secondary': '{color.lavBlue.300}',
      'color.bg.surface': '#1a1a2e',
      'color.bg.elevated': '#16213e',
      'color.bg.overlay': 'rgba(0,0,0,0.7)',
      'color.text.primary': '#f8f8ff',
      'color.text.secondary': '{color.gray.300}',
      'color.text.inverse': '{color.blue.900}',
      'color.border.default': '{color.gray.700}',
    },
  },
  motion: defaultMotion,
  breakpoints: { sm: '576px', md: '768px', lg: '992px', xl: '1200px' },
}
