# BadgerBurrow

> *No ThemeProvider. No Context. No cascade re-renders. Your theme lives in the burrow.*

A styling library for React (web) and React Native. Style components with props backed by design tokens — colours, spacing, typography — managed in a single central store. No provider wrapping your app. No unnecessary re-renders.

---

## Why BadgerBurrow?

Every major styling library makes you wrap your app in a `ThemeProvider`. When the theme changes, every component below it re-renders — even ones that didn't change. In large apps this gets slow.

BadgerBurrow works differently:

- **No provider** — call `extendBurrow()` once at startup. That's it.
- **No Context** — the store is a plain pub/sub singleton. Components subscribe directly.
- **Selective re-renders** — only components that call `useBurrow()` re-render on theme changes. Everything else is untouched.
- **Two-layer tokens** — semantic tokens point to primitives. Dark mode swaps the semantic layer only.

---

## Packages

```
badger-burrow/
├── packages/tokens   Design foundation — colours, spacing, typography, motion
├── packages/core     Store, hook, utilities — no React dependency
├── packages/web      Chamber + Tunnel components for React web
└── packages/native   Chamber + Tunnel for React Native  (coming soon)
```

---

## Quick start

```tsx
// entry file — call once, no wrapper needed
import { extendBurrow } from '@badger-burrow/core'

extendBurrow({
  primitive: {
    color: {
      primary: { 500: '#744577' }
    }
  }
})
```

```tsx
// any component, anywhere in the tree
import { Chamber, Tunnel } from '@badger-burrow/web'

function Card() {
  return (
    <Chamber
      bg="color.bg.surface"
      p="space.4"
      radius="radius.md"
      shadow="md"
      display="flex"
      flexDir="column"
      gap="space.2"
    >
      <Tunnel as="h2" fontSize="fontSize.xl" fontWeight="fontWeight.bold" color="color.text.primary">
        Budget Summary
      </Tunnel>
      <Tunnel color="color.text.secondary" fontSize="fontSize.sm">
        Updated today
      </Tunnel>
    </Chamber>
  )
}
```

---

## `@badger-burrow/tokens`

The design foundation. Pure TypeScript — no React dependency.

### Default token structure

| Category | Contents |
|---|---|
| `primitive.color` | 7 colour scales — `primary`, `secondary`, `neutral`, `success`, `error`, `warning`, `info` — each with 10 shades (50–900) |
| `primitive.space` | Spacing scale — numeric keys (`0`–`16`) and named keys (`sm`, `md`, `lg`, `xl`) |
| `primitive.radius` | Border radii — `none`, `sm`, `md`, `lg`, `xl`, `full` |
| `primitive.fontSize` | `xs` → `3xl` |
| `primitive.fontWeight` | `normal`, `medium`, `semibold`, `bold` |
| `primitive.lineHeight` | `tight`, `normal`, `relaxed` |
| `primitive.letterSpacing` | `tight`, `normal`, `wide`, `wider` |
| `primitive.fontFamily` | `sans`, `mono` |
| `primitive.shadow` | `none`, `sm`, `md`, `lg` — each with `web` (CSS string) and `native` (elevation object) variants |
| `semantic.light` | What each colour means in light mode |
| `semantic.dark` | The same meanings remapped for dark mode |
| `motion.duration` | `instant`, `fast`, `normal`, `slow`, `glacial` |
| `motion.easing` | `standard`, `decelerate`, `accelerate`, `sharp` |
| `motion.spring` | Spring configs for Reanimated — `bouncy`, `gentle`, `stiff` |
| `breakpoints` | `sm`, `md`, `lg`, `xl` |

### Generating a colour scale

```ts
import { generateScale } from '@badger-burrow/tokens'

generateScale('#744577')
// → { 50: '#f9f0f7', 100: '...', ..., 500: '#744577', ..., 900: '...' }
```

Options: `anchor` (which shade your hex maps to, default `500`) and `format` (`'hex' | 'rgb' | 'hsl' | 'oklch'`).

### Finding harmonious colours

```ts
import { generateHarmonics } from '@badger-burrow/tokens'

const harmonics = generateHarmonics('#744577')
// harmonics.complementary — colour directly opposite on the wheel
// harmonics.analogous[0]  — colour sitting next to yours
// harmonics.triadic        — two equally spaced colours
// harmonics.splitComplementary
// harmonics.tetradic
```

Each value is a ready-to-use colour scale. Drop straight into `extendBurrow`.

---

## `@badger-burrow/core`

The engine. No React dependency — usable in any TypeScript project.

### Store — `BadgerBase`

```ts
import { BadgerBase } from '@badger-burrow/core'

BadgerBase.getTokens()        // current BurrowTokens
BadgerBase.setTokens(tokens)  // replace token set, notifies all subscribers
BadgerBase.getMode()          // 'light' | 'dark'
BadgerBase.setMode('dark')    // switch mode, notifies subscribers
BadgerBase.subscribe(fn)      // returns unsubscribe function
BadgerBase.getSnapshot()      // stable reference for useSyncExternalStore
```

### Extending tokens — `extendBurrow`

Deep-merges a partial override onto `defaultTokens`, stores the result, and notifies all subscribers. Never mutates `defaultTokens`.

```ts
import { extendBurrow } from '@badger-burrow/core'

extendBurrow({
  primitive: {
    color: { primary: { 500: '#744577' } },
    radius: { md: 12 },
  },
  semantic: {
    light: { 'color.bg.surface': '#faf9fb' },
  },
})
```

### Variants — `createVariants`

Map named variant keys to token-backed styles.

```ts
import { createVariants } from '@badger-burrow/core'

const size = createVariants({
  sm: { padding: 'space.2', fontSize: 'fontSize.sm' },
  md: { padding: 'space.4', fontSize: 'fontSize.md' },
  lg: { padding: 'space.6', fontSize: 'fontSize.lg' },
})

const { tokens, mode } = useBurrow()
const styles = size('md', tokens, mode)
// → { padding: 16, fontSize: 14 }
```

### Token resolution — `resolveToken`

```ts
import { resolveToken } from '@badger-burrow/core'

resolveToken('color.interactive.primary', tokens, 'light')
// → '#744577'  (resolves semantic → primitive)

resolveToken('space.4', tokens)
// → 16
```

### CSS variables — web only

```ts
import { injectCssVars, removeCssVars, buildCssVarMap } from '@badger-burrow/core'

injectCssVars(tokens, 'light')           // injects --badger-* on :root
injectCssVars(tokens, 'dark', element)   // scoped to an element
removeCssVars()                          // cleans up
```

### Token-aware sx resolution — `resolveSx`

```ts
import { resolveSx } from '@badger-burrow/core'

resolveSx({ padding: 'space.4', cursor: 'pointer' }, tokens, 'light')
// → { padding: '16px', cursor: 'pointer' }
```

### Prop interfaces

All Chamber and Tunnel prop types are exported from core so `packages/native` can reuse them:

```ts
import type {
  BurrowBoxProps,   // all Chamber props
  BurrowTextProps,  // all Tunnel props
  // composable sub-groups:
  BackgroundProps, PaddingProps, MarginProps, SizeProps,
  LayoutProps, GridProps, InsetProps, BorderProps,
  EffectProps, PositionProps, InteractionProps,
  TransitionProps, AnimationProps, ScrollProps,
  FontProps, TextLayoutProps, TextHelperProps,
} from '@badger-burrow/core'
```

---

## `@badger-burrow/web`

React components for web. Requires React 18+.

### `useBurrow`

```tsx
import { useBurrow } from '@badger-burrow/web'

function ThemeToggle() {
  const { tokens, mode, setMode } = useBurrow()

  return (
    <button
      style={{ color: tokens.primitive.color.primary[500] }}
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      Switch to {mode === 'light' ? 'dark' : 'light'} mode
    </button>
  )
}
```

Uses `useSyncExternalStore` under the hood. No provider needed.

### `Chamber` — styled box

A `<div>` with token-aware shorthand props. All standard HTML div props pass through.

**Style priority (lowest → highest):** `sx` → named props → `style`

```tsx
<Chamber
  bg="color.bg.surface"
  p="space.4"
  px="space.6"
  radius="radius.md"
  shadow="md"
  display="flex"
  flexDir="row"
  align="center"
  justify="space-between"
  gap="space.3"
  w="100%"
  maxW={600}
  transition="all 0.2s ease"
  sx={{ cursor: 'pointer' }}
  style={{ border: '1px solid red' }}
>
  content
</Chamber>
```

#### Full prop reference

| Group | Props |
|---|---|
| **Background** | `bg` `backgroundImage` `backgroundSize` `backgroundPosition` `backgroundRepeat` `backgroundAttachment` `backgroundClip` `backgroundOrigin` `backgroundBlendMode` |
| **Padding** | `p` `px` `py` `pt` `pb` `pl` `pr` |
| **Margin** | `m` `mx` `my` `mt` `mb` `ml` `mr` |
| **Size** | `w` `h` `minW` `maxW` `minH` `maxH` |
| **Layout** | `display` `flex` `flexDir` `flexGrow` `flexShrink` `flexBasis` `align` `alignSelf` `alignContent` `justify` `justifySelf` `wrap` `gap` `columnGap` `rowGap` `order` |
| **Grid** | `gridTemplateColumns` `gridTemplateRows` `gridTemplateAreas` `gridColumn` `gridRow` `gridArea` `gridAutoColumns` `gridAutoRows` `gridAutoFlow` |
| **Border** | `border` `borderStyle` `borderColor` `borderWidth` `borderTop/Right/Bottom/Left` (shorthands) `borderTopColor` `borderRightColor` `borderBottomColor` `borderLeftColor` `borderTopWidth` `borderRightWidth` `borderBottomWidth` `borderLeftWidth` `borderTopStyle` `borderRightStyle` `borderBottomStyle` `borderLeftStyle` |
| **Radius** | `radius` (all corners) `borderTopLeftRadius` `borderTopRightRadius` `borderBottomLeftRadius` `borderBottomRightRadius` |
| **Outline** | `outline` `outlineColor` `outlineWidth` `outlineStyle` `outlineOffset` |
| **Effects** | `opacity` `shadow` `transform` `filter` `backdropFilter` `mixBlendMode` |
| **Position** | `inset` `overflow` `overflowX` `overflowY` `position` `top` `right` `bottom` `left` `zIndex` |
| **Interaction** | `cursor` `pointerEvents` `touchAction` `userSelect` `visibility` `boxSizing` `aspectRatio` |
| **Transition** | `transition` `transitionProperty` `transitionDuration` `transitionTimingFunction` `transitionDelay` |
| **Animation** | `animation` `animationName` `animationDuration` `animationTimingFunction` `animationDelay` `animationIterationCount` `animationDirection` `animationFillMode` `animationPlayState` |
| **Scroll** | `scrollSnapType` `scrollSnapAlign` `overscrollBehavior` `overscrollBehaviorX` `overscrollBehaviorY` `scrollBehavior` |
| **Catch-all** | `sx` — token-aware styles for any CSS property not covered above |
| **Pseudo** | `_hover` `_focus` `_active` `_focusVisible` `_disabled` — see below |
| **Hover helpers** | `hoverScale` `hoverShade` — see below |

Token paths are resolved automatically. Numbers get `px` appended where appropriate. Unresolvable values pass through as-is.

#### Pseudo-state props

All pseudo props accept the same style props as Chamber itself (minus other pseudo props — no nesting). BadgerBurrow generates a scoped class name and injects a `<style>` tag — no inline-style limitation.

```tsx
<Chamber
  bg="color.primary.500"
  p="space.4"
  radius="radius.md"
  _hover={{ shadow: 'md', cursor: 'pointer' }}
  _focus={{ outlineStyle: 'solid', outlineColor: 'color.interactive.primary', outlineWidth: '2px' }}
  _active={{ opacity: 0.85 }}
  _focusVisible={{ outlineStyle: 'solid', outlineColor: 'color.interactive.primary', outlineOffset: '2px' }}
  _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
/>
```

#### Smart hover background

When `bg` is a **primitive colour path** (e.g. `color.primary.500`), BadgerBurrow automatically steps the hover background one shade darker — no `_hover` needed:

```tsx
<Chamber bg="color.primary.500" />
// :hover { background-color: <color.primary.600> }  ← auto
```

**Control it with `hoverScale` and `hoverShade`:**

```tsx
// Use a different scale for the hover bg — auto-steps to shade 600
<Chamber bg="color.bg.surface" hoverScale="primary" />

// Use a different scale at an exact shade
<Chamber bg="color.bg.surface" hoverScale="primary" hoverShade={400} />

// Disable the smart default
<Chamber bg="color.primary.500" hoverScale={false} />
```

Semantic token paths (`color.bg.surface`) are not auto-stepped — they don't encode which scale they live on. Use `hoverScale` to specify, or use `_hover` for full manual control.

#### Hover semantic tokens

The default token set includes pre-built hover variants for common semantic colours:

```
color.interactive.primary.hover   → primary.600 (light) / primary.300 (dark)
color.interactive.secondary.hover → secondary.600 (light) / secondary.300 (dark)
color.bg.surface.hover            → neutral.100 (light) / neutral.800 (dark)
color.bg.elevated.hover           → neutral.50 (light) / neutral.700 (dark)
color.text.primary.hover          → neutral.700 (light) / neutral.200 (dark)
color.text.secondary.hover        → neutral.700 (light) / neutral.200 (dark)
color.border.default.hover        → neutral.400 (light) / neutral.500 (dark)
```

Use them inside `_hover` for token-consistent hover styles:

```tsx
<Chamber
  bg="color.bg.surface"
  _hover={{ bg: 'color.bg.surface.hover', borderColor: 'color.border.default.hover' }}
/>
```

### `Tunnel` — styled text

A text element with token-aware shorthand props. Defaults to `<span>`. Use the `as` prop to change the tag.

```tsx
<Tunnel
  as="h1"
  fontSize="fontSize.2xl"
  fontWeight="fontWeight.bold"
  color="color.text.primary"
  lineHeight="lineHeight.tight"
  truncate
>
  Hello world
</Tunnel>
```

#### Full prop reference

| Group | Props |
|---|---|
| **Font** | `color` `fontSize` `fontWeight` `fontFamily` `fontStyle` `fontVariant` `fontStretch` |
| **Spacing** | `lineHeight` `letterSpacing` `wordSpacing` |
| **Text layout** | `textAlign` `textTransform` `textDecoration` `textDecorationColor` `textDecorationStyle` `textDecorationThickness` `textUnderlineOffset` `textOverflow` `textShadow` `textIndent` `textWrap` `whiteSpace` `overflow` `wordBreak` `overflowWrap` `verticalAlign` |
| **Interaction** | `userSelect` |
| **Boolean helpers** | `italic` — sets `fontStyle: italic` · `truncate` — sets overflow + whiteSpace + textOverflow · `nowrap` — sets `whiteSpace: nowrap` · `lineClamp={n}` — multi-line ellipsis |
| **Tags** | `as` — `'span'` `'p'` `'h1'`–`'h6'` `'label'` |
| **Pseudo** | `_hover` `_focus` `_active` `_focusVisible` `_disabled` — same shape as above |
| **Catch-all** | `sx` — token-aware styles for any CSS property not covered above |

---

## Dark mode

```tsx
const { mode, setMode } = useBurrow()

setMode('dark')   // switches globally, only subscribed components re-render
setMode('light')
```

Semantic tokens resolve differently per mode. Primitive tokens are always the same.

---

## Token paths

All props that accept a token path follow dot notation:

```
primitive path:  'space.4'                      → 16
primitive path:  'color.primary.500'            → '#744577'
primitive path:  'radius.md'                    → 8
semantic path:   'color.interactive.primary'    → resolves via semantic[mode] → primitive
raw value:       '#ff0000'                      → passes through unchanged
raw number:      16                             → 16 (or '16px' for px props)
```

---

## Test coverage

| Package | Tests |
|---|---|
| `@badger-burrow/tokens` | 42 |
| `@badger-burrow/core` | 136 |
| `@badger-burrow/web` | 263 |
| **Total** | **441** |

---

## Status

| Package | Status |
|---|---|
| `@badger-burrow/tokens` | ✅ Complete |
| `@badger-burrow/core` | ✅ Complete |
| `@badger-burrow/web` | ✅ Complete |
| `@badger-burrow/native` | 🔜 Next |
