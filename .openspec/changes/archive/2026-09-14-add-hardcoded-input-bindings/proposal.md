## Why

The controller currently exposes an incomplete, inconsistent keyboard scheme: it
advertises A/D, C, and V, while the desired fixed scheme must support the full
WASD and arrow-key movement family and bind the two actions to C and B. Players
also need a convenient Space jump shortcut without changing the on-screen
control guidance.

## What Changes

- Replace the fixed keyboard movement bindings with W, A, S, D and the arrow
  keys while retaining the existing virtual Move control.
- Change Action 2's keyboard binding and displayed label from V to B.
- Keep Action 1 bound to C and make Space an additional jump binding; Space
  remains deliberately absent from all visible controller text.
- Update the visible controller guidance to show the hard-coded movement and
  action bindings, with no remapping or user configuration UI.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `virtual-controller`: Define the fixed keyboard bindings, their visible
  controller guidance, and the hidden Space jump redundancy alongside the
  existing touch controls.

## Impact

- Affects the React virtual-controller keyboard listener and labels in
  `phaser4-platformer/src/ui.jsx`.
- Affects focused input/controller checks and README control documentation.
- Retains the existing Phaser input bridge, controller artwork, layout, and
  dependencies.
