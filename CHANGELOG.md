# Changelog

All notable changes to BadgerBurrow are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The packages are not yet published (`private: true`); entries accumulate under
**Unreleased** until the first release.

## [Unreleased]

### Added

- **`generateTheme()`** (`@badger-burrow/tokens`) — one brand hex → a complete,
  AA-checked theme `{ primitive, semantic }` ready for `extendBurrow`. Builds the
  primary scale, a harmony-derived secondary, and `neutral` + `ink` greys, and
  picks each interactive button's shade + label colour so it stays WCAG-AA
  readable for **any** hue (light brands get a dark label automatically). Pure
  utility — no React/DOM — so it behaves identically with and without SSR.
  Options: `harmony`, `secondary`, `neutral`, `ink`.
- **Server-side rendering** (`@badger-burrow/web`) — `createStyleRegistry()` +
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
