## MODIFIED Requirements

### Requirement: WebGL-only render contract
The system SHALL initialize the game with WebGL as its required renderer and
SHALL NOT offer a Canvas fallback. The HTML status UI SHALL identify the active
render mode as `WebGL` and SHALL report the current native 100 percent logical
canvas dimensions.

#### Scenario: Game is initialized in a supported browser
- **WHEN** the game canvas is created
- **THEN** the game SHALL use the WebGL renderer at native scale
- **AND** the renderer status SHALL NOT describe the renderer as WebGPU

### Requirement: GPU-batched scene layers
The system SHALL render each static FoozleLab map stratum through a WebGL GPU
tile-map batch. It SHALL expand each animated `Midground2` tile into its own
GPU tile-map render layer while preserving the authored Tiled tile animation.
Every GPU tile-map render layer SHALL use one source tilesheet.

#### Scenario: The platformer level is displayed
- **WHEN** the game scene is ready
- **THEN** Background, Midground1, Midground2, and Foreground SHALL render in
  their authored order relative to the player
- **AND** every animated set-piece instance SHALL render through a separate
  GPU tile-map layer

