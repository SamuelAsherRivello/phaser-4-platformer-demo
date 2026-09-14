## Context

The React HUD renders the right side of `#header` as one vertical
`.header-actions` stack: a GitHub link followed by separate Camera, Tilemap,
Screen, and Fullscreen buttons. The buttons currently repeat dedicated control
classes and share `.settings-text-style`, which is also coupled to status text
styling. Focus feedback is split across several selector groups. The existing
`ui-settings` capability is the behavior contract for this area; see its delta
spec and `proposal.md` for user-facing requirements.

## Goals / Non-Goals

**Goals:**

- Make the current stack legible as one named settings feature without moving
  it or changing its density, interaction semantics, or stored state.
- Establish reusable UI Label and UI Subtitle typography for this header area.
- Make all four existing controls share one borderless interaction treatment.

**Non-Goals:**

- Adding settings, changing Camera/Tilemap/Screen debug rendering, or changing
  fullscreen behavior.
- Introducing a panel, menu, icon, dependency, persistent preference, or
  additional UI framework.
- Changing the GitHub link, left-side game status text, virtual controls, or
  Phaser scene/bridge contracts.

## Decisions

### Represent the visible settings feature as a header sub-group

Keep the GitHub link first in `.header-actions`, then render a settings
sub-group containing a non-interactive `Settings` text element followed by the
four existing buttons in their current order. The sub-group remains a
right-aligned vertical layout, so the heading and controls share a clear edge
without affecting the adjacent project-status column.

Alternative considered: make `Settings` another top-level child in the action
stack. Rejected because a wrapper makes the feature boundary explicit and
keeps future header actions separate from settings.

### Extract semantic typography and interaction classes

Replace the settings-only typography class with a reusable UI Label class for
the controls and a UI Subtitle class for the heading. UI Subtitle will retain
the same visual family but use a slightly larger responsive font than UI Label.
Factor the four existing buttons into shared text-only base and hover/focus
selectors, retaining pointer access, no persistent chrome, and the current
accessible native-button/`aria-pressed` contract.

Alternative considered: increase the inherited header font on one heading
element. Rejected because it would not provide the user-requested named styles
or a stable relationship to the control label typography.

### Test the grouping contract and preserve behavioral coverage

Update focused source-level tests to assert the Settings heading, named style
assignments, hierarchy/order, right-aligned layout, larger subtitle font, and
consolidated control treatment. Retain the existing tests for Camera, Tilemap,
Screen, and Fullscreen state behavior. A real browser check will confirm the
subtitle is visible above the controls at the active viewport and that all
controls still operate.

Alternative considered: rely only on the existing behavior tests. Rejected
because they do not prove that the new group heading is visible or that the
typographic hierarchy survived CSS refactoring.

## Risks / Trade-offs

- [The fixed header row is compact on small displays] → Use responsive font
  sizing and preserve the existing vertical layout; verify the active browser
  viewport and a narrow viewport during implementation.
- [Existing source-level tests match selector ordering] → Update their
  assertions deliberately as part of the refactor while retaining explicit
  behavior checks for every setting.
- [Changing shared CSS could unintentionally restyle left-side status text] →
  Keep status selectors independent of the new named Settings typography
  styles and verify the unchanged status presentation in the browser.

## Migration Plan

1. Introduce the settings sub-group and named styles while preserving each
   button's state bindings and labels.
2. Consolidate shared control CSS and update focused tests to the new semantic
   structure.
3. Run the focused test suite, build, and browser checks for visual hierarchy
   and all four controls.
4. Roll back by removing the sub-group/style extraction; no saved data or
   engine state requires migration.
