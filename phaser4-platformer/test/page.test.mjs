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
  if (!page.includes('src="/src/main.js"')) {
    throw new Error("The page must load the Phaser game module.");
  }
});

test("shows the actual WebGL renderer label with the virtual resolution", async () => {
  const page = await readFile(new URL("index.html", appRoot), "utf8");
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  if (!page.includes('id="renderer_status"')) {
    throw new Error("The header needs a dedicated renderer status line.");
  }
  if (!page.includes('id="fps_status"')) {
    throw new Error("The header needs a dedicated FPS status line.");
  }
  if (!game.includes("WebGL (${LOGICAL_WIDTH}x${LOGICAL_HEIGHT} -> ${presentationWidth}x${presentationHeight})")) {
    throw new Error("The renderer status must show logical and presentation resolutions.");
  }
  if (!game.includes("canvas?.clientWidth") || !game.includes("canvas?.clientHeight")) {
    throw new Error("The renderer status must read the fitted presentation size from the canvas.");
  }
  for (const requiredSnippet of [
    "const TILE_SIZE = 32",
    "const LOGICAL_WIDTH = 320",
    "const LOGICAL_HEIGHT = 180",
    "const TARGET_WIDTH = 1280",
    "const TARGET_HEIGHT = 720",
    "const TARGET_SCALE = 4",
    "mode: Phaser.Scale.FIT",
    "autoCenter: Phaser.Scale.CENTER_BOTH",
  ]) {
    if (!game.includes(requiredSnippet)) {
      throw new Error(`The game is missing its fixed-resolution contract: ${requiredSnippet}`);
    }
  }
  if (!game.includes("FPS (${fps})")) {
    throw new Error("The FPS status must show Phaser's live frame-rate value.");
  }
  if (!game.includes("window.setInterval(updateFrameRate, 1000)")) {
    throw new Error("The FPS status must refresh only once per second.");
  }
  if (!game.includes("type: Phaser.WEBGL")) {
    throw new Error("The game must require WebGL without a Canvas fallback.");
  }
  if (!game.includes("pixelArt: true")) {
    throw new Error("The game must use nearest-neighbor pixel-art rendering.");
  }
});

test("provides a Tiled level with the supplied 32 pixel tilesets", async () => {
  const level = JSON.parse(
    await readFile(new URL("assets/maps/treasure-hunters-level.json", appRoot), "utf8"),
  );

  assert.equal(level.tilewidth, 32);
  assert.equal(level.tileheight, 32);
  assert.deepEqual(
    level.layers.map((layer) => layer.name),
    ["Background", "Foreground"],
  );
  assert.equal(new Set(level.layers[0].data).size, 1);
  assert.equal(level.layers[1].data.filter((tile) => tile !== 0).length, 15);
  const platformRuns = [];
  for (let row = 0; row < level.height; row += 1) {
    const tiles = level.layers[1].data.slice(row * level.width, (row + 1) * level.width);
    const occupied = tiles.filter((tile) => tile !== 0);
    if (occupied.length > 0) {
      platformRuns.push(occupied.length);
    }
  }
  assert.deepEqual(platformRuns, [5, 5, 5]);
  assert.equal(level.tilesets.length, 3);
  assert.deepEqual(
    level.tilesets.map((tileset) => tileset.name),
    ["Palm Tree Island Terrain", "Pirate Ship Terrain", "Pirate Ship Platforms"],
  );
});

test("keeps Tiled authoring files and the runtime export aligned", async () => {
  const authoringMap = JSON.parse(
    await readFile(new URL("assets/tiled/treasure-hunters-level.tmj", appRoot), "utf8"),
  );

  assert.deepEqual(
    authoringMap.tilesets.map((tileset) => tileset.source),
    [
      "tilesets/palm-tree-island-terrain.tsj",
      "tilesets/pirate-ship-terrain.tsj",
      "tilesets/pirate-ship-platforms.tsj",
    ],
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
    "jumpPlayer()",
    "attackPlayer()",
    "this.player.body.blocked.down",
  ]) {
    if (!game.includes(requiredSnippet)) {
      throw new Error(`The game is missing requested platformer behavior: ${requiredSnippet}`);
    }
  }
});

test("maps horizontal keyboard and joystick controls to the platformer square", async () => {
  const game = await readFile(new URL("src/main.js", appRoot), "utf8");

  for (const requiredSnippet of [
    "import * as Phaser from \"phaser\"",
    "this.add.rectangle",
    "this.player.setName(\"player\")",
    "KeyCodes.LEFT",
    "KeyCodes.A",
    "KeyCodes.RIGHT",
    "KeyCodes.D",
    "KeyCodes.C",
    "KeyCodes.V",
    "SimpleMobileJoystick/Move Joystick Background.png",
    "SimpleMobileJoystick/Move Joystick Handle.png",
    "SimpleMobileJoystick/Aim Joystick Background.png",
    "SimpleMobileJoystick/Aim Joystick Handle.png",
    "SimpleMobileJoystick/Joystick Background.png",
    "SimpleMobileJoystick/Joystick Handle.png",
    "move-joystick-background",
    "aim-joystick-background",
    "joystick-background",
    "const setVisualInput =",
    "this.moveJoystick.setVisualInput(keyboardHorizontal, 0)",
    "this.actionOneButton.press()",
    "this.actionTwoButton.press()",
    "keyup-C",
    "keyup-V",
    "UI_SAFE_AREA_RATIO = 0.05",
    "this.virtualControllerArea = new Phaser.Geom.Rectangle",
    "this.virtualControllerArea.centerY",
    "this.virtualControllerArea.left + JOYSTICK_SIZE / 2",
    "this.virtualControllerArea.right - ACTION_BUTTON_SIZE / 2",
    "Move (A/D)",
    "Action 1 (C)",
    "Action 2 (V)",
  ]) {
    if (!game.includes(requiredSnippet)) {
      throw new Error(`The game is missing its required control: ${requiredSnippet}`);
    }
  }

  if (game.includes("this.status")) {
    throw new Error("The player should not have a text status label in the game layer.");
  }
  if (game.includes('"GAME LAYER"')) {
    throw new Error("The game should not show a GAME LAYER label.");
  }
  for (const unsupportedSnippet of [
    "keyboardVertical",
    "this.joystickMovement.y",
    "KeyCodes.UP",
    "KeyCodes.DOWN",
    "KeyCodes.W",
    "KeyCodes.S",
  ]) {
    if (game.includes(unsupportedSnippet)) {
      throw new Error(`The platformer must not retain vertical movement input: ${unsupportedSnippet}`);
    }
  }
});
