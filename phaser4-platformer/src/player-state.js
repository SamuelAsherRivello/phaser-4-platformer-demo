import { getPlayerAnimationDuration } from "./player-animation-catalog.js";

export const PLAYER_HEALTH = 100;
export const PLAYER_DAMAGE = 25;
export const PLAYER_HIT_PROTECTION_MS = 500;
export const PLAYER_ATTACK_CHAIN_MS = 500;

export function createPlayerState() {
  return {
    health: PLAYER_HEALTH,
    isDead: false,
    hasGroundJump: false,
    airJumpUsed: false,
    lastAttackAt: null,
    lastAttack: null,
    damageProtectedUntil: 0,
    activeAnimation: null,
    activeAnimationEndsAt: 0,
  };
}

function setActiveAnimation(state, animation, time) {
  state.activeAnimation = animation;
  state.activeAnimationEndsAt = time + getPlayerAnimationDuration(animation);
}

export function requestPlayerJump(state, { grounded, time }) {
  if (state.isDead) {
    return null;
  }

  if (grounded) {
    state.hasGroundJump = true;
    state.airJumpUsed = false;
    setActiveAnimation(state, "jump", time);
    return "jump";
  }

  if (!state.hasGroundJump || state.airJumpUsed) {
    return null;
  }

  state.airJumpUsed = true;
  setActiveAnimation(state, "double-jump", time);
  return "double-jump";
}

export function markPlayerLanded(state) {
  state.hasGroundJump = false;
  state.airJumpUsed = false;
  if (state.activeAnimation === "jump" || state.activeAnimation === "double-jump") {
    state.activeAnimation = null;
    state.activeAnimationEndsAt = 0;
  }
}

export function requestPlayerAttack(state, time) {
  if (state.isDead) {
    return null;
  }

  const rapidPress = state.lastAttackAt !== null && time - state.lastAttackAt < PLAYER_ATTACK_CHAIN_MS;
  const attack = rapidPress && state.lastAttack === "light-attack" ? "heavy-attack" : "light-attack";
  state.lastAttackAt = time;
  state.lastAttack = attack;
  setActiveAnimation(state, attack, time);
  return attack;
}

export function handlePlayerDamage(state, time) {
  if (state.isDead || time < state.damageProtectedUntil) {
    return { accepted: false, died: false, health: state.health };
  }

  state.health = Math.max(0, state.health - PLAYER_DAMAGE);
  state.damageProtectedUntil = time + PLAYER_HIT_PROTECTION_MS;
  if (state.health === 0) {
    state.isDead = true;
    state.activeAnimation = "death";
    state.activeAnimationEndsAt = Number.POSITIVE_INFINITY;
    return { accepted: true, died: true, health: state.health };
  }

  setActiveAnimation(state, "hurt", time);
  return { accepted: true, died: false, health: state.health };
}

export function getSelectedPlayerAnimation(state, context, time) {
  if (state.isDead) {
    return "death";
  }

  if (state.activeAnimation && time < state.activeAnimationEndsAt) {
    return state.activeAnimation;
  }
  state.activeAnimation = null;
  state.activeAnimationEndsAt = 0;

  const pressingIntoLeftWall = context.blockedLeft && context.horizontalInput < 0;
  const pressingIntoRightWall = context.blockedRight && context.horizontalInput > 0;
  if (!context.grounded && (pressingIntoLeftWall || pressingIntoRightWall)) {
    return "wall-grab";
  }

  return context.grounded && context.horizontalInput !== 0 ? "run" : "idle";
}
