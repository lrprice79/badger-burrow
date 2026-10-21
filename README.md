<p align="center">
  <img src="assets/badger-logo.png" width="140" alt="BadgerBurrow">
</p>

<h1 align="center">BadgerBurrow</h1>

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
import { extendBurrow } from '@purple-brock/burrow-core'

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
import { Chamber, Tunnel } from '@purple-brock/burrow-web'

function Card() {
  return (
    <Chamber
      bg="bg.surface"
      p="4"
      radius="md"
      shadow="md"
      display="flex"
      flexDir="column"
      gap="2"
    >
      <Tunnel as="h2" fontSize="xl" fontWeight="bold" color="text.primary">
        Budget Summary
      </Tunnel>
      <Tunnel color="text.secondary" fontSize="sm">
        Updated today
      </Tunnel>
    </Chamber>
  )
}
```

---

## `@purple-brock/burrow-tokens`

The design foundation. Pure TypeScript — no React dependency.

### Default token structure

| Category | Contents |
|---|---|
| `primitive.color` | 8 colour scales — `primary`, `secondary`, `neutral` (surfaces/borders), `ink` (text), `success`, `error`, `warning`, `info` — each with 10 shades (50–900) |
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
import { generateScale } from '@purple-brock/burrow-tokens'

generateScale('#744577')
// → { 50: '#f9f0f7', 100: '...', ..., 500: '#744577', ..., 900: '...' }
```

Options: `anchor` (which shade your hex maps to, default `500`) and `format` (`'hex' | 'rgb' | 'hsl' | 'oklch'`).

### Finding harmonious colours

```ts
import { generateHarmonics } from '@purple-brock/burrow-tokens'

const harmonics = generateHarmonics('#744577')
// harmonics.complementary — colour directly opposite on the wheel
// harmonics.analogous[0]  — colour sitting next to yours
// harmonics.triadic        — two equally spaced colours
// harmonics.splitComplementary
// harmonics.tetradic
```

Each value is a ready-to-use colour scale. Drop straight into `extendBurrow`.

### `generateTheme` — one brand colour → a complete, AA-checked theme

When you just want a working theme from a single brand hex, `generateTheme` does
the whole job: it builds the `primary` scale, derives a `secondary` from a colour
harmony, adds `neutral` + `ink` greys, and — the part that matters — **picks the
interactive button shade and its label colour so the button stays WCAG-AA readable
for any hue**. Light brands (yellow, lime, cyan) get a dark label automatically
instead of an unreadable white one.

```ts
import { generateTheme } from '@purple-brock/burrow-tokens'
import { extendBurrow } from '@purple-brock/burrow-core'

extendBurrow(generateTheme('#8B5CF6'))
```

It returns `{ primitive: { color }, semantic }` — exactly the shape `extendBurrow`
expects. Everything you don't override (backgrounds, text, borders, feedback)
cascades from the default semantic layer against the scales it generated.

```ts
generateTheme('#F5D90A', {
  harmony: 'triadic',     // how secondary is derived — default 'complementary'
  secondary: '#10B981',   // or pin secondary explicitly (overrides harmony)
  neutral: '#737373',     // surface-grey seed (default #808080)
  ink: '#1e1e24',         // text-colour seed   (default #71717A)
})
```

It's a pure token utility — no React, no DOM — so it works **identically with or
without SSR**. Call it once at startup; the result is just data.

> One global theme per app. Because the store is a singleton, `generateTheme`
> sets the theme process-wide — perfect for a single app theme, but a *different*
> theme per SSR request (multi-tenant) would race across concurrent renders. Out
> of scope for v1.

### Surfaces vs text — `neutral` and `ink`

Greys do two different jobs, so they get two scales:

- **`neutral`** — surfaces, panels and borders. A clean pure grey with a near-white `50` (`#f7f7f7`), so page backgrounds stay bright.
- **`ink`** — text. A faintly cool dark scale, kept *separate* so making surfaces lighter never weakens text contrast.

Override either independently:

```ts
extendBurrow({ primitive: { color: {
  neutral: generateScale('#737373'),   // your surface grey
  ink:     generateScale('#1e1e24'),   // your text colour (warm/cool/branded)
} } })
```

**Recommended semantic → shade mapping** (how the defaults wire roles to shades — handy when building a theme; go darker/lighter to taste):

| Role | Light | Dark |
|---|---|---|
| `bg.surface` | `neutral.100` | `neutral.900` |
| `bg.elevated` | `#ffffff` | `neutral.800` |
| `border.default` | `neutral.200` | `neutral.700` |
| `text.primary` | `ink.900` | `ink.50` |
| `text.secondary` | `ink.600` | `ink.400` |
| `text.inverse` | `#ffffff` | `#ffffff` |

---

## `@purple-brock/burrow-core`

The engine. No React dependency — usable in any TypeScript project.

### Store — `BadgerBase`

```ts
import { BadgerBase } from '@purple-brock/burrow-core'

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
import { extendBurrow } from '@purple-brock/burrow-core'

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

`extendBurrow` always merges against **defaultTokens** — a second call replaces the
first call's overrides. For layering (app sets the brand, a feature module adds its
own tokens later) use **`mergeBurrow`**, which merges onto the *current* token set:

```ts
import { extendBurrow, mergeBurrow } from '@purple-brock/burrow-core'

extendBurrow({ primitive: { color: { primary: brandScale } } })       // app entry
mergeBurrow({ primitive: { color: { chartAccent: accentScale } } })   // feature module — brand kept
```

Both are one-shot merges at call time — zero per-render cost.

### Variants — `createVariants`

Map named variant keys to token-backed styles.

```ts
import { createVariants } from '@purple-brock/burrow-core'

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
import { resolveToken } from '@purple-brock/burrow-core'

resolveToken('color.interactive.primary', tokens, 'light')
// → '#744577'  (resolves semantic → primitive)

resolveToken('space.4', tokens)
// → 16
```

### CSS variables — web only

```ts
import { injectCssVars, removeCssVars, buildCssVarMap } from '@purple-brock/burrow-core'

injectCssVars(tokens, 'light')           // injects --badger-* on :root
injectCssVars(tokens, 'dark', element)   // scoped to an element
removeCssVars()                          // cleans up
```

### Token-aware sx resolution — `resolveSx`

```ts
import { resolveSx } from '@purple-brock/burrow-core'

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
  // motion token keywords:
  DurationToken, EasingToken,
  FontProps, TextLayoutProps, TextHelperProps,
} from '@purple-brock/burrow-core'
```

---

## `@purple-brock/burrow-web`

React components for web. Requires React 18+.

### `useBurrow`

```tsx
import { useBurrow } from '@purple-brock/burrow-web'

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
  bg="interactive.primary"
  px="4" py="2"
  radius="md"
  _hover={{ bg: 'interactive.primary.hover', cursor: 'pointer' }}
  _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
  onClick={handleClick}
>
  Save
</Chamber>

<Chamber
  as="nav"
  display="flex"
  gap="4"
  p="3"
  bg="bg.elevated"
  shadow="sm"
>
  {children}
</Chamber>
```

**Supported tags:** `div` · `section` · `article` · `aside` · `header` · `footer` · `main` · `nav` · `button` · `a` · `form` · `fieldset` · `ul` · `ol` · `li` · `figure` · `figcaption` · `label` · `dialog` · `details` · `summary` · `span` (inline-level box — valid phrasing content for badges/inline wrappers inside `<p>`/`<button>`/`<a>`)

**Refs:** both `Chamber` and `Tunnel` forward refs to the rendered element (`<Chamber ref={…} as="button" />` gives you the `<button>`). Implemented with `forwardRef`, so it works on React 18 and 19 alike.

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

> Setting `borderWidth` (or any per-side width) makes the border visible on its own — the style defaults to `solid` when you don't set one, matching React Native. Pass `borderStyle="dashed"` (or a per-side style) to override.
| **Outline** | `outline` `outlineColor` `outlineWidth` `outlineStyle` `outlineOffset` |
| **Effects** | `opacity` `shadow` `transform` `filter` `backdropFilter` `mixBlendMode` |
| **Position** | `inset` `overflow` `overflowX` `overflowY` `position` `top` `right` `bottom` `left` `zIndex` |
| **Interaction** | `cursor` `pointerEvents` `touchAction` `userSelect` `visibility` `boxSizing` `aspectRatio` |
| **Transition** | `transition`‡ `transitionProperty` `transitionDuration`‡ `transitionTimingFunction`‡ `transitionDelay`‡ |
| **Animation** | `animation` `animationName` `animationDuration`‡ `animationTimingFunction`‡ `animationDelay`‡ `animationIterationCount` `animationDirection` `animationFillMode` `animationPlayState` |

‡ accepts a **motion token keyword** as well as raw CSS. `transition="fast"` → `all 150ms cubic-bezier(0.4, 0, 0.2, 1)`; `transitionDuration="normal"` → `300ms`; `transitionTimingFunction="decelerate"` → its cubic-bezier. Duration keys: `instant` `fast` `normal` `slow` `glacial`. Easing keys: `standard` `decelerate` `accelerate` `sharp`. Web-only (stripped on native — use Reanimated there).
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
  bg="primary.500"
  p="4"
  radius="md"
  _hover={{ shadow: 'md', cursor: 'pointer' }}
  _focus={{ outlineStyle: 'solid', outlineColor: 'interactive.primary', outlineWidth: '2px' }}
  _active={{ opacity: 0.85 }}
  _focusVisible={{ outlineStyle: 'solid', outlineColor: 'interactive.primary', outlineOffset: '2px' }}
  _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
/>
```

#### Smart hover background

When `bg` is a **primitive colour path** (e.g. `color.primary.500`), BadgerBurrow automatically steps the hover background two shades darker — no `_hover` needed:

```tsx
<Chamber bg="primary.500" />
// :hover { background-color: <color.primary.700> }  ← auto
```

**Control it with `hoverScale` and `hoverShade`:**

```tsx
// Use a different scale for the hover bg — auto-steps two shades darker
<Chamber bg="bg.surface" hoverScale="primary" />

// Use a different scale at an exact shade
<Chamber bg="bg.surface" hoverScale="primary" hoverShade={400} />

// Disable the smart default
<Chamber bg="primary.500" hoverScale={false} />
```

Semantic token paths (`color.bg.surface`) are not auto-stepped — they don't encode which scale they live on. Use `hoverScale` to specify, or use `_hover` for full manual control.

#### Hover semantic tokens

The default token set includes pre-built hover variants for common semantic colours:

```
color.interactive.primary.hover   → primary.800 (both modes)
color.interactive.secondary.hover → secondary.800 (both modes)
color.bg.surface.hover            → neutral.200 (light) / neutral.800 (dark)
color.bg.elevated.hover           → neutral.50 (light) / neutral.700 (dark)
color.text.primary.hover          → neutral.700 (light) / neutral.200 (dark)
color.text.secondary.hover        → neutral.700 (light) / neutral.200 (dark)
color.border.default.hover        → neutral.400 (light) / neutral.500 (dark)
```

Use them inside `_hover` for token-consistent hover styles:

```tsx
<Chamber
  bg="bg.surface"
  _hover={{ bg: 'bg.surface.hover', borderColor: 'border.default.hover' }}
/>
```

### Responsive props

Any token prop on `Chamber` or `Tunnel` (web or native) can accept a responsive object instead of a plain value — as can the layout/flex/grid props marked with † in the prop reference (`flexDir`, `align`, `justify`, `display`, the grid templates, etc.).

```tsx
// Plain value — same at all sizes
<Chamber p="4" />

// Responsive — breakpoint overrides cascade up (like CSS min-width)
<Chamber p={{ base: 'space.2', md: 'space.4', lg: 'space.6' }} />

// Layout that reflows: column on mobile, row from md up; alignment per breakpoint
<Chamber
  flexDir={{ base: 'column', md: 'row' }}
  align={{ base: 'flex-start', lg: 'center' }}
/>

// Mix — some props plain, some responsive
<Chamber
  bg="bg.surface"
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
<Chamber display="flex" align="center" gap="2">
  <Tunnel color="text.primary" fontSize="md">Hello world</Tunnel>
</Chamber>

// ✅ Headings, labels, captions — all Tunnel
<Tunnel as="h1" fontSize="2xl" fontWeight="bold" color="text.primary">
  Page title
</Tunnel>

<Tunnel as="label" fontSize="sm" color="text.secondary">
  Email address
</Tunnel>

<Tunnel as="p" fontSize="md" lineHeight="relaxed" color="text.primary">
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

## `@purple-brock/burrow-native`

React Native components. Same token props as the web package — the same `extendBurrow()` call works across both.

Install:

```bash
npm install @purple-brock/burrow-tokens @purple-brock/burrow-core @purple-brock/burrow-native
```

### `useBurrow`

Identical API to the web version — `useSyncExternalStore` over `BadgerBase`. Works in React Native out of the box.

```tsx
import { useBurrow } from '@purple-brock/burrow-native'

const { tokens, mode, setMode } = useBurrow()
```

### `Chamber` — renders `<View>`

Same token props as web Chamber. Renders a `View`. No `as` prop needed — in React Native you always use `Pressable` for interactive surfaces.

**Shadow** uses `tokens.primitive.shadow[key].native` — the elevation object (`{ elevation, shadowColor, ... }`) rather than a CSS string.

```tsx
import { Chamber, Tunnel } from '@purple-brock/burrow-native'

function Card() {
  return (
    <Chamber
      bg="bg.elevated"
      p="4"
      radius="md"
      shadow="md"
      display="flex"
      flexDir="column"
      gap="2"
    >
      <Tunnel fontSize="lg" fontWeight="bold" color="text.primary">
        Budget Summary
      </Tunnel>
      <Tunnel color="text.secondary" fontSize="sm">
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

## Debugging — `__debug`

Add `__debug` to any `Chamber` or `Tunnel` and it reveals what BadgerBurrow
actually did with it — the questions inspect-element can't answer:

```tsx
<Chamber __debug bg="primary.500" p="4">…</Chamber>
```

- **outlines** the element (dashed magenta) so you can see which one it is;
- exposes a **`data-bb-debug="⟳N"`** render counter (visible in devtools — handy
  for catching needless re-renders);
- logs a collapsed **console group** each render with the **resolved styles**
  (`primary.500 → #723dd7`, `p="4" → 16px`), render count, size and mode.

On native it logs the resolved style + size (via `onLayout`) to the console.

It's **dev-only** — guarded by `process.env.NODE_ENV`, so the whole thing is a
no-op and tree-shaken out of production builds. Catching a silent token typo is
the headline use: a misspelled `fontSize="larg"` shows up as the raw string
`"larg"` instead of a `px` value, so you spot it instantly.

---

## Server-side rendering

**You use `<Chamber>` and `<Tunnel>` the exact same way with or without SSR —
the components never change.** SSR is purely opt-in at the render boundary; there
are no SSR-specific props, variants, or imports inside your components.

**Without SSR (SPA / client-only):** nothing to do. On first render, pseudo and
responsive rules inject straight into `document.head` at runtime.

```tsx
// works as-is in any client app
<Chamber bg="primary.500" p="4" _hover={{ bg: 'primary.600' }} />
```

**With SSR (Next.js, etc.):** the *same* components, but wrap the server render so
those `<style>` rules are collected (they can't touch a DOM that doesn't exist on
the server) and emitted into `<head>`:

```tsx
import { renderToString } from 'react-dom/server'
import { createStyleRegistry } from '@purple-brock/burrow-web'

const registry = createStyleRegistry()
const body = registry.collect(() => renderToString(<App />))  // <App> uses Chamber freely
const head = registry.styleTags()   // → <style data-bb-ssr data-bb-ids="…">…</style>

// send:  <head>…{head}</head><body>{body}</body>
```

On the client nothing else is needed — `adoptServerStyles()` runs automatically on
import, reads the `data-bb-ssr` tag, and primes the cache so hydration never
re-injects or duplicates those rules. No provider, no `<ThemeProvider>` — same as
everything else.

**What needs the registry, and what doesn't:** base token styles (`bg`, `p`,
`fontSize`, …) are plain inline `style={...}` props — they serialize in
`renderToString` with zero help, SSR or not. Only **pseudo (`_hover`)** and
**responsive (`{ base, md }`)** styles become real `<style>` rules, so those are
the only thing the registry collects.

> Synchronous `renderToString` only (the registry is active for the duration of
> `collect`). Streaming/async SSR isn't supported yet.

---

## Token values — short form

Token props take the **short form** — the prop name already implies the category,
so you drop the `color.` / `space.` / `fontSize.` prefix:

```
p="4"               → space.4   → 16   (string "4" = token; number 4 = raw 4px)
p="md"              → space.md  → 16
radius="md"         → radius.md → 8
bg="primary.500"    → color.primary.500   → '#744577'
bg="bg.surface"     → color.bg.surface    → resolves via semantic[mode] → primitive
color="text.primary"→ color.text.primary
fontSize="lg"       → fontSize.lg → 20
bg="#ff0000"        → raw value, passes through unchanged
w="100%"            → raw value, passes through unchanged
```

The full dotted path (`p="space.4"`) still resolves for back-compat, but in
development you'll get a console nudge to drop the redundant prefix. **Exceptions:**
`sx`, `createVariants`, `resolveToken`, and `extendBurrow` token keys use full
dotted paths (they're generic / token-tree keys, so the category can't be inferred).

Two short-form behaviours worth knowing:

- **Token keys shadow CSS keywords.** `lineHeight="normal"` resolves the *token*
  (`1.5`), not the CSS keyword `normal`; `letterSpacing="normal"` → `0px`. The
  resolved values are visually equivalent to the keywords, but if you ever need
  the literal CSS keyword, set it via `style` or `sx`.
- **Size props share the `space` scale.** `w`, `h`, `top`, `inset` etc resolve
  against `space.*` — so `w="md"` → 16px. For element sizing you'll usually want
  raw values (`w="100%"`, `w={240}`).

### IDE autocomplete

Prop values are typed with string literal unions so your editor suggests valid token values as you type. Each prop accepts the tokens relevant to it:

| Prop group | Autocomplete | Example |
|---|---|---|
| `bg`, `color`, `borderColor`, `outlineColor`, … | `ColorToken` | `'primary.500'`, `'bg.surface'`, `'text.primary'` |
| `p`, `m`, `gap`, `w`, `h`, `top`, … | `SpaceToken \| number` | `'4'`, `'md'` |
| `radius`, `border*Radius` | `RadiusToken \| number` | `'md'`, `'full'` |
| `fontSize` | `FontSizeToken \| number` | `'lg'`, `'2xl'` |
| `fontWeight` | `FontWeightToken \| number` | `'bold'` |
| `lineHeight` | `LineHeightToken \| number` | `'normal'` |
| `letterSpacing` | `LetterSpacingToken \| number` | `'wide'` |
| `fontFamily` | `FontFamilyToken` | `'sans'`, `'mono'` |

All token types include `(string & {})` so raw CSS values (`'#ff0000'`, `'100%'`, `'auto'`) and custom extended tokens are still accepted without type errors — autocomplete shows the known values first.

---

## Storybook

A full interactive Storybook lives in `storybook/` (Storybook 8 + Vite),
resolving the packages from source so edits reflect live.

```bash
pnpm storybook          # dev server on :6006
pnpm build-storybook    # static build
```

Two global toolbar controls drive the whole library through the BadgerBurrow
store (no provider): **Mode** (light / dark) and **Brand** (recolours everything
from one hex by regenerating the `primary` scale). Story groups:

- **Theme** — colour scales, light/dark swatches, brand presets, spacing,
  typography, radii, shadows.
- **Components** — `Chamber` and `Tunnel` playgrounds with every prop wired as a
  live Control (token dropdowns), plus `as`-element, flex, grid, pseudo and
  responsive stories.
- **Patterns** — buttons, badges, cards, alerts, list rows, stat tiles built
  purely from the two primitives.
- **Features** — motion tokens, smart hover, responsive props, pseudo states.

---

## Test coverage

| Package | Tests |
|---|---|
| `@purple-brock/burrow-tokens` | 66 |
| `@purple-brock/burrow-core` | 236 |
| `@purple-brock/burrow-web` | 336 |
| `@purple-brock/burrow-native` | 82 |
| **Total** | **720** |

---

## Status

| Package | Status |
|---|---|
| `@purple-brock/burrow-tokens` | ✅ Complete |
| `@purple-brock/burrow-core` | ✅ Complete |
| `@purple-brock/burrow-web` | ✅ Complete |
| `@purple-brock/burrow-native` | ✅ Complete |

## License

[MIT](LICENSE) © 2026 Luke Price (The Purple Brock).
