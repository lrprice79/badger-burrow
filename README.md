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
└── packages/native   Chamber + Tunnel for React Native
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
  LayoutProps, FlexProps, GridProps, InsetProps, BorderProps,
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

A styled box component. Defaults to `<div>`. Use the `as` prop to render any semantic element — `button`, `nav`, `section`, `a`, and more. All standard HTML props pass through.

Chamber accepts **all font and typography props** as well as layout props — so you can set `color`, `fontSize`, `fontWeight` etc. directly on a `div` without wrapping content in a `Tunnel`. Use `Tunnel` when the element itself is a heading, paragraph, or inline text node (`as="h1"`, `as="p"`, `as="span"`).

**Style priority (lowest → highest):** `sx` → named props → `style`

```tsx
<Chamber
  as="button"
  bg="color.interactive.primary"
  px="space.4" py="space.2"
  radius="radius.md"
  _hover={{ bg: 'color.interactive.primary.hover', cursor: 'pointer' }}
  _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
  onClick={handleClick}
>
  Save
</Chamber>

<Chamber
  as="nav"
  display="flex"
  gap="space.4"
  p="space.3"
  bg="color.bg.elevated"
  shadow="sm"
>
  {children}
</Chamber>
```

**Supported tags:** `div` · `section` · `article` · `aside` · `header` · `footer` · `main` · `nav` · `button` · `a` · `form` · `fieldset` · `ul` · `ol` · `li` · `figure` · `figcaption` · `label` · `dialog` · `details` · `summary`

#### Full prop reference

| Group | Props |
|---|---|
| **Background** | `bg` `backgroundImage` `backgroundSize` `backgroundPosition` `backgroundRepeat` `backgroundAttachment` `backgroundClip` `backgroundOrigin` `backgroundBlendMode` |
| **Padding** | `p` `px` `py` `pt` `pb` `pl` `pr` |
| **Margin** | `m` `mx` `my` `mt` `mb` `ml` `mr` |
| **Size** | `w` `h` `minW` `maxW` `minH` `maxH` |
| **Layout** | `display`† `gap` `columnGap` `rowGap` |
| **Flex** | `flex` `flexDir`† `flexGrow` `flexShrink` `flexBasis` `align`† `alignSelf`† `alignContent`† `justify`† `justifySelf`† `wrap`† `order` |
| **Grid** | `gridTemplateColumns`† `gridTemplateRows`† `gridTemplateAreas`† `gridColumn`† `gridRow`† `gridArea`† `gridAutoColumns`† `gridAutoRows`† `gridAutoFlow`† |

† accepts a responsive object as well as a plain value, e.g. `flexDir={{ base: 'column', md: 'row' }}`, `align={{ base: 'flex-start', lg: 'center' }}`, `gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}`. Grid props are typed off `CSSProperties` for value autocomplete.
| **Border** | `border` `borderStyle` `borderColor` `borderWidth` `borderTop/Right/Bottom/Left` (shorthands) `borderTopColor` `borderRightColor` `borderBottomColor` `borderLeftColor` `borderTopWidth` `borderRightWidth` `borderBottomWidth` `borderLeftWidth` `borderTopStyle` `borderRightStyle` `borderBottomStyle` `borderLeftStyle` |
| **Radius** | `radius` (all corners) `borderTopLeftRadius` `borderTopRightRadius` `borderBottomLeftRadius` `borderBottomRightRadius` |
| **Outline** | `outline` `outlineColor` `outlineWidth` `outlineStyle` `outlineOffset` |
| **Effects** | `opacity` `shadow` `transform` `filter` `backdropFilter` `mixBlendMode` |
| **Position** | `inset` `overflow` `overflowX` `overflowY` `position` `top` `right` `bottom` `left` `zIndex` |
| **Interaction** | `cursor` `pointerEvents` `touchAction` `userSelect` `visibility` `boxSizing` `aspectRatio` |
| **Transition** | `transition` `transitionProperty` `transitionDuration` `transitionTimingFunction` `transitionDelay` |
| **Animation** | `animation` `animationName` `animationDuration` `animationTimingFunction` `animationDelay` `animationIterationCount` `animationDirection` `animationFillMode` `animationPlayState` |
| **Scroll** | `scrollSnapType` `scrollSnapAlign` `overscrollBehavior` `overscrollBehaviorX` `overscrollBehaviorY` `scrollBehavior` |
| **Font** | `color` `fontSize` `fontWeight` `fontFamily` `fontStyle` `fontVariant` `fontStretch` `lineHeight` `letterSpacing` `wordSpacing` |
| **Text layout** | `textAlign` `textTransform` `textDecoration` `textDecorationColor` `textDecorationStyle` `textDecorationThickness` `textUnderlineOffset` `textOverflow` `textShadow` `textIndent` `textWrap` `whiteSpace` `wordBreak` `overflowWrap` `verticalAlign` |
| **Text helpers** | `italic` `truncate` `nowrap` `lineClamp` |
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

### Responsive props

Any token prop on `Chamber` or `Tunnel` (web or native) can accept a responsive object instead of a plain value — as can the layout/flex/grid props marked with † in the prop reference (`flexDir`, `align`, `justify`, `display`, the grid templates, etc.).

```tsx
// Plain value — same at all sizes
<Chamber p="space.4" />

// Responsive — breakpoint overrides cascade up (like CSS min-width)
<Chamber p={{ base: 'space.2', md: 'space.4', lg: 'space.6' }} />

// Layout that reflows: column on mobile, row from md up; alignment per breakpoint
<Chamber
  flexDir={{ base: 'column', md: 'row' }}
  align={{ base: 'flex-start', lg: 'center' }}
/>

// Mix — some props plain, some responsive
<Chamber
  bg="color.bg.surface"
  p={{ base: 'space.2', md: 'space.6' }}
  fontSize={{ base: 'fontSize.sm', lg: 'fontSize.xl' }}
/>
```

**Breakpoints** (default, can be overridden via `extendBurrow`):

| Key | Default | Meaning |
|---|---|---|
| `base` | — | Applies below `sm` (inline style, no media query) |
| `sm` | `576px` | ≥ 576 px |
| `md` | `768px` | ≥ 768 px |
| `lg` | `992px` | ≥ 992 px |
| `xl` | `1200px` | ≥ 1200 px |

**Web** — base values are set as inline styles; named breakpoints inject scoped `@media (min-width: …)` rules via a `[data-bb-responsive]` style tag. Two components with identical responsive configs share one style tag.

**React Native** — uses `useWindowDimensions` to resolve the active breakpoint at render time. No media queries; the correct value is computed and applied as an inline style.

### `Tunnel` — all text goes here

**Tunnel is the text component.** Every piece of visible text in your UI — headings, body copy, labels, captions, error messages — should be rendered inside a `Tunnel`. It has no layout props (no padding, margin, flex, grid). Its props are entirely focused on how text looks: font, colour, size, weight, alignment, decoration, and truncation.

If you need to lay out text next to other elements, wrap it in a `Chamber`. The `Tunnel` just handles the text itself.

```tsx
// ✅ Correct — Tunnel for text, Chamber for layout
<Chamber display="flex" align="center" gap="space.2">
  <Tunnel color="color.text.primary" fontSize="fontSize.md">Hello world</Tunnel>
</Chamber>

// ✅ Headings, labels, captions — all Tunnel
<Tunnel as="h1" fontSize="fontSize.2xl" fontWeight="fontWeight.bold" color="color.text.primary">
  Page title
</Tunnel>

<Tunnel as="label" fontSize="fontSize.sm" color="color.text.secondary">
  Email address
</Tunnel>

<Tunnel as="p" fontSize="fontSize.md" lineHeight="lineHeight.relaxed" color="color.text.primary">
  Body copy goes here.
</Tunnel>
```

Defaults to `<span>`. Use `as` to change the tag — `h1`–`h6`, `p`, `label` are the most common.

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

## `@badger-burrow/native`

React Native components. Same token props as the web package — the same `extendBurrow()` call works across both.

Install:

```bash
npm install @badger-burrow/tokens @badger-burrow/core @badger-burrow/native
```

### `useBurrow`

Identical API to the web version — `useSyncExternalStore` over `BadgerBase`. Works in React Native out of the box.

```tsx
import { useBurrow } from '@badger-burrow/native'

const { tokens, mode, setMode } = useBurrow()
```

### `Chamber` — renders `<View>`

Same token props as web Chamber. Renders a `View`. No `as` prop needed — in React Native you always use `Pressable` for interactive surfaces.

**Shadow** uses `tokens.primitive.shadow[key].native` — the elevation object (`{ elevation, shadowColor, ... }`) rather than a CSS string.

```tsx
import { Chamber, Tunnel } from '@badger-burrow/native'

function Card() {
  return (
    <Chamber
      bg="color.bg.elevated"
      p="space.4"
      radius="radius.md"
      shadow="md"
      display="flex"
      flexDir="column"
      gap="space.2"
    >
      <Tunnel fontSize="fontSize.lg" fontWeight="fontWeight.bold" color="color.text.primary">
        Budget Summary
      </Tunnel>
      <Tunnel color="color.text.secondary" fontSize="fontSize.sm">
        Updated today
      </Tunnel>
    </Chamber>
  )
}
```

### `Tunnel` — renders `<Text>`

Same text token props as web Tunnel. No `as` prop — in React Native all text renders as `<Text>`.

### Key differences from web

| Web | Native |
|---|---|
| `Chamber` renders any HTML element via `as` | `Chamber` always renders `<View>` |
| `Tunnel` renders `span`, `p`, `h1`–`h6`, `label` | `Tunnel` always renders `<Text>` |
| Shadow = CSS `box-shadow` string | Shadow = native elevation object |
| Pseudo props (`_hover` etc.) inject `<style>` tags | No pseudo props — use `Pressable` state instead |
| `px` suffix added to numeric values | Raw numbers passed (RN uses unitless numbers) |
| Font props on `Chamber` style child text via CSS inheritance | Font props on `Chamber` are **no-ops** — RN `<View>` can't inherit text styles, so they're stripped. Put text styling on a `Tunnel`. |
| `truncate` / `lineClamp` use `-webkit-line-clamp` CSS | `truncate` / `lineClamp` map to the `<Text numberOfLines>` prop |
| `lineHeight` token is a unitless multiplier | Multiplier resolved against `fontSize` to an absolute px value (RN requires a number) |

Native style output is sanitized before reaching `<View>` / `<Text>`: `px` strings become numbers, web-only keys (`cursor`, `filter`, `transition`, `outline`, `boxShadow`, grid, …) are stripped, and text-only props are removed from View styles.

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

### IDE autocomplete

Prop values are typed with string literal unions so your editor suggests valid token paths as you type. Each prop accepts the tokens relevant to it:

| Prop group | Autocomplete | Example |
|---|---|---|
| `bg`, `color`, `borderColor`, `outlineColor`, … | `ColorToken` | `'color.primary.500'`, `'color.bg.surface'` |
| `p`, `m`, `gap`, `w`, `h`, `top`, … | `SpaceToken \| number` | `'space.4'`, `'space.md'` |
| `radius`, `border*Radius` | `RadiusToken \| number` | `'radius.md'`, `'radius.full'` |
| `fontSize` | `FontSizeToken \| number` | `'fontSize.lg'`, `'fontSize.2xl'` |
| `fontWeight` | `FontWeightToken \| number` | `'fontWeight.bold'` |
| `lineHeight` | `LineHeightToken \| number` | `'lineHeight.normal'` |
| `letterSpacing` | `LetterSpacingToken \| number` | `'letterSpacing.wide'` |
| `fontFamily` | `FontFamilyToken` | `'fontFamily.sans'`, `'fontFamily.mono'` |

All token types include `(string & {})` so raw CSS values (`'#ff0000'`, `'100%'`, `'auto'`) and custom extended tokens are still accepted without type errors — autocomplete shows the known values first.

---

## Test coverage

| Package | Tests |
|---|---|
| `@badger-burrow/tokens` | 42 |
| `@badger-burrow/core` | 176 |
| `@badger-burrow/web` | 302 |
| `@badger-burrow/native` | 71 |
| **Total** | **591** |

---

## Status

| Package | Status |
|---|---|
| `@badger-burrow/tokens` | ✅ Complete |
| `@badger-burrow/core` | ✅ Complete |
| `@badger-burrow/web` | ✅ Complete |
| `@badger-burrow/native` | ✅ Complete |
