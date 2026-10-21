# Changelog

All notable changes to BadgerBurrow are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The packages are not yet published; entries accumulate under **Unreleased** until
the first release. **Publish with `pnpm publish -r`** (not `npm publish`): pnpm
rewrites the `workspace:*` dependencies to real versions.

## [Unreleased]

### Changed (audit 2026-10-21)

- **Default theme is now WCAG-AA readable** (`@purple-brock/burrow-tokens`). Feedback colours are
  used as text, so they moved to the lightest step that clears 4.5:1 on both `bg.surface` and
  `bg.elevated`: light `success.800`, `error.600`, `warning.800`, `info.600`; dark `error.300`
  and `text.secondary` → `ink.300`. Pinned by `contrast.test.ts`. Apps that override these
  semantic keys are unaffected.
- **Packaging:** MIT license (root + each package), `files` = `dist` + LICENSE + README (no
  source/tests published), `publishConfig.access: public`, `sideEffects: false`, `exports` lists
  `types` first plus a `default` condition, per-package READMEs.
- **Tooling:** `lint` (which did nothing) replaced by a real `typecheck` task; GitHub Actions CI
  runs build + typecheck + test; dev dependencies updated (dev-only advisories 51 → 15).

### Fixed (audit 2026-10-21)

- **`BadgerBase.setMode()` ignores anything but `'light'`/`'dark'`** — an invalid mode used to make
  every style lookup crash. `resolveToken` and `buildCssVarMap` also fall back to light.
- **Dev warning for unknown token paths** — `color="text.primry"` now logs a one-time
  `[BadgerBurrow] Unknown color token` warning in development instead of silently passing an
  invalid colour through.

### Added

- **`generateTheme()`** (`@purple-brock/burrow-tokens`) — one brand hex → a complete,
  AA-checked theme `{ primitive, semantic }` ready for `extendBurrow`. Builds the
  primary scale, a harmony-derived secondary, and `neutral` + `ink` greys, and
  picks each interactive button's shade + label colour so it stays WCAG-AA
  readable for **any** hue (light brands get a dark label automatically). Pure
  utility — no React/DOM — so it behaves identically with and without SSR.
  Options: `harmony`, `secondary`, `neutral`, `ink`.
- **Server-side rendering** (`@purple-brock/burrow-web`) — `createStyleRegistry()` +
  `adoptServerStyles()` collect pseudo/responsive `<style>` rules during
  `renderToString` and prime the client cache so hydration never duplicates them.

### Fixed

- **Pseudo-state styles now win the cascade over the inline base.** Base token
  props (`bg`, etc.) are applied as inline styles, which outrank a normal
  `.bb:hover { … }` class rule — so `_hover`/`_focus`/`_active`/`_disabled`
  background overrides (and smart-hover shade-stepping) were silently ignored.

  > **Behaviour change:** pseudo-class declarations are now emitted
  > `!important`. This is scoped **only** to the pseudo rules
  > (`:hover`/`:focus`/`:active`/`:focus-visible`/`:disabled`) — responsive
  > (`@media`) rules and base inline styles are unaffected. A consequence is that
  > a pseudo style can no longer be overridden by a higher-priority *inline*
  > style; this is the intended trade-off for a utility-prop library.

### Docs

- README + SETUP-GUIDE: clarified that `<Chamber>`/`<Tunnel>` are written
  identically with or without SSR, and documented `generateTheme`.
