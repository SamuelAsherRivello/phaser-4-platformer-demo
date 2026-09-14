## Context

The application already separates its React HTML overlay from the Phaser
canvas. The upper-right header contains the GitHub link and visual debug
controls, while the Phaser scene owns tilemap and camera debug graphics.

## Goals / Non-Goals

**Goals:**

- Keep related visual-debug settings together in the upper-right header.
- Reuse one small shared UI-state bridge for settings, persistence, and scene
  updates.
- Keep settings visually lightweight and consistent with the live FPS status.

**Non-Goals:**

- Add a component library, a settings page, or remote preference storage.
- Change gameplay controls, level data, or normal rendering when debug is off.

## Decisions

- Use React buttons with `aria-pressed` for each setting. Native buttons
  preserve keyboard activation and accessible state without a UI dependency.
- Store only the two boolean preferences in browser local storage and publish
  snapshots through the existing UI bridge. This keeps settings local and lets
  Phaser react without reaching into React components.
- Render tile and camera debug graphics in Phaser-owned graphics layers. This
  keeps canvas-aligned debug visuals in the engine rather than the HTML layer.
- Share the FPS text style through `settings-text-style`; use text treatment
  for interaction feedback so the header remains unobtrusive.

## Risks / Trade-offs

- [Stored settings can be unavailable or malformed] → Treat missing or invalid
  storage as both settings disabled and continue without an error.
- [Debug lines can obscure gameplay] → Keep both settings opt-in and clear
  graphics immediately when a setting is disabled.
