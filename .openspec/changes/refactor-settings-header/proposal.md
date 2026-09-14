## Why

The four existing upper-right controls read as unrelated debug actions even
though they already form one settings group. A visible group name and explicit
shared typography will make that relationship clear without changing any
setting's behavior or familiar compact presentation.

## What Changes

- Treat the existing upper-right Camera, Tilemap, Screen, and Fullscreen
  controls as the Settings feature while preserving their labels, checked
  states, order, interactions, persistence, and fullscreen synchronization.
- Add a non-interactive, right-aligned `Settings` subtitle above the existing
  controls and below the existing GitHub link.
- Refactor the HUD typography into named UI Label and UI Subtitle styles. The
  control labels will use UI Label; the Settings subtitle will use UI Subtitle
  with a slightly larger responsive font while retaining the established
  light-blue header text treatment.
- Consolidate the repeated borderless control and interaction styling so every
  existing setting keeps the same text-only presentation and accessible focus
  feedback.
- Extend focused automated and browser verification to confirm the heading,
  style relationship, right alignment, and unchanged setting behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `ui-settings`: Define the visible Settings group subtitle and named shared
  typography while preserving the existing upper-right setting controls.

## Impact

- Affects the React header markup in `phaser4-platformer/src/ui.jsx`, the
  reusable CSS in `phaser4-platformer/src/ui.css`, and its focused UI tests in
  `phaser4-platformer/test/page.test.mjs`.
- Does not affect Phaser game behavior, bridge state, local-storage keys,
  fullscreen APIs, dependencies, or external services.
