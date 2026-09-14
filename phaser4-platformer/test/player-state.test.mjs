import { access } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
import {
  PLAYER_ANIMATION_CATALOG,
  getPlayerAnimationDefinition,
} from "../src/player-animation-catalog.js";
import {
  PLAYER_HEALTH,
  createPlayerState,
  getSelectedPlayerAnimation,
  handlePlayerDamage,
  markPlayerLanded,
  requestPlayerAttack,
  requestPlayerJump,
} from "../src/player-state.js";

const appRoot = new URL("../", import.meta.url);

test("catalogs every supplied Foozle Player sheet with native 32 pixel frames", async () => {
  const expected = [
    ["idle", "cyber prisoner idle-Sheet.png", 8, true],
    ["run", "cyber prisoner run cycle-Sheet.png", 8, true],
    ["jump", "cyber prisoner jump cycle -Sheet.png", 11, false],
    ["double-jump", "cyber prisoner double jump-Sheet.png", 7, false],
    ["wall-grab", "cyber prisoner Wall grab-Sheet.png", 6, true],
    ["light-attack", "cyber prisoner Light attack slash-Sheet.png", 18, false],
    ["heavy-attack", "cyber prisoner Heavy attack laser -Sheet.png", 30, false],
    ["hurt", "cyber prisoner hurt-Sheet.png", 3, false],
    ["death", "cyber prisoner death-Sheet.png", 6, false],
  ];

  assert.deepEqual(
    PLAYER_ANIMATION_CATALOG.map(({ id, fileName, frames, loop }) => [id, fileName, frames, loop]),
    expected,
  );

  for (const definition of PLAYER_ANIMATION_CATALOG) {
    await access(new URL(`assets/images/FoozlePlayer/${definition.fileName}`, appRoot));
    assert.equal(definition.frameWidth, 32);
    assert.equal(definition.frameHeight, 32);
    assert.equal(getPlayerAnimationDefinition(definition.id), definition);
  }
});

test("selects idle, run, and the airborne directional wall-grab state", () => {
  const state = createPlayerState();

  assert.equal(getSelectedPlayerAnimation(state, { grounded: true, horizontalInput: 0 }, 0), "idle");
  assert.equal(getSelectedPlayerAnimation(state, { grounded: true, horizontalInput: 1 }, 0), "run");
  assert.equal(
    getSelectedPlayerAnimation(state, { grounded: false, horizontalInput: -1, blockedLeft: true }, 0),
    "wall-grab",
  );
  assert.equal(
    getSelectedPlayerAnimation(state, { grounded: false, horizontalInput: 1, blockedLeft: true }, 0),
    "idle",
  );
});

test("permits one air jump only after a grounded jump and resets on landing", () => {
  const state = createPlayerState();

  assert.equal(requestPlayerJump(state, { grounded: false, time: 0 }), null);
  assert.equal(requestPlayerJump(state, { grounded: true, time: 0 }), "jump");
  assert.equal(requestPlayerJump(state, { grounded: false, time: 100 }), "double-jump");
  assert.equal(requestPlayerJump(state, { grounded: false, time: 200 }), null);

  markPlayerLanded(state);
  assert.equal(requestPlayerJump(state, { grounded: true, time: 300 }), "jump");
});

test("uses a strict 500 millisecond boundary for alternating attacks", () => {
  const state = createPlayerState();

  assert.equal(requestPlayerAttack(state, 0), "light-attack");
  assert.equal(requestPlayerAttack(state, 499), "heavy-attack");
  assert.equal(requestPlayerAttack(state, 998), "light-attack");
  assert.equal(requestPlayerAttack(state, 1498), "light-attack");
});

test("applies four protected laser hits before terminal death blocks input", () => {
  const state = createPlayerState();

  assert.equal(state.health, PLAYER_HEALTH);
  assert.deepEqual(handlePlayerDamage(state, 0), { accepted: true, died: false, health: 75 });
  assert.deepEqual(handlePlayerDamage(state, 499), { accepted: false, died: false, health: 75 });
  assert.deepEqual(handlePlayerDamage(state, 500), { accepted: true, died: false, health: 50 });
  assert.deepEqual(handlePlayerDamage(state, 1000), { accepted: true, died: false, health: 25 });
  assert.deepEqual(handlePlayerDamage(state, 1500), { accepted: true, died: true, health: 0 });
  assert.equal(getSelectedPlayerAnimation(state, { grounded: true, horizontalInput: 1 }, 1501), "death");
  assert.equal(requestPlayerJump(state, { grounded: true, time: 1501 }), null);
  assert.equal(requestPlayerAttack(state, 1501), null);
});
