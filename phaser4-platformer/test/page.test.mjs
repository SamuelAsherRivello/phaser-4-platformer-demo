import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { moveHorizontalVelocityTowardsInput } from "../src/player-motion.js";

const appRoot = new URL("../", import.meta.url);

test("documents the Phaser 4 platformer and loads its game module", async () => {
  const page = await readFile(new URL("index.html", appRoot), "utf8");

  if (!page.includes("<title>Phaser 4 Platformer</title>")) {
    throw new Error("The browser title must identify the Phaser platformer.");
  }
  if (!page.includes('id="content_layer"')) {
    throw new Error("The page needs a dedicated game-engine layer.");
  }
  if (!page.includes('id="ui_layer"')) {
    throw new Error("The page needs a separate HTML UI layer.");
  }
  if (!page.includes('id="ui_root"')) {
    throw new Error("The page needs a React mount for the complete UI layer.");
  }
  if (!page.includes('src="/src/main.js"')) {
    throw new Error("The page must load the Phaser game module.");
  }
});

test("keeps Tiled authoring files and the runtime export aligned", async () => {
  const authoringMap = JSON.parse(
    await readFile(new URL("assets/tiled/foozle-lab-level.tmj", appRoot), "utf8"),
  );
  const runtimeMap = JSON.parse(
    await readFile(new URL("assets/maps/foozle-lab-level.json", appRoot), "utf8"),
  );

  assert.equal(runtimeMap.compressionlevel, undefined, "Phaser must not mistake Tiled's root compression level for layer compression.");

  assert.deepEqual(
    authoringMap.tilesets.map((tileset) => tileset.source),
    [
      "tilesets/foozle-lab-structure.tsj",
      "tilesets/foozle-lab-decor.tsj",
      "tilesets/foozle-lab-control-panel.tsj",
      "tilesets/foozle-lab-laser-spikes.tsj",
      "tilesets/foozle-lab-saw.tsj",
      "tilesets/foozle-lab-wall-blades.tsj",
    ],
  );
  assert.deepEqual(
    runtimeMap.tilesets.map((tileset) => tileset.name),
    ["FoozleLab Structure", "FoozleLab Decor", "FoozleLab Control Panel", "FoozleLab Laser Spikes", "FoozleLab Saw", "FoozleLab Wall Blades"],
  );

  for (const tilesetPath of authoringMap.tilesets.map((tileset) => tileset.source)) {
    const tileset = JSON.parse(
      await readFile(new URL(`assets/tiled/${tilesetPath}`, appRoot), "utf8"),
    );

    assert.equal(tileset.tilewidth, 32);
    assert.equal(tileset.tileheight, 32);
    assert.ok(tileset.columns > 0);
    assert.ok(tileset.tilecount > 0);
    assert.ok(tileset.imagewidth > 0);
    assert.ok(tileset.imageheight > 0);
  }

  for (const map of [authoringMap, runtimeMap]) {
    assert.equal(map.width, 81);
    assert.equal(map.height, 51);
    assert.equal(map.tilewidth, 32);
    assert.equal(map.tileheight, 32);

    const tileLayers = map.layers.filter((layer) => layer.type === "tilelayer");
    assert.deepEqual(tileLayers.map((layer) => layer.name), ["Background", "Midground1", "Midground2", "Foreground"]);
    const layerData = tileLayers.map((layer) => layer.data);
    assert.ok(tileLayers.every((layer, index) => layer.width === 81 && layer.height === 51 && layerData[index].length === 4131));
    assert.ok(layerData.slice(0, 1).every((data) => data.every((tile) => tile === 0)));
    assert.deepEqual(
      [91, 111, 121, 127],
      [...new Set(layerData[2].filter((tile) => tile !== 0))].sort((left, right) => left - right),
      "Midground2 must contain the four visual-only animated FoozleLab set-piece types.",
    );
    assert.ok(layerData[3].some((tile) => tile >= 82 && tile <= 90), "Foreground must contain pass-through FoozleLab decor.");

    const midground1 = tileLayers[1];
    const midground1Data = layerData[1];
    const tileAt = (column, row) => midground1Data[row * map.width + column];
    for (let row = 0; row < map.height; row += 1) {
      assert.notEqual(tileAt(0, row), 0, "Midground1 must block the complete left edge.");
      assert.notEqual(tileAt(map.width - 1, row), 0, "Midground1 must block the complete right edge.");
    }
    for (let column = 0; column < map.width; column += 1) {
      assert.notEqual(tileAt(column, 0), 0, "Midground1 must block the complete top edge.");
      assert.notEqual(tileAt(column, map.height - 1), 0, "Midground1 must block the complete bottom edge.");
    }
    assert.deepEqual(
      Array.from({ length: 7 }, (_, offset) => tileAt(37 + offset, 26)),
      Array(7).fill(1),
      "The initial test platform must be centered in Midground1.",
    );
    assert.ok(
      midground1Data.filter((tile) => tile !== 0).length > 7 + (map.height * 2) + ((map.width - 2) * 2),
      "Level 1 must retain the boundary runs and add its authored platform route.",
    );

    const objectLayers = map.layers.filter((layer) => layer.type === "objectgroup");
    assert.equal(objectLayers.length, 1);
    assert.equal(objectLayers[0].name, "Objects");
    assert.deepEqual(objectLayers[0].objects, [
      {
        id: 1,
        name: "PlayerSpawn",
        point: true,
        rotation: 0,
        type: "",
        visible: true,
        x: 1296,
        y: 786,
      },
    ]);
  }

  assert.deepEqual(authoringMap.layers, runtimeMap.layers);
});

test("sizes the Phaser game view to the active browser viewport", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  for (const requiredSnippet of [
    "function getGameViewportSize()",
    "width: initialGameViewport.width",
    "height: initialGameViewport.height",
    "game.scale.resize(width, height)",
    'window.addEventListener("resize", resizeGameToViewport)',
  ]) {
    assert.ok(game.includes(requiredSnippet), `The game is missing viewport sizing behavior: ${requiredSnippet}`);
  }
});

test("uses GPU layers, physics, and the requested platformer actions", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  for (const requiredSnippet of [
    "this.load.tilemapTiledJSON",
    "map.createLayer(\"Background\", foozleLabStructure, 0, 0, true)",
    "map.createLayer(\"Midground1\", foozleLabStructure, 0, 0, true)",
    "createFoozleLabSetPieces()",
    "this.load.spritesheet(\"foozle-lab-control-panel\"",
    "this.add.sprite(x, y, definition.key).play(definition.animation).setDepth(layerInfo.depth)",
    "this.physics.add.existing(this.player)",
    "this.physics.add.collider(this.player, this.midground1Layer)",
    "this.map.getObjectLayer(\"Objects\")",
    "object.name === \"PlayerSpawn\" && object.point",
    "spawnPoints.length !== 1",
    "this.player = this.add.rectangle(playerSpawn.x, playerSpawn.y, PLAYER_WIDTH, PLAYER_HEIGHT, 0x38bdf8)",
    "this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)",
    "jumpPlayer()",
    "attackPlayer()",
    "this.player.body.blocked.down",
  ]) {
    if (!game.includes(requiredSnippet)) {
      throw new Error(`The game is missing requested platformer behavior: ${requiredSnippet}`);
    }
  }

  assert.doesNotMatch(game, /LEVEL_(WIDTH|HEIGHT)/);
});

test("preloads and plays a distinct sound for each platformer action", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  for (const requiredSnippet of [
    'import attackSoundUrl from "../assets/audio/sfx/Attack01.mp3?url";',
    'import arrowSoundUrl from "../assets/audio/sfx/Arrow01.mp3?url";',
    'const ACTION_ONE_SOUND_KEY = "action-one-sound";',
    'const ACTION_TWO_SOUND_KEY = "action-two-sound";',
    "this.load.audio(ACTION_ONE_SOUND_KEY, attackSoundUrl)",
    "this.load.audio(ACTION_TWO_SOUND_KEY, arrowSoundUrl)",
  ]) {
    assert.ok(game.includes(requiredSnippet), `The action-audio path is missing ${requiredSnippet}.`);
  }

  assert.match(game, /jumpPlayer\(\) \{\s*this\.sound\.play\(ACTION_ONE_SOUND_KEY\);/);
  assert.match(game, /attackPlayer\(\) \{\s*this\.sound\.play\(ACTION_TWO_SOUND_KEY\);/);
  assert.notEqual("action-one-sound", "action-two-sound");
});

test("uses a one-tile-wide, two-tile-tall player and a two-times-higher jump", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  assert.match(game, /const PLAYER_WIDTH = TILE_SIZE;/);
  assert.match(game, /const PLAYER_HEIGHT = 2 \* TILE_SIZE;/);
  assert.match(
    game,
    /this\.add\.rectangle\(playerSpawn\.x, playerSpawn\.y, PLAYER_WIDTH, PLAYER_HEIGHT, 0x38bdf8\)/,
  );
  assert.match(game, /const JUMP_HEIGHT_MULTIPLIER = 2;/);
  assert.match(game, /const JUMP_SPEED = BASE_JUMP_SPEED \* Math\.sqrt\(JUMP_HEIGHT_MULTIPLIER\);/);
});

test("ramps horizontal player movement to the doubled speed instead of snapping", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  assert.match(game, /const PLAYER_SPEED = 240;/);
  assert.match(game, /const PLAYER_MOVEMENT_RAMP_DURATION = 125;/);
  assert.match(game, /const PLAYER_HORIZONTAL_ACCELERATION = PLAYER_SPEED \/ \(PLAYER_MOVEMENT_RAMP_DURATION \/ 1000\);/);
  assert.match(game, /update\(time, delta\) \{\s*this\.updatePlayerHorizontalVelocity\(delta\);/);
  assert.match(
    game,
    /updatePlayerHorizontalVelocity\(delta\) \{[\s\S]*?const maximumVelocityChange = PLAYER_HORIZONTAL_ACCELERATION \* \(delta \/ 1000\);[\s\S]*?moveHorizontalVelocityTowardsInput\(\s*currentVelocity,\s*getHorizontalInput\(\),\s*PLAYER_SPEED,\s*maximumVelocityChange,\s*\)[\s\S]*?this\.player\.body\.setVelocityX\(nextVelocity\);[\s\S]*?\}/,
  );
  assert.doesNotMatch(game, /this\.player\.body\.setVelocityX\(getHorizontalInput\(\) \* PLAYER_SPEED\);/);

  const fullSpeedChange = 240 / (125 / 1000) * (125 / 1000);
  assert.equal(moveHorizontalVelocityTowardsInput(0, 1, 240, fullSpeedChange), 240);
  assert.equal(moveHorizontalVelocityTowardsInput(240, 0, 240, fullSpeedChange), 0);
  assert.equal(moveHorizontalVelocityTowardsInput(0, 0.5, 240, fullSpeedChange), 120);
  assert.equal(moveHorizontalVelocityTowardsInput(240, -1, 240, fullSpeedChange), 0);
});

test("emits visual-only gray surface dust while moving and a larger puff on landing", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  for (const requiredSnippet of [
    'const PLAYER_SURFACE_DUST_TEXTURE = "player-surface-dust";',
    "dustTexture.fillStyle(0xa3a3a3, 1)",
    "dustTexture.generateTexture(PLAYER_SURFACE_DUST_TEXTURE, 4, 4)",
    "this.movementDustEmitter = this.add.particles",
    "this.landingDustEmitter = this.add.particles",
    "emitting: false",
    "maxParticles: 24",
    "maxParticles: 32",
    "scale: { start: 2, end: 0.7 }",
    "scale: { start: 4.5, end: 1.1 }",
    "getPlayerSurfaceContact()",
    "this.midground1Layer.getTileAtWorldXY(body.center.x, body.bottom + 1)",
    "if (!surfaceTile?.collides)",
    "const MOVEMENT_DUST_INTERVAL = 70;",
    "time < this.nextMovementDustAt",
    "this.movementDustEmitter.emitParticleAt",
    "this.landingDustEmitter.emitParticleAt(surfaceContact.x, surfaceContact.y)",
    "this.hasPlayerBeenAirborne && !this.wasPlayerOnForegroundSurface",
  ]) {
    assert.ok(game.includes(requiredSnippet), `The surface-particle behavior is missing ${requiredSnippet}.`);
  }

  assert.match(game, /this\.movementDustEmitter = this\.add\.particles[\s\S]*?\.setDepth\(3\.5\)/);
  assert.match(game, /this\.landingDustEmitter = this\.add\.particles[\s\S]*?\.setDepth\(3\.5\)/);
  assert.match(game, /if \(horizontalVelocity === 0 \|\| time < this\.nextMovementDustAt\) \{[\s\S]*?return;/);
  assert.match(game, /if \(!surfaceContact\) \{[\s\S]*?this\.hasPlayerBeenAirborne = true;[\s\S]*?return;/);
  assert.match(game, /this\.physics\.add\.collider\(this\.player, this\.midground1Layer\);/);
});

test("renders the full UI and virtual controller in React while Phaser receives intent", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const bridge = await readFile(new URL("src/platformer-ui-bridge.js", appRoot), "utf8");

  for (const requiredSnippet of [
    "createRoot",
    "<header id=\"header\"",
    "<main id=\"body\"",
    "<footer id=\"footer\"",
    "Move (WASD / Arrows)",
    "Action 1 (C)",
    "Action 2 (V)",
    "SimpleMobileJoystick/Move Joystick Background.png",
    "SimpleMobileJoystick/Move Joystick Handle.png",
    "SimpleMobileJoystick/Aim Joystick Background.png",
    "SimpleMobileJoystick/Aim Joystick Handle.png",
    "SimpleMobileJoystick/Joystick Background.png",
    "SimpleMobileJoystick/Joystick Handle.png",
  ]) {
    if (!ui.includes(requiredSnippet)) {
      throw new Error(`The React UI is missing its required control: ${requiredSnippet}`);
    }
  }

  for (const requiredSnippet of [
    "bindPlatformerActions",
    "getHorizontalInput",
    "setRendererStatus",
    "setFrameRate",
    "this.physics.world.setBounds",
  ]) {
    if (!game.includes(requiredSnippet)) {
      throw new Error(`The Phaser game is missing its UI bridge behavior: ${requiredSnippet}`);
    }
  }

  for (const requiredSnippet of ["setHorizontalInput", "setActionPressed", "subscribeUiState"]) {
    if (!bridge.includes(requiredSnippet)) {
      throw new Error(`The UI bridge is missing ${requiredSnippet}.`);
    }
  }

  for (const removedSnippet of ["createJoystick(", "createActionButton(", "this.load.image(\"move-joystick-background\""]) {
    if (game.includes(removedSnippet)) {
      throw new Error(`Phaser must not render virtual controls: ${removedSnippet}`);
    }
  }
});

test("keeps the virtual controller at its physical guide size and out of sequential Tab navigation", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");
  const css = await readFile(new URL("src/ui.css", appRoot), "utf8");
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");

  assert.match(css, /\.virtual-controller\s*\{[\s\S]*?height:\s*173px;[\s\S]*?transform:\s*translateY\(43px\);/);
  assert.match(css, /\.action-controls\s*\{[\s\S]*?gap:\s*0\.625rem;/);
  assert.match(css, /\.virtual-control\s*\{[\s\S]*?gap:\s*0\.25rem;[\s\S]*?font:\s*700 0\.8rem/);
  assert.match(css, /\.control-art\s*\{[\s\S]*?--control-size:\s*120px;/);
  assert.match(css, /\.action-art\s*\{[\s\S]*?--control-size:\s*120px;/);
  assert.doesNotMatch(css, /\.control-art\s*\{[\s\S]*?--control-size:\s*clamp\(/);
  assert.doesNotMatch(css, /\.action-art\s*\{[\s\S]*?--control-size:\s*clamp\(/);
  assert.match(game, /const VIRTUAL_CONTROLLER_ZONE_HEIGHT = 173;/);
  assert.match(game, /const controllerZoneHeight = VIRTUAL_CONTROLLER_ZONE_HEIGHT;/);
  assert.equal((ui.match(/tabIndex=\{-1\}/g) ?? []).length, 2, "The Move and reusable Action control components must opt out of sequential Tab navigation.");
  assert.equal((ui.match(/<ActionControl label=/g) ?? []).length, 2, "Both action-control instances must use the reusable focus-skipping Action control.");
  assert.match(ui, /className="control-art move-art"[\s\S]*?tabIndex=\{-1\}[\s\S]*?onPointerDown/);
  assert.match(ui, /className="control-art action-art"[\s\S]*?tabIndex=\{-1\}[\s\S]*?onPointerDown/);
});

test("uses the fixed visible controller bindings and keeps the Space jump binding hidden", async () => {
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const readme = await readFile(new URL("../README.md", appRoot), "utf8");

  for (const requiredSnippet of [
    '"ArrowUp"',
    '"ArrowDown"',
    '"w"',
    '"W"',
    '"s"',
    '"S"',
    '"v"',
    '"V"',
    '" "',
    'keys.has("c") || keys.has("C") || keys.has(" ")',
    'keys.has("v") || keys.has("V")',
    "Move (WASD / Arrows)",
    "Action 1 (C)",
    "Action 2 (V)",
  ]) {
    assert.ok(ui.includes(requiredSnippet), `The controller must include ${requiredSnippet}.`);
  }

  assert.doesNotMatch(ui, /Action 2 \(B\)/);
  assert.doesNotMatch(ui, /<span>[^<]*Space/);
  assert.match(readme, /W\/A\/S\/D and the arrow keys/);
  assert.match(readme, /Action 2 \(V\)/);
  assert.doesNotMatch(readme, /Space/);
});

test("toggles tilemap debug boxes from the top-right UI", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const bridge = await readFile(new URL("src/platformer-ui-bridge.js", appRoot), "utf8");
  const css = await readFile(new URL("src/ui.css", appRoot), "utf8");

  for (const requiredSnippet of [
    "tilemapDebugEnabled: false",
    "export function setTilemapDebugEnabled(enabled)",
  ]) {
    if (!bridge.includes(requiredSnippet)) {
      throw new Error(`The UI bridge is missing tilemap-debug behavior: ${requiredSnippet}`);
    }
  }

  for (const requiredSnippet of [
    'Tilemap {uiState.tilemapDebugEnabled ? "✅" : "⬜"}',
    'className="settings-control ui-label"',
    "aria-pressed={uiState.tilemapDebugEnabled}",
    "setTilemapDebugEnabled(!uiState.tilemapDebugEnabled)",
  ]) {
    if (!ui.includes(requiredSnippet)) {
      throw new Error(`The header is missing tilemap debug control behavior: ${requiredSnippet}`);
    }
  }

  assert.ok(
    ui.indexOf('aria-label="View the repository on GitHub"') < ui.indexOf("Tilemap {uiState.tilemapDebugEnabled"),
    "The tilemap toggle must appear after the GitHub icon in the header markup.",
  );
  assert.match(css, /\.header-actions\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*flex-end;/s);
  const settingsControlStyles = css.match(/\.settings-control\s*\{[^}]*\}/s)?.[0] ?? "";
  assert.match(settingsControlStyles, /\bappearance:\s*none;/);
  assert.match(settingsControlStyles, /\bborder:\s*0;/);
  assert.match(settingsControlStyles, /\bbackground:\s*transparent;/);
  assert.match(
    css,
    /#tilemap_status,\s*#renderer_status,\s*#fps_status\s*\{[^}]*color:\s*#93c5fd;[^}]*font:\s*600 clamp\(0\.65rem, 1\.5vw, 0\.75rem\) system-ui, sans-serif;/s,
  );
  assert.match(
    css,
    /\.settings-control:hover,\s*\.settings-control:focus-visible\s*\{[^}]*text-decoration:\s*underline;[^}]*outline:\s*none;/s,
  );

  for (const requiredSnippet of [
    "this.tilemapDebugGraphics = this.add.graphics()",
    "renderTilemapDebug(enabled)",
    "this.tilemapDebugGraphics.lineStyle(1, 0xfacc15, 0.2)",
    "this.tilemapDebugGraphics.strokeRect",
  ]) {
    if (!game.includes(requiredSnippet)) {
      throw new Error(`Phaser is missing tilemap box rendering: ${requiredSnippet}`);
    }
  }
});

test("shows the visible game grid columns and rows between the WebGL and FPS statuses", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const bridge = await readFile(new URL("src/platformer-ui-bridge.js", appRoot), "utf8");

  assert.match(bridge, /tilemapStatus:/);
  assert.match(bridge, /export function setTilemapStatus\(tilemapStatus\)/);
  assert.match(game, /setTilemapStatus/);
  assert.match(game, /const gridColumns = Math\.ceil\(game\.scale\.width \/ TILE_SIZE\);/);
  assert.match(game, /const gridRows = Math\.ceil\(game\.scale\.height \/ TILE_SIZE\);/);
  assert.match(game, /Tilemap \(\$\{TILE_SIZE\}x\$\{TILE_SIZE\} -> \$\{gridColumns\}x\$\{gridRows\}\)/);
  assert.match(ui, /id="tilemap_status"/);
  assert.ok(
    ui.indexOf('id="renderer_status"') < ui.indexOf('id="tilemap_status"')
      && ui.indexOf('id="tilemap_status"') < ui.indexOf('id="fps_status"'),
    "The tilemap status must appear between the WebGL and FPS statuses.",
  );
});

test("keeps the WebGL canvas at its native 100 percent size", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  assert.match(game, /const TARGET_SCALE = 1;/);
  assert.match(game, /mode: Phaser\.Scale\.NONE,/);
  assert.match(game, /zoom: TARGET_SCALE,/);
  assert.doesNotMatch(game, /mode: Phaser\.Scale\.FIT,/);
});

test("labels WebGL logic size before the browser viewport size in pixels", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  assert.match(game, /const devicePixelRatio = window\.devicePixelRatio;/);
  assert.match(game, /const viewportWidth = document\.documentElement\.clientWidth;/);
  assert.match(game, /const viewportHeight = document\.documentElement\.clientHeight;/);
  assert.match(game, /const screenWidth = Math\.round\(viewportWidth \* devicePixelRatio\);/);
  assert.match(game, /const screenHeight = Math\.round\(viewportHeight \* devicePixelRatio\);/);
  assert.match(game, /const logicalWidth = Math\.round\(screenWidth \/ TARGET_SCALE\);/);
  assert.match(game, /const logicalHeight = Math\.round\(screenHeight \/ TARGET_SCALE\);/);
  assert.match(
    game,
    /WebGL \(\$\{logicalWidth\}x\$\{logicalHeight\} -> \$\{screenWidth\}x\$\{screenHeight\}px\)/,
  );
});

test("follows the player with a persistent camera deadzone debug control", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const bridge = await readFile(new URL("src/platformer-ui-bridge.js", appRoot), "utf8");

  for (const requiredSnippet of [
    "this.cameras.main.startFollow(this.player, true)",
    "this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)",
    "this.cameras.main.setDeadzone(this.cameras.main.width * 0.5, this.cameras.main.height * 0.5)",
    "this.scale.on(Phaser.Scale.Events.RESIZE, this.layout, this)",
    "this.cameraDeadzoneDebugOutline = this.add.rectangle(0, 0, 0, 0)",
    "this.cameraDeadzoneDebugOutline.setScrollFactor(0)",
    "this.cameraDeadzoneDebugOutline.setStrokeStyle(2, 0x22d3ee, 0.95)",
    "renderCameraDeadzoneDebug(enabled)",
  ]) {
    if (!game.includes(requiredSnippet)) {
      throw new Error(`The Phaser scene is missing camera deadzone behavior: ${requiredSnippet}`);
    }
  }

  for (const requiredSnippet of [
    "cameraDebugEnabled: hudSettings.cameraDebugEnabled",
    "export function setCameraDebugEnabled(enabled)",
    "localStorage.setItem(HUD_SETTINGS_STORAGE_KEY",
  ]) {
    if (!bridge.includes(requiredSnippet)) {
      throw new Error(`The UI bridge is missing persistent camera-debug behavior: ${requiredSnippet}`);
    }
  }

  for (const requiredSnippet of [
    'Camera {uiState.cameraDebugEnabled ? "✅" : "⬜"}',
    "aria-pressed={uiState.cameraDebugEnabled}",
    "setCameraDebugEnabled(!uiState.cameraDebugEnabled)",
    "header-actions",
  ]) {
    if (!ui.includes(requiredSnippet)) {
      throw new Error(`The header is missing camera debug control behavior: ${requiredSnippet}`);
    }
  }
});

test("toggles browser-viewport and inset UI-layer debug outlines independently of Phaser debug lines", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const bridge = await readFile(new URL("src/platformer-ui-bridge.js", appRoot), "utf8");
  const css = await readFile(new URL("src/ui.css", appRoot), "utf8");

  for (const requiredSnippet of [
    "screenDebugEnabled: hudSettings.screenDebugEnabled",
    "export function setScreenDebugEnabled(enabled)",
    "screenDebugEnabled: uiState.screenDebugEnabled",
  ]) {
    assert.ok(bridge.includes(requiredSnippet), `The UI bridge is missing persistent screen-debug behavior: ${requiredSnippet}`);
  }

  for (const requiredSnippet of [
    'Screen {uiState.screenDebugEnabled ? "✅" : "⬜"}',
    "aria-pressed={uiState.screenDebugEnabled}",
    "setScreenDebugEnabled(!uiState.screenDebugEnabled)",
    "uiState.screenDebugEnabled && <ScreenDebugOutlines />",
  ]) {
    assert.ok(ui.includes(requiredSnippet), `The header is missing screen debug control behavior: ${requiredSnippet}`);
  }

  assert.match(css, /#ui_layer\s*\{[^}]*position:\s*fixed;[^}]*inset:\s*min\(5vw, 5vh\);/s, "The UI layer must keep an equal 5 percent-of-short-side gap on every screen edge.");
  assert.match(css, /\.screen-debug-viewport\s*\{[^}]*position:\s*fixed;[^}]*inset:\s*0;[^}]*border:\s*1px solid #4ade80;/s);
  assert.match(css, /\.screen-debug-ui-outline\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*border:\s*1px solid #22d3ee;/s);
  assert.doesNotMatch(ui, /screen-debug-dom-margin/, "The temporary red DOM-margin comparison outline must be removable.");
  assert.doesNotMatch(css, /screen-debug-dom-margin/, "The temporary red DOM-margin comparison styles must be removable.");
  assert.ok(css.includes(".settings-control"), "Screen must share the borderless settings-control style.");
  assert.match(css, /\.settings-control:hover,\s*\.settings-control:focus-visible\s*\{/, "Screen must share the settings hover and focus treatment.");
  assert.doesNotMatch(game, /screenDebugGraphics|renderScreenDebug/, "Screen outlines must not be constrained to Phaser's logical canvas.");
});

test("keeps the upper-right Fullscreen setting off until the player enables it", async () => {
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const css = await readFile(new URL("src/ui.css", appRoot), "utf8");
  const bridge = await readFile(new URL("src/platformer-ui-bridge.js", appRoot), "utf8");
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  for (const requiredSnippet of [
    "const [fullscreenEnabled, setFullscreenEnabled] = useState(false)",
    'Fullscreen {fullscreenEnabled ? "✅" : "⬜"}',
    "aria-pressed={fullscreenEnabled}",
    "document.documentElement.requestFullscreen()",
    "document.exitFullscreen()",
    'document.addEventListener("fullscreenchange", syncFullscreenState)',
    "toggleFullscreen as togglePlatformerFullscreen",
    "const handledByPhaser = togglePlatformerFullscreen();",
    "if (handledByPhaser) {",
  ]) {
    assert.ok(ui.includes(requiredSnippet), `The Fullscreen setting is missing ${requiredSnippet}.`);
  }

  assert.ok(
    ui.indexOf("Fullscreen {fullscreenEnabled") > ui.indexOf("Tilemap {uiState.tilemapDebugEnabled"),
    "The Fullscreen setting must appear after the existing upper-right settings.",
  );

  assert.match(
    css,
    /\.settings-control\s*\{[^}]*appearance:\s*none;[^}]*border:\s*0;[^}]*padding:\s*0;[^}]*background:\s*transparent;[^}]*cursor:\s*pointer;/s,
    "Fullscreen must share Tilemap's borderless setting-control style.",
  );
  assert.match(
    css,
    /\.settings-control:hover,\s*\.settings-control:focus-visible\s*\{/s,
    "Fullscreen must share Tilemap's hover and keyboard-focus treatment.",
  );

  for (const requiredSnippet of [
    "export function toggleFullscreen()",
    "return platformerActions.toggleFullscreen();",
  ]) {
    assert.ok(bridge.includes(requiredSnippet), `The UI bridge must support Phaser fullscreen: ${requiredSnippet}.`);
  }

  for (const requiredSnippet of [
    "toggleFullscreen: () => this.toggleFullscreen()",
    "toggleFullscreen()",
    "this.scale.fullscreen.available",
    "this.scale.startFullscreen()",
    "this.scale.stopFullscreen()",
    "fullscreenTarget: document.body",
  ]) {
    assert.ok(game.includes(requiredSnippet), `The Phaser scene must use its fullscreen API: ${requiredSnippet}.`);
  }
});

test("groups the existing upper-right controls beneath a visible Settings subtitle", async () => {
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const css = await readFile(new URL("src/ui.css", appRoot), "utf8");

  for (const requiredSnippet of [
    '<div className="settings-group" role="group" aria-label="Settings">',
    '<span className="ui-subtitle">Settings</span>',
    'className="settings-control ui-label"',
  ]) {
    assert.ok(ui.includes(requiredSnippet), `The Settings feature is missing ${requiredSnippet}.`);
  }
  assert.equal(
    ui.match(/className="settings-control ui-label"/g)?.length,
    4,
    "Camera, Tilemap, Screen, and Fullscreen must share the UI Label style.",
  );

  assert.ok(
    ui.indexOf('aria-label="View the repository on GitHub"')
      < ui.indexOf('<span className="ui-subtitle">Settings</span>')
      && ui.indexOf('<span className="ui-subtitle">Settings</span>')
        < ui.indexOf('Camera {uiState.cameraDebugEnabled')
      && ui.indexOf('Camera {uiState.cameraDebugEnabled')
        < ui.indexOf('Tilemap {uiState.tilemapDebugEnabled')
      && ui.indexOf('Tilemap {uiState.tilemapDebugEnabled')
        < ui.indexOf('Screen {uiState.screenDebugEnabled')
      && ui.indexOf('Screen {uiState.screenDebugEnabled')
        < ui.indexOf('Fullscreen {fullscreenEnabled'),
    "The GitHub link, Settings subtitle, and controls must retain their vertical order.",
  );

  assert.match(css, /\.settings-group\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*align-items:\s*flex-end;/s);
  assert.match(css, /\.ui-shell\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/s, "The UI shell must keep the header within a narrow viewport.");
  assert.match(css, /\.ui-label\s*\{[^}]*font:\s*600 clamp\(0\.65rem, 1\.5vw, 0\.75rem\) system-ui, sans-serif;/s);
  assert.match(css, /\.ui-subtitle\s*\{[^}]*font:\s*600 clamp\(0\.75rem, 1\.75vw, 0\.875rem\) system-ui, sans-serif;/s);
  assert.match(css, /\.settings-control\s*\{[^}]*appearance:\s*none;[^}]*border:\s*0;[^}]*padding:\s*0;[^}]*background:\s*transparent;[^}]*cursor:\s*pointer;[^}]*pointer-events:\s*auto;/s);
  assert.match(css, /\.settings-control:hover,\s*\.settings-control:focus-visible\s*\{[^}]*text-decoration:\s*underline;[^}]*outline:\s*none;/s);
});
