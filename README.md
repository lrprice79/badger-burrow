# BadgerBurrow

> *No ThemeProvider. No Context. No cascade re-renders. Your theme lives in the burrow, not in your component tree.*

We dug deep so you don't have to.

BadgerBurrow is a styling library for React (web) and React Native. You style your components using props directly on them — like `p={4}` for padding or `bg="color.interactive.primary"` for background — and your design tokens (colours, spacing, typography) are managed in one central place without wrapping your app in a provider.

---

## Why BadgerBurrow?

Most styling libraries make you wrap your entire app in a `ThemeProvider` component. The problem is that whenever your theme changes (like switching to dark mode), it causes every component in your app to re-render, even ones that haven't changed. This gets slow in large apps. It's a lot of fuss for something that should just *burrow quietly in the background*.

BadgerBurrow works differently:

- **On the web** — your colours and spacing are set as CSS variables once when the app loads. Components just read those variables. No JavaScript runs during rendering.
- **In React Native** — your tokens live in a single shared object. Components only update when the specific token they use actually changes.
- **Dark mode** — only the components that use a colour that changed will re-render. Everything else stays untouched.

---

## Components

BadgerBurrow gives you a small set of building-block components to lay out your UI:

| Component | What it does |
|---|---|
| `<Chamber>` | A box — use it for any block-level container (like a `<div>`) |
| `<Tunnel>` | A flex row or column — use it to stack or line up children |
| `<Quill>` | A text component |
| `<Run>` | A link component that works with any router (React Router, Expo Router, Next.js, etc.) |

---

## How tokens work

Tokens are just named values for things like colours, spacing, and font sizes. BadgerBurrow has two layers:

**Primitive tokens** — the raw values. These never change.
```
color.primary.500 = '#8b5cf6'   ← an actual hex colour
space.4 = 16                     ← 16px
```

**Semantic tokens** — names that describe what a value is *for*, pointing at a primitive. These swap on dark mode.
```
color.interactive.primary  →  points to  color.primary.500
```

When you use a semantic token in a component, BadgerBurrow resolves it to the real value automatically:

```
color.primary.500 = '#8b5cf6'
         ↓
color.interactive.primary = '{color.primary.500}'
         ↓
<Chamber bg="color.interactive.primary" />  →  var(--bb-color-interactive-primary)
```

This means you can switch dark mode on and only the semantic layer updates — the raw colours stay the same.

---

## Project structure

```
badger-burrow/
├── packages/
│   ├── tokens/     Colours, spacing, typography, motion — the design foundation
│   ├── core/       The store that holds your tokens, the hook to read them, and utilities
│   ├── web/        The Chamber, Tunnel, Quill, Run components for React web
│   └── native/     The same components for React Native
└── storybook/      Interactive examples of all web components
```

---

## Packages

### `@badger-burrow/tokens` ✅

This package holds all the default design values — colours, spacing, border radii, font sizes, shadows, and animation settings. It is pure TypeScript with no React dependency, so you can use it anywhere.

**What's included by default:**

| Category | What it contains |
|---|---|
| `primitive.color` | 7 colour scales (`primary`, `secondary`, `neutral`, `success`, `error`, `warning`, `info`) — each with 10 shades from 50 (lightest) to 900 (darkest) |
| `primitive.space` | Spacing values — use numbers (`p={4}` = 16px) or names (`p="md"` = 16px) |
| `primitive.radius` | Border radius — `none`, `sm`, `md`, `lg`, `xl`, `full` |
| `primitive.fontSize` | Font sizes from `xs` to `3xl` |
| `primitive.fontWeight` | `normal`, `medium`, `semibold`, `bold` |
| `primitive.shadow` | Box shadows for web and elevation for React Native |
| `semantic.light` | What each colour *means* in light mode (e.g. what colour is a button?) |
| `semantic.dark` | The same meanings remapped for dark mode |
| `motion.duration` | Animation speeds — `instant`, `fast`, `normal`, `slow`, `glacial` |
| `motion.easing` | Animation curves — `standard`, `decelerate`, `accelerate`, `sharp` |
| `motion.spring` | Spring physics configs for Reanimated — `bouncy`, `gentle`, `stiff` |
| `breakpoints` | Screen size breakpoints — `sm`, `md`, `lg`, `xl` |

### `@badger-burrow/core` 🔜

The engine. Holds your tokens in a central store, exposes the `useBurrow` hook so components can read tokens, and provides utilities like `extendBurrow` (for customising tokens) and `variants` (for defining component variants).

### `@badger-burrow/web` 🔜

The `Chamber`, `Tunnel`, `Quill`, and `Run` components for React web. Supports responsive props, hashed class names for breakpoints, and a `__debug` overlay in development.

### `@badger-burrow/native` 🔜

The same components built for React Native. Produces flat `StyleSheet` objects instead of CSS, and handles breakpoints via `useWindowDimensions`.

---

## Framework compatibility

BadgerBurrow is built on standard React with no framework-specific code, so it works anywhere React runs.

**Web frameworks:**

| Framework | Supported | Notes |
|---|---|---|
| Next.js (App Router) | ✅ | Call `digBurrow()` inside a `'use client'` component at your app root — not directly in `layout.tsx` |
| Next.js (Pages Router) | ✅ | Call `digBurrow()` in `_app.tsx` |
| Vite + React | ✅ | Call `digBurrow()` in your entry file |
| Remix | ✅ | Call `digBurrow()` in your root component |
| Gatsby | ✅ | Call `digBurrow()` in `gatsby-browser.js` |
| Astro (React islands) | ✅ | Works inside React island components |

**Mobile:**

| Framework | Supported | Notes |
|---|---|---|
| Expo | ✅ | Primary mobile target |
| React Native CLI | ✅ | Bare React Native without Expo |

**Not supported:**

| Framework | Reason |
|---|---|
| Vue / Svelte / Angular | React only |
| Server Components (RSC) | The store is client-side only. Full server-side rendering support is planned for v1.1. |

> **Next.js App Router tip:** wrap your `digBurrow()` call in a small `BurrowProvider.tsx` client component and import it into your root `layout.tsx`. That's all it takes — the rest of your app can stay server components.

---

## Responsive props

You can pass different values for different screen sizes using an object:

```tsx
<Chamber
  padding={{ base: 'sm', md: 'md', lg: 'lg' }}
  bg="color.bg.surface"
/>
```

`base` applies at all sizes, then `md` kicks in at medium screens and `lg` at large.

---

## Customising your tokens

### Swapping the default colours

The default theme uses purple as the primary colour and teal as the secondary. To use your own brand colours, pass them to `extendBurrow`. Everything built on top of those colours (semantic tokens, dark mode) updates automatically — you don't need to change anything else.

```ts
import { extendBurrow } from '@badger-burrow/core'
import { generateScale } from '@badger-burrow/tokens'

const myTokens = extendBurrow({
  primitive: {
    color: {
      primary:   generateScale('#ff6b35'),  // your brand colour — replaces purple
      secondary: generateScale('#06b6d4'),  // your secondary colour — replaces teal
    }
  }
})
```

### Generating a colour scale from any hex value

Pass any hex colour to `generateScale` and it will automatically dig out a full range of 10 shades — from very light (50) to very dark (900). The shades are calculated using a perceptually uniform colour model, which means they look evenly spaced to the human eye rather than just mathematically spaced.

The colour you pass in becomes the `500` shade by default (the mid-point), and lighter/darker shades are generated around it.

```ts
import { generateScale } from '@badger-burrow/tokens'

generateScale('#ff6b35')
// returns: { 50: '#fff4f0', 100: '#ffe3d8', ..., 500: '#ff6b35', ..., 900: '#4a1500' }
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `anchor` | `50 \| 100 \| … \| 900` | `500` | Which shade your input colour maps to. Use a higher number if your colour is already dark, lower if it is already light. |
| `format` | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'` | `'hex'` | The format of the colour strings in the returned scale |

```ts
// Your colour is naturally a light shade — anchor it at 200 instead of 500
generateScale('#fcd34d', { anchor: 200 })

// Get the scale back as hsl() strings instead of hex
generateScale('#ff6b35', { format: 'hsl' })
```

### Finding colours that go well together

If you have a primary colour and want to find other colours that will look good alongside it, use `generateHarmonics`. It uses colour theory to calculate colours that have a known harmonic relationship with your input — so you are not guessing which shades match.

```ts
import { generateHarmonics, generateScale } from '@badger-burrow/tokens'
import { extendBurrow } from '@badger-burrow/core'

const harmonics = generateHarmonics('#8B5CF6')

// Each harmonic is already a full scale — drop it straight into your tokens
extendBurrow({
  primitive: {
    color: {
      primary:    generateScale('#8B5CF6'),
      complement: harmonics.complementary,  // the colour directly opposite on the wheel
      accent:     harmonics.analogous[0],   // a colour sitting next to yours on the wheel
    }
  }
})
```

**The five harmonic relationships:**

| Key | What it means | When to use it |
|---|---|---|
| `complementary` | The colour directly opposite yours on the colour wheel | Strong contrast — great for call-to-action buttons against a coloured background |
| `analogous` | Two colours sitting either side of yours on the wheel | Feels natural and cohesive — good for a secondary brand colour |
| `triadic` | Two colours equally spaced around the wheel from yours | Vibrant and energetic — good for data visualisation or playful UIs |
| `splitComplementary` | Two colours flanking the complement | Similar contrast to complementary but less intense — a safer choice |
| `tetradic` | Three colours evenly spaced around the wheel | Rich multi-colour palette — best for complex UIs with lots of distinct sections |

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `scales` | `boolean` | `true` | `true` returns full 50–900 scales ready to use. `false` returns just the anchor hex string for each harmonic, which you can pass into `generateScale` yourself. |
| `anchor` | `50 \| 100 \| … \| 900` | `500` | Which shade each harmonic colour maps to |
| `format` | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'` | `'hex'` | Output colour format |

---

## Link component

`<Run>` works with any routing library. Tell BadgerBurrow which link component to use once at startup and it handles the rest:

```ts
import { Link } from 'react-router-dom' // or expo-router, next/link, etc.

createBurrow({ linkComponent: Link, tokens: myTokens })
```

Then use `<Run>` anywhere in your app with the same styling props as `<Chamber>`:

```tsx
<Run to="/dashboard" p="md" color="color.interactive.primary">
  Go to dashboard
</Run>
```

If no link component is registered, `<Run>` falls back to a plain `<a>` tag and will warn you in development if you use `to` without registering a component first.

---

## Dark mode

Dark mode is detected automatically from the user's system preference when your app loads. You can also switch it manually at any time:

```ts
import { useBurrow } from '@badger-burrow/core'

const { mode, setMode } = useBurrow()

setMode('dark')   // switch to dark mode
setMode('light')  // switch back
```

Only the components that actually use a colour that changed will re-render. Everything else is left alone.

---

## Debug overlay

Nobody likes a mysterious sett. Add `__debug` to any component during development to see a live overlay showing which tokens are applied, how many times the component has re-rendered, and its dimensions on screen:

```tsx
<Chamber __debug p="md" bg="color.bg.surface">
  Content
</Chamber>
```

The overlay is automatically removed from production builds — it adds no size or overhead to your shipped app.

---

## Status

| Phase | Package | Status |
|---|---|---|
| 1–2 | `packages/tokens` | ✅ Complete — colour scales, `generateScale`, `generateHarmonics` |
| 3 | `packages/core` | 🔜 Next |
| 4 | `packages/web` | 🔜 Planned |
| 5 | `packages/native` | 🔜 Planned |
| 6 | `badger-sync` Figma CLI | 🔜 Planned (v1) |
