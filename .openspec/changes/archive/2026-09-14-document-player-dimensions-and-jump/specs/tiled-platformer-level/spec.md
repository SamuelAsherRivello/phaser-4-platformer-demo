## MODIFIED Requirements

### Requirement: Platformer collision and spawn
The player SHALL use a non-art physics rectangle that is 14 source pixels wide
and 28 source pixels tall. It SHALL be created at the Tiled `Objects` layer's
`PlayerSpawn` point and be affected by downward physics. Foreground platform
tiles SHALL be solid to the player, while background tiles SHALL NOT block
movement. A jump started while the player is grounded SHALL reach twice the
previous maximum vertical rise while using the same gravity.

#### Scenario: The level starts
- **WHEN** the scene begins
- **THEN** the player's physics rectangle SHALL measure 14 by 28 source pixels
- **AND** the player SHALL start at source-pixel coordinates 208 by 304 from
  the authored `PlayerSpawn` point
- **AND** the player SHALL fall from that spawn position
- **AND** the player SHALL land on the foreground platform below rather than
  pass through it

#### Scenario: The player jumps from a platform
- **WHEN** the player starts a jump while grounded
- **THEN** the player SHALL rise to twice the maximum vertical distance of the
  prior jump configuration before descending
- **AND** the foreground platform SHALL remain solid when the player lands
