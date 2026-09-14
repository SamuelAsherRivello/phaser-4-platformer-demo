import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

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
    await readFile(new URL("assets/tiled/treasure-hunters-level.tmj", appRoot), "utf8"),
  );
  const runtimeMap = JSON.parse(
    await readFile(new URL("assets/maps/treasure-hunters-level.json", appRoot), "utf8"),
  );

  assert.deepEqual(
    authoringMap.tilesets.map((tileset) => tileset.source),
    [
      "tilesets/palm-tree-island-terrain.tsj",
      "tilesets/pirate-ship-terrain.tsj",
      "tilesets/pirate-ship-platforms.tsj",
    ],
  );
  assert.deepEqual(
    runtimeMap.tilesets.map((tileset) => tileset.name),
    ["Palm Tree Island Terrain", "Pirate Ship Terrain", "Pirate Ship Platforms"],
  );

  for (const tilesetPath of authoringMap.tilesets.map((tileset) => tileset.source)) {
    const tileset = JSON.parse(
      await readFile(new URL(`assets/tiled/${tilesetPath}`, appRoot), "utf8"),
    );

    assert.equal(tileset.tilewidth, 32);
    assert.equal(tileset.tileheight, 32);
    assert.equal(tileset.columns * tileset.tilewidth, tileset.imagewidth);
    assert.equal(tileset.tilecount * tileset.tileheight / tileset.columns, tileset.imageheight);
  }

  for (const map of [authoringMap, runtimeMap]) {
    assert.equal(map.width, 20);
    assert.equal(map.height, 20);
    assert.equal(map.tilewidth, 32);
    assert.equal(map.tileheight, 32);

    const tileLayers = map.layers.filter((layer) => layer.type === "tilelayer");
    assert.deepEqual(tileLayers.map((layer) => layer.name), ["Background", "Foreground"]);
    assert.ok(tileLayers.every((layer) => layer.width === 20 && layer.height === 20 && layer.data.length === 400));
    assert.equal(new Set(tileLayers[0].data).size, 1);

    const platformRuns = Array.from({ length: map.height }, (_, row) => (
      tileLayers[1].data.slice(row * map.width, (row + 1) * map.width).filter((tile) => tile !== 0).length
    )).filter(Boolean);
    assert.ok(platformRuns.length > 1);
    assert.ok(platformRuns.every((runLength) => runLength === 5));

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
        x: 208,
        y: 304,
      },
    ]);
    assert.equal(tileLayers[1].data[10 * map.width + 6], 340);
  }

  assert.deepEqual(authoringMap.layers, runtimeMap.layers);
});

test("uses GPU layers, physics, and the requested platformer actions", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  for (const requiredSnippet of [
    "this.load.tilemapTiledJSON",
    "this.add.spriteGPULayer",
    "map.createLayer(\"Background\", pirateTerrain, 0, 0, true)",
    "map.createLayer(\"Foreground\", piratePlatforms, 0, 0, true)",
    "this.physics.add.existing(this.player)",
    "this.physics.add.collider(this.player, this.foregroundLayer)",
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

test("uses a two-times-taller player and a two-times-higher jump", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  assert.match(game, /const PLAYER_WIDTH = 14;/);
  assert.match(game, /const PLAYER_HEIGHT = 28;/);
  assert.match(
    game,
    /this\.add\.rectangle\(playerSpawn\.x, playerSpawn\.y, PLAYER_WIDTH, PLAYER_HEIGHT, 0x38bdf8\)/,
  );
  assert.match(game, /const JUMP_HEIGHT_MULTIPLIER = 2;/);
  assert.match(game, /const JUMP_SPEED = BASE_JUMP_SPEED \* Math\.sqrt\(JUMP_HEIGHT_MULTIPLIER\);/);
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
    "Action 2 (B)",
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
    '"b"',
    '"B"',
    '" "',
    'keys.has("c") || keys.has("C") || keys.has(" ")',
    'keys.has("b") || keys.has("B")',
    "Move (WASD / Arrows)",
    "Action 1 (C)",
    "Action 2 (B)",
  ]) {
    assert.ok(ui.includes(requiredSnippet), `The controller must include ${requiredSnippet}.`);
  }

  assert.doesNotMatch(ui, /Action 2 \(V\)/);
  assert.doesNotMatch(ui, /<span>[^<]*Space/);
  assert.match(readme, /W\/A\/S\/D and the arrow keys/);
  assert.match(readme, /Action 2 \(B\)/);
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
    'className="tilemap-debug-toggle settings-text-style"',
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
  const tilemapToggleStyles = css.match(/\.tilemap-debug-toggle,\s*\.fullscreen-toggle,\s*\.camera-debug-toggle\s*\{[^}]*\}/s)?.[0] ?? "";
  assert.match(tilemapToggleStyles, /\bappearance:\s*none;/);
  assert.match(tilemapToggleStyles, /\bborder:\s*0;/);
  assert.match(tilemapToggleStyles, /\bbackground:\s*transparent;/);
  assert.match(
    css,
    /#tilemap_status,\s*#renderer_status,\s*#fps_status,\s*\.settings-text-style\s*\{[^}]*color:\s*#93c5fd;[^}]*font:\s*600 clamp\(0\.65rem, 1\.5vw, 0\.75rem\) system-ui, sans-serif;/s,
  );
  assert.match(
    css,
    /\.tilemap-debug-toggle:hover,\s*\.tilemap-debug-toggle:focus-visible,\s*\.fullscreen-toggle:hover,\s*\.fullscreen-toggle:focus-visible\s*\{[^}]*text-decoration:\s*underline;[^}]*outline:\s*none;/s,
  );

  for (const requiredSnippet of [
    "this.tilemapDebugGraphics = this.add.graphics()",
    "renderTilemapDebug(enabled)",
    "this.tilemapDebugGraphics.strokeRect",
  ]) {
    if (!game.includes(requiredSnippet)) {
      throw new Error(`Phaser is missing tilemap box rendering: ${requiredSnippet}`);
    }
  }
});

test("shows visible tile columns and rows between the WebGL and FPS statuses", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const bridge = await readFile(new URL("src/platformer-ui-bridge.js", appRoot), "utf8");

  assert.match(bridge, /tilemapStatus:/);
  assert.match(bridge, /export function setTilemapStatus\(tilemapStatus\)/);
  assert.match(game, /setTilemapStatus/);
  assert.match(game, /Math\.ceil\(logicalWidth \/ TILE_SIZE\)/);
  assert.match(game, /Math\.ceil\(logicalHeight \/ TILE_SIZE\)/);
  assert.match(game, /Tilemap \(\$\{TILE_SIZE\}x\$\{TILE_SIZE\} -> \$\{visibleColumns\}x\$\{visibleRows\}\)/);
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

test("follows the player with a persistent camera deadzone debug control", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");
  const ui = await readFile(new URL("src/ui.jsx", appRoot), "utf8");
  const bridge = await readFile(new URL("src/platformer-ui-bridge.js", appRoot), "utf8");

  for (const requiredSnippet of [
    "this.cameras.main.startFollow(this.player, true)",
    "this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)",
    "this.cameras.main.setDeadzone(this.cameras.main.width * 0.5, this.cameras.main.height * 0.5)",
    "this.cameraDeadzoneDebugGraphics = this.add.graphics().setScrollFactor(0)",
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
    /\.tilemap-debug-toggle,\s*\.fullscreen-toggle,\s*\.camera-debug-toggle\s*\{[^}]*appearance:\s*none;[^}]*border:\s*0;[^}]*padding:\s*0;[^}]*background:\s*transparent;[^}]*cursor:\s*pointer;/s,
    "Fullscreen must share Tilemap's borderless setting-control style.",
  );
  assert.match(
    css,
    /\.tilemap-debug-toggle:hover,\s*\.tilemap-debug-toggle:focus-visible,\s*\.fullscreen-toggle:hover,\s*\.fullscreen-toggle:focus-visible\s*\{/s,
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
