## MODIFIED Requirements

### Requirement: Tiled-authored level palette
The system SHALL provide a Tiled project containing one playable FoozleLab
level and 32 by 32 source-pixel FoozleLab tilesets for static structure,
static decor, and animated set pieces. The level SHALL be editable in Tiled
without deleting any supplied artwork.

#### Scenario: The level is opened in Tiled
- **WHEN** a developer opens the provided level project
- **THEN** the level SHALL expose its FoozleLab tilesets in the palette
- **AND** every tile used for gameplay geometry SHALL use a 32 by 32
  source-pixel grid

### Requirement: Two-layer platform layout
The playable Level 1 map SHALL be 81 tiles wide by 51 tiles high and SHALL
contain tile layers named `Background`, `Midground1`, `Midground2`, and
`Foreground`, plus an object layer named `Objects`. `Background`,
`Midground1`, and `Midground2` SHALL render behind the player; `Foreground`
SHALL render in front of the player and SHALL initially be empty.
`Midground1` SHALL be the sole solid tile layer. `Objects` SHALL contain
exactly one point object named `PlayerSpawn` above a `Midground1` platform.

#### Scenario: The level is displayed
- **WHEN** the map is loaded
- **THEN** it SHALL contain one solid `Midground1` platform centered in the
  81 by 51 map with `PlayerSpawn` directly above it
- **AND** repeated solid `Midground1` tiles SHALL appear only along the left
  edge, the top-right edge, and the bottom edge outside that center platform
- **AND** `Foreground` SHALL contain no tiles

### Requirement: Native source-pixel world presentation
The game world, Tiled grid, and physics SHALL use 32 by 32 source-pixel tiles.
The playable Level 1 world SHALL occupy 2,592 by 1,632 source pixels and SHALL
use native 100 percent presentation without authored tiles or physics
measurements being enlarged.

#### Scenario: Level 1 is presented at native scale
- **WHEN** the game canvas is displayed
- **THEN** each 32 by 32 source-pixel tile SHALL render at one-to-one scale
- **AND** the map world bounds SHALL remain 2,592 by 1,632 source pixels

### Requirement: Platformer collision and spawn
The player SHALL use a non-art physics rectangle that is 14 source pixels wide
and 28 source pixels tall. It SHALL be created at the Tiled `Objects` layer's
`PlayerSpawn` point and be affected by downward physics. `Midground1` tiles
SHALL be solid to the player, while `Background`, `Midground2`, and
`Foreground` tiles SHALL NOT block movement. A jump started while the player
is grounded SHALL reach twice the previous maximum vertical rise while using
the same gravity.

#### Scenario: The level starts
- **WHEN** the scene begins
- **THEN** the player's physics rectangle SHALL measure 14 by 28 source pixels
- **AND** the player SHALL be rendered at the authored `PlayerSpawn` point
- **AND** the player SHALL fall onto the centered `Midground1` platform rather
  than pass through it

#### Scenario: The player jumps from a platform
- **WHEN** the player starts a jump while grounded
- **THEN** the player SHALL rise to twice the maximum vertical distance of the
  prior jump configuration before descending
- **AND** the `Midground1` platform SHALL remain solid when the player lands
