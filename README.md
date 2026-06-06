# BadgerBurrow

> *No ThemeProvider. No Context. No cascade re-renders. Your theme lives in the burrow, not in your component tree.*

BadgerBurrow is a cross-platform utility-prop styling library for React 19 (web) and React Native. It replaces React Context with a provider-less pub/sub store — components subscribe only to what they consume, re-rendering only when their tokens change.

---

## Why BadgerBurrow?

Most styling libraries wrap your entire app in a `ThemeProvider`. Any token change triggers a cascade re-render down the tree. BadgerBurrow sidesteps this entirely:

- **Web:** tokens are injected as CSS Custom Properties on `:root` at init — components use `var()`, zero JS in the render path
- **React Native:** tokens live in a JS singleton, flat memoised `StyleSheet` objects emitted via `useSyncExternalStore`
- **Dark mode** swaps semantic tokens only — primitives never change, and only subscribed components re-render

---

## Primitives

| Component | Role |
|---|---|
| `<Chamber>` | Box / layout primitive (replaces `<Box>`) |
| `<Tunnel>` | Flex / stack primitive (replaces `<Stack>`) |
| `<Quill>` | Typography primitive |
| `<Run>` | Layout-aware link primitive |

---

## Token Architecture

Two-level resolution: **primitive → semantic → usage**

```
primitive.color.primary.500 = '#8b5cf6'
         ↓
semantic.light['color.interactive.primary'] = '{color.primary.500}'
         ↓
<Chamber bg="color.interactive.primary" />  →  var(--bb-color-interactive-primary)
```

Semantic tokens swap on dark mode. Primitives never change. This maps directly to Figma Variables.

---

## Monorepo Structure

```
badger-burrow/
├── packages/
│   ├── tokens/     Token schema + default scales
│   ├── core/       Store, resolver, hooks, variants
│   ├── web/        Chamber, Tunnel, Quill, Run for React 19
│   └── native/     Chamber, Tunnel, Quill for React Native
└── storybook/      Web component stories
```

---

## Packages

### `@badger-burrow/tokens` ✅

Pure TypeScript — no runtime, no React. Defines the `BurrowTokens` interface and ships default scales.

**Token categories:**

| Category | Keys |
|---|---|
| `primitive.color` | `primary`, `secondary`, `neutral`, `success`, `error`, `warning`, `info` — each a full 50–900 scale |
| `primitive.space` | Numeric (`4 → 16px`) and named (`md → 16px`) |
| `primitive.radius` | `none`, `sm`, `md`, `lg`, `xl`, `full` |
| `primitive.fontSize` | `xs` → `3xl` |
| `primitive.fontWeight` | `normal`, `medium`, `semibold`, `bold` |
| `primitive.shadow` | Web (`box-shadow`) + Native (`elevation`) per key |
| `semantic.light` | Light mode token aliases (reference format: `{color.primary.500}`) |
| `semantic.dark` | Dark mode overrides |
| `motion.duration` | `instant`, `fast`, `normal`, `slow`, `glacial` |
| `motion.easing` | `standard`, `decelerate`, `accelerate`, `sharp` |
| `motion.spring` | `bouncy`, `gentle`, `stiff` (Reanimated-compatible) |
| `breakpoints` | `sm`, `md`, `lg`, `xl` |

### `@badger-burrow/core` 🔜

Pub/sub store, semantic token resolver, CSS Custom Property injection, `useBurrow` hook, `variants()` utility.

### `@badger-burrow/web` 🔜

React 19 primitives: `Chamber`, `Tunnel`, `Quill`, `Run`. Responsive object syntax, hashed classNames, `__debug` overlay.

### `@badger-burrow/native` 🔜

React Native primitives: same API, flat `StyleSheet` output, breakpoints via `useWindowDimensions`.

---

## Responsive Syntax

```tsx
<Chamber
  padding={{ base: 'sm', md: 'md', lg: 'lg' }}
  bg="color.bg.surface"
/>
```

---

## Token Customisation

### Extending the default tokens

```ts
import { extendBurrow } from '@badger-burrow/core'

const myTokens = extendBurrow({
  primitive: {
    color: {
      primary: generateScale('#ff6b35'),   // replaces default purple scale
      secondary: generateScale('#06b6d4'), // replaces default teal scale
    }
  }
})
```

### Generating a colour scale from any hex value

`generateScale` takes any hex colour and returns a full 50–900 scale using perceptually uniform OKLCH spacing — no external dependencies.

```ts
import { extendBurrow } from '@badger-burrow/core'
import { generateScale } from '@badger-burrow/tokens'

const myTokens = extendBurrow({
  primitive: {
    color: {
      primary:   generateScale('#ff6b35'),                      // anchor at 500 (default)
      secondary: generateScale('#06b6d4', { anchor: 400 }),    // anchor at a custom shade
      neutral:   generateScale('#6b7280', { format: 'hsl' }),  // output as hsl(...) strings
    }
  }
})
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `anchor` | `50 \| 100 \| … \| 900` | `500` | Which shade the input hex maps to |
| `format` | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'` | `'hex'` | Output colour format |

---

## Link Component

`<Run>` is BadgerBurrow's layout-aware link primitive. Register your router's link component once at init and it's available everywhere:

```ts
import { Link } from 'react-router-dom' // or expo-router, next/link, etc.

createBurrow({ linkComponent: Link, tokens: myTokens })
```

```tsx
<Run to="/dashboard" padding="md" color="color.interactive.primary">
  Dashboard
</Run>
```

Falls back to `<a>` when no `linkComponent` is registered. Logs a dev warning if `to` is passed without one.

---

## Dark Mode

```ts
import { useBurrow } from '@badger-burrow/core'

const { mode, setMode } = useBurrow()
setMode('dark') // swaps semantic tokens, re-renders only subscribed components
```

Dark mode is auto-detected from `prefers-color-scheme` on init and can be overridden at any time.

---

## Dev Tools

```tsx
<Chamber __debug padding="md" bg="color.bg.surface">
  Content
</Chamber>
```

The `__debug` prop renders a dev-only overlay showing resolved token values, re-render count, and bounding box. Stripped in production via `process.env.NODE_ENV` dead-code elimination.

---

## Status

| Phase | Package | Status |
|---|---|---|
| 1–2 | `packages/tokens` | ✅ Complete — schema, default scales, `generateScale` |
| 3 | `packages/core` | 🔜 Next |
| 3 | `packages/web` | 🔜 Planned |
| 4 | `packages/native` | 🔜 Planned |
| 5 | `badger-sync` CLI | 🔜 Planned (v1) |
