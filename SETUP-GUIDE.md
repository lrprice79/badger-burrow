# BadgerBurrow — Setup Guide

A walkthrough for setting up BadgerBurrow in a new project with your own styles.

---

## 1. Install

**React (web):**

```bash
npm install @badger-burrow/tokens @badger-burrow/core @badger-burrow/web
```

**React Native:**

```bash
npm install @badger-burrow/tokens @badger-burrow/core @badger-burrow/native
```

Both packages share the same `extendBurrow()` setup and the same token props. The only difference is the component internals — `Chamber` renders `<View>` in native, `<div>` on web; `Tunnel` renders `<Text>` in native, `<span>` on web.

---

## 2. Build your colour palette

### `generateScale` — one hex colour → a full 50–900 scale

Give it your brand colour and get back ten shades you can drop straight into tokens.

```ts
import { generateScale } from '@badger-burrow/tokens'

const green = generateScale('#2E7D5E')
// {
//   50:  '#edf7f3',   ← near-white tint
//   100: '#c8eadc',
//   200: '#96d4ba',
//   300: '#5eb896',
//   400: '#329c73',
//   500: '#2E7D5E',   ← your original colour lands here by default
//   600: '#236047',
//   700: '#194432',
//   800: '#0f2b1f',
//   900: '#07150f',   ← near-black shade
// }
```

The scale is generated using **OKLCH** colour space — perceptually even steps, so the jumps between shades look consistent to the human eye rather than being mathematically even but visually lopsided.

**Options:**

```ts
// anchor — which shade your hex maps to (default: 500)
// Useful when your brand colour is already a light or dark variant
const scale = generateScale('#2E7D5E', { anchor: 400 })
// Now 400 = '#2E7D5E', and the rest of the scale is shifted to match

// format — output format (default: 'hex')
const scale = generateScale('#2E7D5E', { format: 'hsl' })
// → { 50: 'hsl(155, 43%, 95%)', ... }

// Other formats: 'rgb', 'oklch'
```

**Anchor examples:**

| Your colour is... | Use anchor |
|---|---|
| A mid-tone brand colour | `500` (default) |
| A light brand colour (logo on white bg) | `300` or `400` |
| A dark brand colour (heavy/rich) | `600` or `700` |

---

### `generateHarmonics` — find colours that pair well

Give it your brand hex and get back scientifically paired colour hues — each one already built into a full scale.

```ts
import { generateHarmonics } from '@badger-burrow/tokens'

const harmonics = generateHarmonics('#2E7D5E')
```

**What you get back:**

| Key | How many | Hue offset | Best used for |
|---|---|---|---|
| `complementary` | 1 colour | +180° | Bold accents, CTAs, highlights |
| `analogous` | 2 colours | ±30° | Subtle variants, supporting tones |
| `triadic` | 2 colours | +120°, +240° | Vibrant multi-colour UI |
| `splitComplementary` | 2 colours | +150°, +210° | Accent with less contrast than complementary |
| `tetradic` | 3 colours | +90°, +180°, +270° | Full rich palette |

Each value is a complete 50–900 scale, ready to use:

```ts
const harmonics = generateHarmonics('#2E7D5E')

// Single colour (complementary)
harmonics.complementary[500]  // → '#7D2E45'  (the exact opposite hue)
harmonics.complementary[100]  // → a light tint of it

// Two colours (analogous — sit next to your brand on the wheel)
harmonics.analogous[0][500]   // → slightly warmer green
harmonics.analogous[1][500]   // → slightly cooler green/teal

// Two colours (triadic — bold contrast)
harmonics.triadic[0][500]     // → blue-purple
harmonics.triadic[1][500]     // → orange-yellow
```

**Options:**

```ts
// scales: false — return raw hex values instead of full scales
const harmonics = generateHarmonics('#2E7D5E', { scales: false })
harmonics.complementary  // → '#7D2E45'  (just the hex, no scale)
harmonics.analogous      // → ['#2E7D5E', '#2E5E7D']

// anchor — which shade the input maps to in the generated scales (default: 500)
const harmonics = generateHarmonics('#2E7D5E', { anchor: 400 })

// format — output format for all generated scales (default: 'hex')
const harmonics = generateHarmonics('#2E7D5E', { format: 'hsl' })
```

---

### Putting it together — a complete palette from one brand colour

```ts
import { generateScale, generateHarmonics } from '@badger-burrow/tokens'
import { extendBurrow } from '@badger-burrow/core'

const brand   = generateScale('#2E7D5E')
const palette = generateHarmonics('#2E7D5E')

extendBurrow({
  primitive: {
    color: {
      primary:   brand,
      accent:    palette.complementary,   // bold CTA colour
      warm:      palette.analogous[0],    // warm supporting tone
      cool:      palette.analogous[1],    // cool supporting tone
      neutral:   generateScale('#6B7280'), // hand-picked neutral
      success:   generateScale('#16a34a'),
      error:     generateScale('#dc2626'),
      warning:   generateScale('#d97706'),
    },
  },
  semantic: {
    light: {
      'color.bg.surface':          brand[50],
      'color.bg.elevated':         '#ffffff',
      'color.text.primary':        brand[900],
      'color.text.secondary':      brand[600],
      'color.interactive.primary': brand[500],
      'color.interactive.accent':  palette.complementary[500],
      'color.border.default':      brand[200],
      'color.status.success':      generateScale('#16a34a')[600],
      'color.status.error':        generateScale('#dc2626')[600],
      'color.status.warning':      generateScale('#d97706')[600],
    },
    dark: {
      'color.bg.surface':          brand[950] ?? '#0a1f17',
      'color.bg.elevated':         brand[900],
      'color.text.primary':        brand[50],
      'color.text.secondary':      brand[300],
      'color.interactive.primary': brand[400],
      'color.interactive.accent':  palette.complementary[400],
      'color.border.default':      brand[700],
      'color.status.success':      generateScale('#16a34a')[400],
      'color.status.error':        generateScale('#dc2626')[400],
      'color.status.warning':      generateScale('#d97706')[400],
    },
  },
})
```

Now you have a full design-system-quality palette — primary, accent, warm, cool, neutral, and semantic status colours — all generated from a single brand hex.

---

### Choosing semantic token names

Semantic tokens decouple your components from specific colours. Instead of hardcoding `green[500]`, your components say `color.interactive.primary` — which means you can swap the whole palette in one `extendBurrow()` call.

Common naming patterns:

| Token | Meaning |
|---|---|
| `color.bg.surface` | Page or card background |
| `color.bg.elevated` | Raised surfaces — modals, dropdowns |
| `color.text.primary` | Main body text |
| `color.text.secondary` | Subtitles, captions, placeholders |
| `color.text.disabled` | Greyed-out text |
| `color.interactive.primary` | Buttons, links, focus rings |
| `color.interactive.accent` | Highlight actions, badges |
| `color.interactive.hover` | Hover state of primary |
| `color.border.default` | Standard dividers and outlines |
| `color.border.focus` | Focus ring colour |
| `color.status.success` | Confirmations, positive states |
| `color.status.error` | Errors, destructive actions |
| `color.status.warning` | Caution states |
| `color.status.info` | Informational notices |

---

## 3. Extend at app entry — once, no wrapper

In your root file (`main.tsx`, `index.tsx`, `App.tsx` — wherever your app starts):

```ts
import { extendBurrow } from '@badger-burrow/core'
import { generateScale } from '@badger-burrow/tokens'

const green = generateScale('#2E7D5E')
const warm  = generateScale('#C0562B')  // your accent

extendBurrow({
  primitive: {
    color: {
      primary:   green,
      secondary: warm,
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 16,
      full: 9999,
    },
    fontFamily: {
      sans: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
  semantic: {
    light: {
      'color.bg.surface':          green[50],
      'color.bg.elevated':         '#ffffff',
      'color.text.primary':        green[900],
      'color.text.secondary':      green[600],
      'color.interactive.primary': green[500],
      'color.border.default':      green[200],
    },
    dark: {
      'color.bg.surface':          green[950] ?? '#0a1f17',
      'color.bg.elevated':         green[900],
      'color.text.primary':        green[50],
      'color.text.secondary':      green[300],
      'color.interactive.primary': green[400],
      'color.border.default':      green[700],
    },
  },
})
```

That's your entire setup. No `<ThemeProvider>` anywhere in your app.

---

## 4. Use it in components

Chamber defaults to `<div>` but renders as any semantic element via the `as` prop. This matters for accessibility — a button should be a `<button>`, a link should be an `<a>`.

```tsx
import { Chamber, Tunnel } from '@badger-burrow/web'

// Button — renders as <button> with hover + disabled states
function PrimaryButton({ children, onClick, disabled }) {
  return (
    <Chamber
      as="button"
      bg="color.interactive.primary"
      px="space.4" py="space.2"
      radius="radius.md"
      _hover={{ bg: 'color.interactive.primary.hover', cursor: 'pointer' }}
      _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
      onClick={onClick}
      disabled={disabled}
    >
      <Tunnel color="color.text.inverse" fontWeight="fontWeight.medium">
        {children}
      </Tunnel>
    </Chamber>
  )
}

// Card — renders as <article>
function Card({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Chamber
      as="article"
      bg="color.bg.elevated"
      p="space.6"
      radius="radius.md"
      shadow="md"
      display="flex"
      flexDir="column"
      gap="space.2"
      border="1px solid"
      borderColor="color.border.default"
    >
      <Tunnel as="h2" fontSize="fontSize.lg" fontWeight="fontWeight.bold" color="color.text.primary">
        {title}
      </Tunnel>
      <Tunnel color="color.text.secondary" fontSize="fontSize.sm">
        {subtitle}
      </Tunnel>
    </Chamber>
  )
}
```

**Chamber tags:** `div` · `section` · `article` · `aside` · `header` · `footer` · `main` · `nav` · `button` · `a` · `form` · `fieldset` · `ul` · `ol` · `li` · `figure` · `figcaption` · `label` · `dialog` · `details` · `summary`

---

### The rule: Chamber for layout, Tunnel for text

> **If it's visible text — it goes in a `Tunnel`. If it's a container, box, or interactive surface — it's a `Chamber`.**

`Chamber` has no text props. `Tunnel` has no layout props. They do one thing each and do it well.

```tsx
// ✅ Right
<Chamber as="section" p="space.6" display="flex" flexDir="column" gap="space.3">
  <Tunnel as="h2" fontSize="fontSize.xl" fontWeight="fontWeight.bold" color="color.text.primary">
    Account settings
  </Tunnel>
  <Tunnel as="p" fontSize="fontSize.md" color="color.text.secondary" lineHeight="lineHeight.relaxed">
    Update your name, email, and preferences.
  </Tunnel>
</Chamber>

// ❌ Wrong — don't put raw text directly in Chamber
<Chamber>Account settings</Chamber>

// ❌ Wrong — don't use Tunnel as a layout wrapper
<Tunnel display="flex" gap="space.4">...</Tunnel>
```

---

## 5. Dark mode toggle — anywhere in your app

```tsx
import { useBurrow } from '@badger-burrow/web'

function DarkModeToggle() {
  const { mode, setMode } = useBurrow()

  return (
    <Chamber
      px="space.4"
      py="space.2"
      bg="color.interactive.primary"
      radius="radius.full"
      cursor="pointer"
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      <Tunnel color="color.bg.surface" fontWeight="fontWeight.medium">
        {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
      </Tunnel>
    </Chamber>
  )
}
```

No provider. No context passing. `setMode` reaches the store directly and only components using `useBurrow()` re-render.

---

## 6. One-off styles that don't fit the props

Use `sx` for anything not covered by named props:

```tsx
<Chamber
  bg="color.bg.surface"
  p="space.4"
  sx={{
    WebkitAppRegion: 'drag',
    contain: 'layout',
    scrollbarWidth: 'thin',
  }}
/>
```

Token paths work inside `sx` too:

```tsx
<Chamber
  sx={{
    borderLeft: '4px solid',
    borderLeftColor: 'color.interactive.primary',
  }}
/>
```

---

## 7. Hover and pseudo-state styles

Inline styles can't do `:hover`, `:focus` etc — the browser doesn't support it. BadgerBurrow solves this by generating a scoped class name and injecting a `<style>` tag automatically. You never touch a CSS file.

### `_hover`, `_focus`, `_active`, `_focusVisible`, `_disabled`

Each pseudo prop accepts the same style props as Chamber/Tunnel itself:

```tsx
<Chamber
  bg="color.bg.elevated"
  p="space.4"
  radius="radius.md"
  transition="all 0.15s ease"
  _hover={{ shadow: 'md', cursor: 'pointer' }}
  _focus={{ outlineStyle: 'solid', outlineColor: 'color.interactive.primary', outlineWidth: '2px', outlineOffset: '2px' }}
  _active={{ opacity: 0.85 }}
  _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
/>
```

Token paths resolve inside pseudo props exactly as they do on the main props.

### Smart hover background — automatic shade stepping

When `bg` is a **primitive colour path**, the hover background auto-steps one shade darker with no extra code:

```tsx
<Chamber bg="color.primary.500" />
// On hover: background becomes color.primary.600  ← automatic
```

The shade scale steps: `50 → 100 → 200 → 300 → 400 → 500 → 600 → 700 → 800 → 900`. Clamps at `900`.

### `hoverScale` — use a specific colour scale

When `bg` is a semantic token (e.g. `color.bg.surface`), BadgerBurrow can't auto-detect the scale. Use `hoverScale` to tell it which one to step on:

```tsx
<Chamber bg="color.bg.surface" hoverScale="primary" />
// On hover: background becomes color.primary.100
// (primary scale, shade is inferred from bg's resolved shade or defaults to 500→600)
```

### `hoverShade` — exact shade

Pin the hover to a specific shade instead of auto-stepping:

```tsx
<Chamber bg="color.bg.surface" hoverScale="primary" hoverShade={400} />
// On hover: background-color = color.primary.400
```

### Disable the smart default

```tsx
<Chamber bg="color.primary.500" hoverScale={false} />
// No auto hover bg — you control it fully via _hover
```

### Hover semantic tokens

The default token set includes ready-made hover variants. Use them inside `_hover` for semantically consistent hover styles:

```tsx
<Chamber
  bg="color.bg.surface"
  borderColor="color.border.default"
  border="1px solid"
  _hover={{
    bg: 'color.bg.surface.hover',
    borderColor: 'color.border.default.hover',
    shadow: 'sm',
  }}
/>
```

Available hover tokens:

| Token | Light | Dark |
|---|---|---|
| `color.interactive.primary.hover` | primary.600 | primary.300 |
| `color.interactive.secondary.hover` | secondary.600 | secondary.300 |
| `color.bg.surface.hover` | neutral.100 | neutral.800 |
| `color.bg.elevated.hover` | neutral.50 | neutral.700 |
| `color.text.primary.hover` | neutral.700 | neutral.200 |
| `color.text.secondary.hover` | neutral.700 | neutral.200 |
| `color.border.default.hover` | neutral.400 | neutral.500 |

You can override any of these via `extendBurrow`:

```ts
extendBurrow({
  semantic: {
    light: { 'color.bg.surface.hover': green[200] },
    dark:  { 'color.bg.surface.hover': green[800] },
  },
})
```

### Tunnel pseudo styles

`_hover`, `_focus`, `_active`, `_focusVisible`, `_disabled` all work on Tunnel too. Common use: underline and colour change on link-style text:

```tsx
<Tunnel
  color="color.interactive.primary"
  fontWeight="fontWeight.medium"
  _hover={{ color: 'color.interactive.primary.hover', textDecoration: 'underline' }}
  onClick={handleClick}
  sx={{ cursor: 'pointer' }}
>
  View details
</Tunnel>
```

---

## 8. Responsive props

Any prop that takes a token (spacing, colour, size, typography…) **and** the
layout/flex/grid props (`flexDir`, `align`, `justify`, `display`, the grid
templates, etc.) can take a **responsive object** instead of a single value.
Keys are breakpoint names; values cascade upward like CSS `min-width` queries —
a breakpoint inherits the nearest smaller one that is set.

```tsx
// Plain — same at every size
<Chamber p="space.4" />

// Responsive — base everywhere, then overrides from each breakpoint up
<Chamber p={{ base: 'space.2', md: 'space.4', lg: 'space.6' }} />
```

### Reflowing layout

This is the common case: stack on mobile, lay out in a row on larger screens —
and switch alignment to match.

```tsx
<Chamber
  flexDir={{ base: 'column', md: 'row' }}
  align={{ base: 'flex-start', lg: 'center' }}
  justify={{ base: 'flex-start', md: 'space-between' }}
  gap={{ base: 'space.2', md: 'space.6' }}
>
  <Tunnel fontSize={{ base: 'fontSize.lg', md: 'fontSize.2xl' }}>Heading</Tunnel>
  <Chamber>…</Chamber>
</Chamber>
```

Grid reflows the same way:

```tsx
<Chamber
  display="grid"
  gridTemplateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
  gap="space.4"
/>
```

### Breakpoints

Defaults (override per project via `extendBurrow({ breakpoints: … })`):

| Key | Default | Applies at |
|---|---|---|
| `base` | — | always (the unprefixed value) |
| `sm` | `576px` | ≥ 576 px |
| `md` | `768px` | ≥ 768 px |
| `lg` | `992px` | ≥ 992 px |
| `xl` | `1200px` | ≥ 1200 px |

You can add your own — `xs`, `xxl`, anything — and they're ordered automatically
by their pixel value:

```ts
extendBurrow({
  breakpoints: { xs: '400px', sm: '576px', md: '768px', lg: '992px', xl: '1200px', xxl: '1440px' },
})

// then, with full type-checking and autocomplete:
<Chamber p={{ base: 'space.1', xs: 'space.2', xxl: 'space.10' }} />
```

### How it resolves per platform

- **Web** — the `base` value is written as an inline style; each named
  breakpoint injects a scoped `@media (min-width: …)` rule via a
  `[data-bb-responsive]` style tag. Two elements with identical responsive
  configs share a single style tag.
- **Native** — there are no media queries, so BadgerBurrow reads the current
  window width (via `useWindowDimensions`, so it updates on rotation) and
  resolves each responsive prop to the single value for the active breakpoint.

Either way the API is identical — write the same responsive object on both
platforms.

> Responsive objects are **not** supported inside pseudo props (`_hover` etc.) —
> those resolve to a single state, not a breakpoint range.

---

## 9. Motion — transitions from tokens

The `transition` and `animation` timing props accept **motion token keywords**
as well as raw CSS, so you don't hand-write durations and easings.

```tsx
// Keyword — expands to `all 150ms cubic-bezier(0.4, 0, 0.2, 1)`
<Chamber transition="fast" _hover={{ bg: 'color.interactive.primary.hover' }} />

// Granular — each sub-prop resolves its own token
<Chamber
  transitionProperty="opacity, transform"
  transitionDuration="normal"          // → 300ms
  transitionTimingFunction="decelerate" // → cubic-bezier(0, 0, 0.2, 1)
/>

// Raw CSS still works — anything that isn't a known key passes through
<Chamber transition="opacity 0.2s ease" />
```

**Duration keys** (`tokens.motion.duration`): `instant` (0) · `fast` (150) ·
`normal` (300) · `slow` (600) · `glacial` (1000) — all in ms.

**Easing keys** (`tokens.motion.easing`): `standard` · `decelerate` ·
`accelerate` · `sharp`.

These resolve for `transition`, `transitionDuration`, `transitionTimingFunction`,
`transitionDelay`, and the matching `animation*` sub-props. Override any of them
per project via `extendBurrow({ motion: { duration: { fast: 120 } } })`.

> Motion props are **web-only** — React Native has no CSS transitions, so they're
> stripped from native styles. Use Reanimated with `tokens.motion.spring` /
> `tokens.motion.duration` for native animation.

---

## 10. Reusable variants with `createVariants`

Define them once, use the resolver in any component:

```ts
import { createVariants } from '@badger-burrow/core'
import { useBurrow } from '@badger-burrow/web'

const buttonSize = createVariants({
  sm: { padding: 'space.2', fontSize: 'fontSize.sm' },
  md: { padding: 'space.4', fontSize: 'fontSize.md' },
  lg: { padding: 'space.6', fontSize: 'fontSize.lg' },
})

function Button({ size = 'md', children }) {
  const { tokens, mode } = useBurrow()
  const sizeStyles = buttonSize(size, tokens, mode)

  return (
    <Chamber
      bg="color.interactive.primary"
      radius="radius.md"
      style={sizeStyles}
    >
      <Tunnel color="color.bg.surface" fontWeight="fontWeight.medium">
        {children}
      </Tunnel>
    </Chamber>
  )
}
```

---

## 11. React Native

Everything above applies to React Native too — same `extendBurrow()`, same token paths, same prop names. Swap the import and you're done.

```tsx
// Web
import { Chamber, Tunnel, useBurrow } from '@badger-burrow/web'

// Native — same API, different import
import { Chamber, Tunnel, useBurrow } from '@badger-burrow/native'
```

### What's different in native

**Shadow** resolves to a native elevation object, not a CSS string. The default tokens include both formats:

```ts
// tokens.primitive.shadow.md
{
  web:    '0 4px 6px -1px rgba(0,0,0,0.1), ...',  // used by web
  native: { elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 }  // used by native
}
```

Pass the same token path on both platforms — BadgerBurrow picks the right format automatically:

```tsx
<Chamber shadow="md" p="space.4" bg="color.bg.elevated">
  {/* web: box-shadow CSS string */}
  {/* native: elevation object spread into style */}
</Chamber>
```

**No `as` prop on Chamber** — in React Native you always render `<View>`. For interactive surfaces use `Pressable` from react-native and wrap a Chamber inside it.

**No pseudo props** — `_hover`, `_focus`, `_active` etc. don't exist on native. React Native doesn't have a DOM or CSS pseudo-classes. Use `Pressable`'s `pressed` state instead:

```tsx
import { Pressable } from 'react-native'
import { Chamber, Tunnel } from '@badger-burrow/native'

function PrimaryButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Chamber
          bg="color.interactive.primary"
          px="space.4" py="space.2"
          radius="radius.md"
          style={{ opacity: pressed ? 0.85 : 1 }}
        >
          <Tunnel color="color.bg.surface" fontWeight="fontWeight.medium">
            {children}
          </Tunnel>
        </Chamber>
      )}
    </Pressable>
  )
}
```

**No `as` on Tunnel** — always renders `<Text>`. Use native heading hierarchy via `accessibilityRole` if needed:

```tsx
<Tunnel
  fontSize="fontSize.2xl"
  fontWeight="fontWeight.bold"
  color="color.text.primary"
  accessibilityRole="header"
>
  Page title
</Tunnel>
```

**Numeric values are unitless** — React Native styles don't use `px`. BadgerBurrow passes raw numbers through:

```ts
tokens.primitive.space[4]  // → 16  (web adds 'px' → '16px', native passes 16)
```

**Responsive props** (section 8) work on native too — instead of `@media`
queries, the active breakpoint is derived from the live window width, so the
same `flexDir={{ base: 'column', md: 'row' }}` reflows on rotation.

### Full cross-platform example

The same `extendBurrow()` call at app entry works for both platforms. Import from the right package per platform and your components are automatically styled:

```ts
// app entry — same on both platforms
import { extendBurrow } from '@badger-burrow/core'
import { generateScale } from '@badger-burrow/tokens'

extendBurrow({
  primitive: { color: { primary: generateScale('#744577') } },
  semantic: {
    light: { 'color.interactive.primary': '#744577' },
    dark:  { 'color.interactive.primary': '#c49bc6' },
  },
})
```

```tsx
// Web component
import { Chamber, Tunnel } from '@badger-burrow/web'

// React Native component — identical props
import { Chamber, Tunnel } from '@badger-burrow/native'

function Card({ title }) {
  return (
    <Chamber bg="color.bg.elevated" p="space.4" radius="radius.md" shadow="md">
      <Tunnel fontSize="fontSize.lg" fontWeight="fontWeight.bold" color="color.text.primary">
        {title}
      </Tunnel>
    </Chamber>
  )
}
```

---

## Summary

| Step | What you do |
|---|---|
| Install (web) | `npm install @badger-burrow/tokens @badger-burrow/core @badger-burrow/web` |
| Install (native) | `npm install @badger-burrow/tokens @badger-burrow/core @badger-burrow/native` |
| Generate colours | `generateScale(brandHex)` → full 50–900 scale |
| Find harmonics | `generateHarmonics(brandHex)` → complementary, analogous, triadic etc. |
| Configure | `extendBurrow({ primitive, semantic })` once at app entry — no wrapper, works on both platforms |
| Layout | `<Chamber>` for boxes and containers — renders `<div>` on web, `<View>` on native |
| Text | `<Tunnel>` for all text — renders `<span>` etc. on web, `<Text>` on native |
| Dark mode | `useBurrow()` → `setMode('dark')` from anywhere |
| Responsive | Pass a breakpoint object to any token prop or layout/flex/grid prop — `flexDir={{ base: 'column', md: 'row' }}` (web `@media`, native window width) |
| Motion (web) | `transition="fast"` and `transitionDuration`/`transitionTimingFunction` resolve motion tokens — keys `instant`/`fast`/`normal`/`slow`/`glacial`, `standard`/`decelerate`/`accelerate`/`sharp` |
| Pseudo states (web) | `_hover` `_focus` `_active` `_focusVisible` `_disabled` on Chamber and Tunnel |
| Interactive (native) | Use `Pressable` with pressed state — no pseudo props in React Native |
| Shadow | Same token path on both platforms — web gets CSS string, native gets elevation object |
| Smart hover bg | Primitive bg paths auto-step one shade darker on hover (web only) |
| Hover scale | `hoverScale="primary"` + optional `hoverShade={400}` (web only) |
| Escape hatch | `sx` prop for anything not covered by named props |
| Variants | `createVariants` for reusable size/style maps |
