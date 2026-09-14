<!-- AI: Keep commands rooted at the repository. The Vite application, source, tests, and build output belong in phaser4-platformer/. -->
![Samuel Asher Rivello](phaser4-platformer/documentation/samuel-asher-rivello-banner.png)

# Phaser 4 Platformer

This small Phaser 4 browser demo keeps its surrounding interface in HTML while the game layer renders a movable square and its clickable controls.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Controls](#controls)
3. [Project Details](#project-details)
4. [Credits](#credits)

## Getting Started

<!-- AI: Update these baseline Node/npm/Vite commands if the selected stack changes. -->
The project requires Node.js 24 and npm.

### 🛠 Build Project

1. From the repository root, run `npm install`.
2. Run `npm run build`.

### 🛠 Run Project

1. From the repository root, run `npm run dev` and open the localhost URL Vite prints.
2. Run `npm test` to execute the focused source checks.

### 🛠 Release Version

1. Run `npm test` and `npm run build` from the repository root.
2. Push to `main` to deploy through the GitHub Pages workflow.
3. Run the **Release** workflow from GitHub Actions to bump the patch version, tag it, and create the GitHub release.

## Controls

- W/A/S/D and the arrow keys are the fixed movement bindings. A/D and the
  Left/Right arrow keys move the blue square left and right; W/S and Up/Down
  currently have no gameplay action.
- Use the blue move joystick along the lower-left edge for horizontal touch movement. Up and down have no gameplay action yet.
- Trigger Action 1 with C or its gray Action 1 (C) button to jump while standing on a platform, then jump once more in the air.
- Trigger Action 2 with V or its red Action 2 (V) button for a light attack. Press again in under half a second to alternate heavy and light attacks.

## Rendering and Tiled Level

- The demo requires **WebGL**. Phaser's SpriteGPULayer and TilemapGPULayer are
  WebGL GPU-batching features; this project does not claim WebGPU rendering or
  provide a Canvas fallback.
- The world uses 32 by 32 source-pixel tiles at native 100 percent presentation.
  Level 1 is 81 columns by 51 rows (2,592 by 1,632 source pixels).
- Open [Level01.tmj](phaser4-platformer/assets/tiled/Level01.tmj) from
  [PhaserPlatformer.tiled-project](phaser4-platformer/assets/tiled/PhaserPlatformer.tiled-project).
  Its editor layers are Background, Midground1, Midground2, Foreground, and
  Objects. Background, Midground1, and Midground2 render behind the player;
  Foreground renders in front. Only Midground1 blocks player movement.
- `PlayerSpawn` is the sole point in Objects and controls the player's game
  position. The map is backed by FoozleLab external tilesets in
  `phaser4-platformer/assets/tiled/tilesets/`.
- After saving an edit in Tiled, run `npm run sync:level` from the repository
  root, then reload the browser. The command updates both the editor-data copy
  and the WebGL-safe static runtime map so every authored layer is included.

## Project Details

- `phaser4-platformer/src/main.js` contains the WebGL Phaser scene, Tiled map loading, GPU layers, physics, and game-layer controls.
- `phaser4-platformer/index.html` provides the separate HTML UI layer and starts the Phaser module.
- [Phaser 4](https://phaser.io/download/phaser4) supplies the browser game engine.
- [Vite](https://vite.dev/) provides local development and production builds.


## Credits

<!-- AI: Preserve established attribution and ownership. Customize the following subsections only from confirmed contributor, contact, and license information; do not infer a new owner from the repository name. -->
### 💡 Contributors

<!-- AI: Preserve existing contributor credit and add contributors only when confirmed. Do not automatically advance experience counts or their reference year. -->
- Samuel Asher Rivello - Over 25 years of game development XP (2026)

### 💡 Contact

<!-- AI: Preserve confirmed contact destinations and their order unless requested otherwise. Use readable display URLs without a protocol or trailing slash while keeping the real link target intact. Do not invent accounts or change target capitalization based on display styling. -->
- [LinkedIn.com/in/SamuelAsherRivello](https://Linkedin.com/in/SamuelAsherRivello) ⭐ 
- [GitHub.com/SamuelAsherRivello](https://github.com/SamuelAsherRivello/)
- [Twitter.com/srivello](https://twitter.com/srivello/)
- Resume / Portfolio: [SamuelAsherRivello.com](http://www.SamuelAsherRivello.com)


### 💡 License

<!-- AI: Keep the license name linked to the actual relative license file and verify that its terms match this statement. Keep the copyright holder and year consistent with that file. Do not change license terms, ownership, or dates without an explicit request. -->
- Provided as-is under the [MIT License](LICENSE).

- Copyright © 2026 Rivello Multimedia Consulting, LLC.
