<p align="center">
  <img src="./assets/badger-logo.png" alt="BadgerBurrow" width="120" />
</p>

# BadgerBurrow — Usage Guide

A simple, example-driven guide to using the **burrow** styling library. If you just want to get a screen built, start at [Setup](#2-setup) and [Components](#4-components).

---

## 1. What is burrow?

burrow is a **token-driven, provider-less styling system** for React Native (Expo) apps. You style components with short prop names (`p="4"`, `bg="bg.elevated"`, `color="text.primary"`, `radius="lg"`) that resolve against a central token set, and you get automatic light/dark theming from a single brand colour. It ships as three packages:

| Package | What it does |
|---|---|
| `@purple-brock/burrow-tokens` | The token data + pure colour maths. Default tokens, `generateScale` / `generateHarmonics` / `generateTheme`, and the TypeScript types for every token path. No React. |
| `@purple-brock/burrow-core` | The engine. The global store (`BadgerBase`), token resolution (`resolveToken`), `extendBurrow`/`mergeBurrow`, style builders, responsive + pseudo + sx logic. No React Native. |
| `@purple-brock/burrow-native` | The components you actually render: `Chamber` (View) and `Tunnel` (Text), plus the `useBurrow` hook. |

> There is also a `@purple-brock/burrow-web` package that ships DOM `Chamber`/`Tunnel` for plain React (react-dom). Native is what Badger apps use, but burrow is not RN-only — see below.

---

## Requirements & platform support

burrow is a **React-based** library. The split between pure data and the React layer matters, so here it is precisely:

- **React is required for the components.** `@purple-brock/burrow-native` and `@purple-brock/burrow-web` declare `react` (`>=18.0.0`) as a peer dependency; `@purple-brock/burrow-core` also peer-depends on `react` (it hosts the hook glue). If you render any burrow component, you are in a React app.
- **Tokens are React-free.** `@purple-brock/burrow-tokens` has **no** peer dependencies at all — it's pure TypeScript (OKLCH colour maths: `generateScale` / `generateHarmonics` / `generateTheme`, plus the default token data and types). You can import and run it anywhere, React or not, e.g. to generate a palette in a build script.

**It is not tied to Expo.** `@purple-brock/burrow-native` peer-depends only on `react` (`>=18.0.0`) and `react-native` (`>=0.73.0`), and its source imports nothing but `react`, `react-native`, and the burrow core/tokens packages — **no `expo` / `expo-*` dependency anywhere.** So the components work in **any** React Native app: Expo *or* bare/plain React Native. (Badger apps happen to use Expo, and this guide's examples show Expo entry files, but that's a choice, not a requirement.)

**Web React works too.** `@purple-brock/burrow-web` ships ready-made DOM `Chamber`/`Tunnel` (peer-dep `react`, with `react-dom`) — these are real components, not RN-on-web. And because `burrow-core` can emit CSS custom properties (`toCssVar` / `buildCssVarMap` / `injectCssVars` in `cssVars.ts`) and `burrow-tokens` is framework-agnostic, you can also consume tokens directly as CSS variables or raw values in any web setup.

| Target | Package(s) | Requirement |
|---|---|---|
| **React Native** (Expo **or** bare) | `burrow-native` + core + tokens | `react >=18`, `react-native >=0.73`. No Expo coupling. |
| **Web React** (DOM) | `burrow-web` + core + tokens | `react >=18`, `react-dom`. Ready-made DOM components. |
| **Any JS/TS** (palette/token generation only) | `burrow-tokens` | None — pure TypeScript, no React. |

---

## 2. Setup

### 2a. Install your brand theme once, at app startup

burrow ships sensible defaults (a purple `#8B5CF6` brand). To use **your** brand, generate a full theme from one hex and feed it to `extendBurrow` **once**, before anything renders (top of your root layout / entry file):

```ts
// app/_layout.tsx (or your entry file) — runs once at module load
import { extendBurrow } from '@purple-brock/burrow-core'
import { generateTheme } from '@purple-brock/burrow-tokens'

const theme = generateTheme('#744577') // your brand hex
extendBurrow(theme)                     // installs primitives + semantic overrides globally
```

`generateTheme(brand)` returns `{ primitive, semantic }`. `extendBurrow` deep-merges it onto the built-in defaults and stores the result in the global `BadgerBase` store. Everything you didn't override (backgrounds, text, borders, feedback, spacing, radius, motion…) keeps cascading from the defaults.

You can layer extra tokens later without wiping the brand using `mergeBurrow` (merges onto the *current* tokens, not the defaults):

```ts
import { mergeBurrow } from '@purple-brock/burrow-core'
mergeBurrow({ primitive: { color: { ink: generateScale('#1a1a2e') } } })
```

Or skip `generateTheme` and override raw tokens directly:

```ts
extendBurrow({ primitive: { color: { primary: { 500: '#744577' } } } })
```

### 2b. It is provider-less — there is NO ThemeProvider

burrow has **no React context** and **no `<ThemeProvider>`**. Theme state lives in a global pub/sub store. You do **not** wrap your app in anything. Just render your `<Stack>` / screens directly and use `Chamber`/`Tunnel`.

Switch light/dark by calling the global setter — every burrow component re-renders automatically (they subscribe via `useSyncExternalStore`):

```ts
import { BadgerBase } from '@purple-brock/burrow-core'

BadgerBase.setMode('dark')   // or 'light'
```

Inside a component you can also use the hook:

```tsx
import { useBurrow } from '@purple-brock/burrow-native'

function ModeToggle() {
  const { mode, setMode } = useBurrow()
  return <Button title={mode} onPress={() => setMode(mode === 'light' ? 'dark' : 'light')} />
}
```

> Per the Badger house rule: stay provider-less. Strip any `ThemeProvider` from the Expo template and theme **only** through burrow tokens + `setMode`.

---

## 3. The token system

### How resolution works

Three layers, resolved in this order (`resolveToken` in core):

```
component prop   →   semantic token   →   primitive scale   →   raw value
  bg="bg.surface"    {color.neutral.100}   color.neutral.100      "#f2f2f2"
```

1. **Primitive scales** — every colour is a 10-step scale: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900` (50 = near-white, 900 = near-black). Scales: `primary`, `secondary`, `neutral`, `ink`, `success`, `error`, `warning`, `info`. You reference these directly as `primary.500`, `neutral.100`, etc.
2. **Semantic tokens** — named roles like `bg.surface` or `text.primary`. These are defined **per mode** (`light` / `dark`) and usually point at a primitive via a `{color.neutral.100}` reference (resolved against primitives), though some are raw values (`bg.elevated` is literally `#ffffff` in light mode).
3. **Resolution rule**: look up the path in `semantic[mode]`. If found and it's a `{reference}`, resolve against primitives; if it's a raw value, return it. If not in semantic at all, try the primitive tree directly (this is how `space.4`, `radius.md` resolve).

Mode only matters for **semantic** tokens. Primitive paths (`primary.500`) resolve identically in light and dark.

### Every semantic colour token

These are the full set of semantic colour paths (use them **without** the `color.` prefix in props — `bg="bg.surface"`, `color="text.primary"`):

| Token | Light → | Dark → |
|---|---|---|
| `interactive.primary` | `{primary.600}` | `{primary.600}` |
| `interactive.primary.hover` | `{primary.800}` | `{primary.800}` |
| `interactive.secondary` | `{secondary.600}` | `{secondary.600}` |
| `interactive.secondary.hover` | `{secondary.800}` | `{secondary.800}` |
| `bg.surface` | `{neutral.100}` | `{neutral.900}` |
| `bg.surface.hover` | `{neutral.200}` | `{neutral.800}` |
| `bg.elevated` | `#ffffff` | `{neutral.800}` |
| `bg.elevated.hover` | `{neutral.50}` | `{neutral.700}` |
| `bg.overlay` | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` |
| `text.primary` | `{ink.900}` | `{ink.50}` |
| `text.primary.hover` | `{ink.700}` | `{ink.200}` |
| `text.secondary` | `{ink.600}` | `{ink.400}` |
| `text.secondary.hover` | `{ink.700}` | `{ink.200}` |
| `text.inverse` | `#ffffff` | `#ffffff` |
| `border.default` | `{neutral.200}` | `{neutral.700}` |
| `border.default.hover` | `{neutral.400}` | `{neutral.500}` |
| `feedback.success` | `{success.500}` | `{success.400}` |
| `feedback.error` | `{error.500}` | `{error.400}` |
| `feedback.warning` | `{warning.500}` | `{warning.400}` |
| `feedback.info` | `{info.500}` | `{info.400}` |

> Note: `interactive.*` are deliberately **mode-consistent** — the brand shade and its label stay the same in light and dark, so a button never changes identity when you toggle. Backgrounds, text and borders are **mode-aware** (they flip).

### Other token categories (all accepted values)

| Category | Prop(s) | Values → resolved |
|---|---|---|
| **space** | `p/px/py/pt…`, `m/mx…`, `gap`, `w`, `h`, `inset`, `top`… | `0`→0, `1`→4, `2`→8, `3`→12, `4`→16, `5`→20, `6`→24, `8`→32, `10`→40, `12`→48, `16`→64; aliases `sm`→8, `md`→16, `lg`→24, `xl`→32 (px) |
| **radius** | `radius`, `borderTopLeftRadius`… | `none`→0, `sm`→4, `md`→8, `lg`→16, `xl`→24, `full`→9999 |
| **fontSize** | `fontSize` | `xs`→12, `sm`→14, `md`→16, `lg`→20, `xl`→24, `2xl`→32, `3xl`→40 |
| **fontWeight** | `fontWeight` | `normal`→400, `medium`→500, `semibold`→600, `bold`→700 |
| **lineHeight** | `lineHeight` | `tight`→1.25, `normal`→1.5, `relaxed`→1.75 |
| **letterSpacing** | `letterSpacing` | `tight`→-0.5, `normal`→0, `wide`→0.5, `wider`→1 |
| **fontFamily** | `fontFamily` | `sans`→`system-ui, sans-serif`, `mono`→`monospace` |
| **shadow** | `shadow` | `none`, `sm`, `md`, `lg` (native: elevation object) |
| **motion duration** | `transition`, `transitionDuration`, `animationDuration`, `*Delay` | `instant`→0, `fast`→150, `normal`→300, `slow`→600, `glacial`→1000 (ms) |
| **motion easing** | `transitionTimingFunction`, `animationTimingFunction` | `standard`, `decelerate`, `accelerate`, `sharp` (cubic-beziers) |
| **breakpoints** | responsive object keys | `sm`→576px, `md`→768px, `lg`→992px, `xl`→1200px (+ implicit `base`) |

> Any raw value also works everywhere — `p={20}`, `w="100%"`, `bg="#ff0000"`, `radius={12}` — because every token type stays open to arbitrary strings/numbers. Numbers on size/space props become px on web and stay numbers on native.

### Adding & overriding semantic tokens with spread

The semantic layer is just an object keyed by mode (`semantic: { light: {…}, dark: {…} }`), where each key is a full token path (`color.feedback.error`) pointing at a `{color.x.y}` reference or a raw value. `extendBurrow` **deep-merges** your input onto the defaults, and `resolveToken` does a **generic** lookup — `tokens.semantic[mode][path]` — so you're never limited to burrow's built-in token names. Spreading lets you change exactly one key per mode without clobbering its siblings.

> Always **spread onto `generateTheme`'s output** — never hand-author the whole semantic map. You only want to touch the one or two keys you're changing; everything else must keep cascading from the generated AA-checked defaults.

#### Pattern 1 — override an existing token, per-mode

Real example: the default destructive red (`feedback.error` → `{color.error.500}`) is fine on light surfaces but can fail AA on a dark background. Seed a brand `error` primitive scale, then override **only the dark** `color.feedback.error` so it picks a lighter shade:

```ts
const generated = generateTheme(brandHex, { secondary: secondaryHex })

extendBurrow({
  primitive: { color: { ...generated.primitive.color, error: generateScale('#B23A2E') } },
  semantic: {
    ...generated.semantic,
    dark: {
      ...generated.semantic.dark,
      'color.feedback.error': '{color.error.300}', // lighter shade → clears AA on dark bg
    },
  },
})
```

The two spreads preserve every other token: `...generated.primitive.color` keeps all the other scales while you swap in your `error` one, and `...generated.semantic` + `...generated.semantic.dark` keep every other semantic key intact. **Light** is never mentioned, so it keeps the default (`error.500`); only the one dark key changes.

#### Pattern 2 — add a brand-new custom semantic token

burrow doesn't ship a `color.danger` token — but you can add one and it will resolve, because the lookup is generic and `ColorToken` is open (`string & {}` in `paths.ts`). Give it its own light/dark values and use it through the open `color` prop:

```ts
extendBurrow({
  semantic: {
    ...generated.semantic,
    light: { ...generated.semantic.light, 'color.danger': '{color.error.500}' },
    dark:  { ...generated.semantic.dark,  'color.danger': '{color.error.300}' },
  },
})

// then in a component:
<Tunnel color="danger">Delete</Tunnel>   // resolves color.danger per mode
```

**Why this works:** `resolveToken('color.danger', tokens, mode)` finds your key in `semantic[mode]`, sees a `{color.error.x}` reference, and resolves it against the primitive scales — exactly the same path a built-in token takes. You can reference a primitive (`{color.error.300}`) or give a raw hex (`'#B23A2E'`) just as well.

**The one trade-off:** custom names lose autocomplete — they fall under the `string & {}` escape hatch in the `ColorToken` type, so your editor won't suggest `"danger"`. They still fully resolve and switch by mode; you just don't get the typed hint.

Whichever pattern you use, keep the guidance from elsewhere in this doc: respect the **fill-vs-text** split (brand/feedback colours on fills with `text.inverse`, not as small text), and decide deliberately whether your token should be **mode-aware** (different light/dark values, like `feedback.*`) or **mode-consistent** (the same value in both, like `interactive.*`).

---

## 4. Components

Only two visual primitives ship from native: **`Chamber`** (the box) and **`Tunnel`** (the text). Plus the **`useBurrow`** hook.

### Short-form props

The prop name supplies the category, so the value omits the prefix:

```tsx
<Chamber bg="bg.elevated" p="4" radius="lg" />
//        ^semantic colour  ^space=16  ^radius=16

<Tunnel color="text.primary" fontSize="lg" fontWeight="semibold" />
```

The redundant full form (`p="space.4"`, `color="color.text.primary"`) still works for back-compat but logs a dev warning — prefer the short form.

### Chamber — the box / layout primitive

Renders a `<View>`. Use it for everything structural: cards, rows, stacks, spacers, backgrounds. It accepts the full box prop set — background, padding/margin, size, flex, grid, border/radius, effects, position, and even font/text props (so you can style text inside without a wrapper). Style priority: **`sx` → named props → `style`**.

```tsx
import { Chamber, Tunnel } from '@purple-brock/burrow-native'

// A card
<Chamber bg="bg.elevated" p="4" radius="lg" shadow="sm" gap="2">
  <Tunnel fontSize="lg" fontWeight="bold" color="text.primary">Groceries</Tunnel>
  <Tunnel color="text.secondary">£42.10 left this week</Tunnel>
</Chamber>

// A row
<Chamber flexDir="row" justify="space-between" align="center" px="4" py="3">
  <Tunnel color="text.primary">Rent</Tunnel>
  <Tunnel color="feedback.error" fontWeight="semibold">-£900</Tunnel>
</Chamber>
```

Key Chamber props: `bg`, `p/px/py/pt/pb/pl/pr`, `m/mx/my/…`, `w/h/minW/maxW/minH/maxH`, `flexDir`, `align`, `justify`, `wrap`, `gap`, `flex/flexGrow/flexShrink/flexBasis`, grid props, `border*`, `radius`, `borderColor`, `shadow` (`none|sm|md|lg`), `opacity`, `position/top/right/bottom/left/zIndex`, `overflow`, `transform`, `sx`, `__debug`. On native, use a `Pressable`'s own state for pressed/focused — the pseudo props (`_hover` etc.) are web-oriented.

### Tunnel — the text primitive

Renders a `<Text>`. **Every piece of visible text goes in a Tunnel.** It has font/text props only — no layout (use a Chamber to position it).

```tsx
<Tunnel fontSize="xl" fontWeight="bold" color="text.primary">Page title</Tunnel>

<Tunnel color="text.secondary" truncate>A very long single line that gets an ellipsis…</Tunnel>

<Tunnel lineClamp={2}>Clamp me to two lines maximum, then ellipsis.</Tunnel>
```

Key Tunnel props: `color`, `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `letterSpacing`, `textAlign`, `textTransform`, `textDecoration`, and helpers `italic`, `truncate` (→ `numberOfLines={1}` on native), `nowrap`, `lineClamp={n}`. Plus `sx`, `style`, `testID`, `__debug`.

### useBurrow — read tokens / mode

```tsx
const { tokens, mode, setMode } = useBurrow()
```

Returns the live token set, the current `'light' | 'dark'` mode, and a `setMode` setter. Re-renders on any token or mode change.

### The `sx` escape hatch

Both components take an `sx` object — token-aware raw CSS for anything without a named prop. Values are tried as token paths first, numbers get px (web):

```tsx
<Chamber sx={{ padding: 'space.4', gap: 'space.2', borderRadius: 'radius.md' }} />
```

### `__debug`

`__debug` highlights the element and logs what burrow resolved (styles, render count, size). No-op in production.

---

## 5. Colour generation

All in `@purple-brock/burrow-tokens`. Pure maths in OKLCH space — no React, no DOM.

### `generateScale(hex, options?)`

Turns one hex into a full 50–900 scale with perceptually even lightness steps. The input colour anchors the scale (default at shade `500`).

```ts
import { generateScale } from '@purple-brock/burrow-tokens'

generateScale('#8B5CF6')
// → { 50:'#f5f3ff', 100:'…', … 500:'#8b5cf6', … 900:'#…' }

generateScale('#8B5CF6', { anchor: 600, format: 'oklch' })
```

Options: `anchor` (one of 50…900, default 500 — which shade the input maps to) and `format` (`'hex' | 'rgb' | 'hsl' | 'oklch'`, default `'hex'`). Invalid hex or anchor throws.

### `generateHarmonics(hex, options?)`

Derives related hues by rotating the hue in OKLCH. Returns a scale (or hex if `scales:false`) per harmony:

| Harmony | Hue rotation(s) from brand |
|---|---|
| `complementary` | +180° |
| `analogous` | +30°, −30° |
| `triadic` | +120°, +240° |
| `splitComplementary` | +150°, +210° |
| `tetradic` | +90°, +180°, +270° |

```ts
const h = generateHarmonics('#8B5CF6')
h.complementary       // a PrimitiveColorScale (single)
h.triadic             // array of two scales
generateHarmonics('#8B5CF6', { scales: false }).complementary // → '#…' hex
```

### `generateTheme(brand, options?)`

The one you want at app startup. One brand hex → a complete, **AA-checked** light + dark theme `{ primitive, semantic }` ready for `extendBurrow`.

What it does:
- Builds the **primary** scale from your brand.
- Auto-derives the **secondary** scale from the brand using a colour harmony (default `complementary`). Override with `secondary: '#hex'` or pick another `harmony`.
- Picks the interactive button shade + label colour **per-brand for WCAG AA** — a white label is used when it passes; for light/warm brands (yellow, lime, cyan) where white would fail, the label flips to dark instead of muddying the brand. Hover steps two shades toward more contrast.
- Provides default **`neutral`** (`#808080`, surfaces/borders) and **`ink`** (`#71717A`, text) scales. **These are NOT brand-derived** — they're independent greys so surfaces can stay light without weakening text contrast, and text can carry its own faint cast.

```ts
import { generateTheme } from '@purple-brock/burrow-tokens'
import { extendBurrow } from '@purple-brock/burrow-core'

// Worked example: brand purple, teal secondary by hand, custom ink
const theme = generateTheme('#744577', {
  secondary: '#14B8A6',   // skip harmony, set secondary directly
  ink: '#1f2937',         // cooler/darker text
  // neutral defaults to #808080
})
extendBurrow(theme)
```

Options: `harmony` (`'complementary' | 'analogous' | 'triadic' | 'splitComplementary'`, default complementary), `secondary` (explicit hex, overrides harmony), `neutral` (default `#808080`), `ink` (default `#71717A`).

---

## 6. Light / dark mode

- **Resolution**: semantic tokens are stored separately for `light` and `dark`. `resolveToken(path, tokens, mode)` reads `semantic[mode]`. Primitive tokens (`primary.500`, `space.4`) ignore mode.
- **Current mode** lives in the global store, default `'light'`.
- **Switch** with `BadgerBase.setMode('dark')` (or `useBurrow().setMode`). Setting the same mode is a no-op; setting a new one notifies all subscribers and every Chamber/Tunnel re-renders.
- **Gotcha — verify AA on the real surface.** `generateTheme` only guarantees AA for the *interactive button* label/shade pairing. Other semantic shades (e.g. `text.secondary` = `ink.400` on `bg.surface` in dark) are reasonable defaults but are **not** contrast-verified by the library. Check small/secondary text against the actual surface it sits on, especially in dark mode, and bump the shade if it fails.

---

## 7. Common patterns + gotchas

- **Provider-less, always.** No `ThemeProvider`, no context. Strip the Expo template's theme provider; render `<Stack>` directly; toggle via `BadgerBase.setMode`. A parallel react-navigation theme system will fight burrow — don't add one.
- **Don't use brand purple as small text on a surface.** `interactive.primary` (brand) as tiny text/icons on `bg.surface`/`bg.elevated` washes out — worst in dark mode. For an affordance, use a **filled pill**: a Chamber with `bg="interactive.primary"` + `color="text.inverse"`. For plain links/labels, use `text.primary`. Keep brand purple for *fills*, not *text*.
- **Fill-vs-text split.** Brand colour belongs on filled backgrounds (buttons, pills, badges) where it pairs with `text.inverse`. Text content uses the `ink`-derived `text.*` tokens. Surfaces/borders use the `neutral`-derived `bg.*` / `border.*` tokens.
- **Mode-aware vs mode-consistent tokens.** `bg.*`, `text.*`, `border.*`, `feedback.*` flip between light/dark. `interactive.*` stay the same shade in both modes by design — don't expect your brand button to lighten in dark mode.
- **Layering tokens.** `extendBurrow` always merges onto the *defaults* (call it once for the brand). `mergeBurrow` merges onto the *current* tokens (use it for feature-module additions so you don't clobber the brand).
- **Every visible string in a Tunnel.** Raw text in a Chamber won't be styled by token props and may warn in RN. Wrap it.
- **Style priority** on both components: `sx` (lowest) → named props → `style` (highest / wins).

---

## 8. Cheat sheet

```tsx
// Setup (once, at entry)
extendBurrow(generateTheme('#744577'))

// Box
<Chamber
  bg="bg.elevated"        // surface colour
  p="4"                   // padding 16
  px="6" py="3"           // axis padding
  gap="2"                 // flex gap 8
  flexDir="row"           // row | column
  align="center"          // alignItems
  justify="space-between" // justifyContent
  radius="lg"             // 16
  shadow="sm"             // none|sm|md|lg
  borderColor="border.default"
/>

// Text
<Tunnel
  color="text.primary"    // or text.secondary / text.inverse / feedback.error
  fontSize="lg"           // xs|sm|md|lg|xl|2xl|3xl
  fontWeight="semibold"   // normal|medium|semibold|bold
  truncate                // 1-line ellipsis
/>

// Mode
BadgerBase.setMode('dark')
const { mode, setMode } = useBurrow()
```

| Most-used prop | Common values |
|---|---|
| `bg` | `bg.surface`, `bg.elevated`, `interactive.primary`, `primary.500` |
| `color` | `text.primary`, `text.secondary`, `text.inverse`, `feedback.error` |
| `p` / `gap` / `m` | `0 1 2 3 4 5 6 8 10 12 16` (×4 px) or `sm md lg xl` |
| `radius` | `none sm md lg xl full` |
| `fontSize` | `xs sm md lg xl 2xl 3xl` |
| `fontWeight` | `normal medium semibold bold` |
| `shadow` | `none sm md lg` |
