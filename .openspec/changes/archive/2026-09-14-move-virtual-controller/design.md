## Context

The page already separates Phaser content (`#content_layer`) from a grid-based
HTML UI overlay (`#ui_layer`). The static overlay currently owns the header,
empty body, and footer/version, while `PlatformerScene` loads controller images,
creates interactive scene objects, tracks pointer input, and reserves the
lower physics exclusion zone. See `proposal.md` for the motivation and the
`virtual-controller` delta spec for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Make one React application the sole renderer for the UI layer's header, body,
  and footer.
- Render the controller as React content at the bottom of the body region,
  retaining its established artwork, labels, visual scale, and safe-edge
  placement.
- Keep Phaser authoritative for physics, player movement, jumping, and attack
  effects while receiving controller intent through a small explicit boundary.
- Keep the lower canvas exclusion zone aligned with the UI controller area.

**Non-Goals:**

- Redesigning the header, controller artwork, controls, key bindings, player
  actions, or overall visual layout.
- Adding vertical movement, a canvas fallback, persistence, network behavior,
  or a general UI component library.

## Decisions

### Use one React root mounted in `#ui_layer`

React and React DOM will be added as the minimal UI runtime. The root will
render the existing header content, body/controller region, and footer/version
content rather than maintaining separate static DOM islands. This directly
meets the requirement that the full UI layer be React-rendered and keeps a
single owner for UI state.

Alternative considered: retain the static header/footer and mount React only
in `#body`. Rejected because the requested scope explicitly makes the entire
UI layer React-rendered.

### Keep Phaser and React separated by a controller-intent bridge

The React controller will report normalized horizontal movement and discrete
action press/release intent through a narrow browser-local interface exposed by
the game module. Phaser will continue to combine keyboard and controller input,
execute jump/attack logic, and own the player state. Phaser will notify the UI
of keyboard-driven visual feedback so its controls remain synchronized.

Alternative considered: have React synthesize keyboard events or directly
mutate Phaser scene objects. Rejected because both couple UI implementation to
engine internals and make input ownership fragile.

### Preserve responsive geometry in CSS and derive matching Phaser bounds

The UI controller will use the existing overlay's 5 percent inset and a
bottom-anchored body layout. CSS will preserve the current logical-size
relationship for the Move and action controls; the Phaser scene will retain a
non-rendered lower exclusion rectangle derived from the same presentation
measurements. Resize handling updates both sides without rendering control
sprites in Phaser.

Alternative considered: let React controls overlap an unrestricted game canvas.
Rejected because it permits the player to move behind controls and loses the
current protected gameplay space.

### Move controller artwork ownership to the UI bundle

The controller image URLs will be imported by the React UI instead of preloaded
as Phaser textures. Phaser will stop creating, laying out, or hit-testing
controller sprites and labels. The tilemap, terrain, clouds, player square,
and game rendering stay in Phaser.

Alternative considered: reuse Phaser texture loading for React assets.
Rejected because it keeps UI asset rendering coupled to Phaser's loader and
does not complete the rendering migration.

## Risks / Trade-offs

- [UI and canvas geometry diverge on resize] → Centralize shared safe-area and
  controller-zone constants, and verify resize behavior at desktop and narrow
  touch-sized viewports.
- [Pointer release occurs outside a control] → Use pointer capture and global
  release/cancel handling so movement and pressed visuals reset reliably.
- [Keyboard focus or repeat leaves a UI control visually pressed] → Keep
  keyboard listeners at the document/window boundary and represent current key
  state rather than treating repeated keydown events as independent presses.
- [React dependency increases bundle size] → Add only `react` and `react-dom`;
  do not introduce an additional UI library.

## Migration Plan

1. Add the React runtime and UI root while retaining the existing `#ui_layer`
   overlay container and Phaser `#content_layer` parent.
2. Move the existing UI content and controller visuals/event handling to the
   React component, then connect its intents to Phaser.
3. Remove Phaser controller texture loading, scene objects, and pointer
   handlers after the React path supplies equivalent input and feedback.
4. Run focused source tests, production build, and browser checks at normal and
   narrow viewport sizes. Roll back by restoring the prior controller-in-Phaser
   implementation if controls fail to reach the game or geometry mismatches.
