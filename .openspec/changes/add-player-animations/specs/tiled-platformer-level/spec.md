## MODIFIED Requirements

### Requirement: Platformer collision and spawn
The player SHALL use a non-art physics rectangle that is 32 source pixels wide
and 32 source pixels tall. It SHALL be created at the Tiled `Objects` layer's
`PlayerSpawn` point and be affected by downward physics. `Midground1` tiles
SHALL be solid to the player, while `Background`, `Midground2`, and
`Foreground` tiles SHALL NOT block movement. A jump started while the player
is grounded SHALL reach twice the previous maximum vertical rise while using
the same gravity.

#### Scenario: The level starts
- **WHEN** the scene begins
- **THEN** the player's physics rectangle SHALL measure 32 by 32 source pixels
- **AND** the player SHALL be rendered at the authored `PlayerSpawn` point
- **AND** the player SHALL fall onto the centered `Midground1` platform rather
  than pass through it

#### Scenario: The player jumps from a platform
- **WHEN** the player starts a jump while grounded
- **THEN** the player SHALL rise to twice the maximum vertical distance of the
  prior jump configuration before descending
- **AND** the `Midground1` platform SHALL remain solid when the player lands
