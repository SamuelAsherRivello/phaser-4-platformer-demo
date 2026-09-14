import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

test("keeps every open playfield cell free of tiled background artwork", async () => {
  const mapUrls = [
    new URL("assets/tiled/Level01.tmj", appRoot),
    new URL("assets/maps/foozle-lab-level.json", appRoot),
    new URL("assets/maps/foozle-lab-runtime.json", appRoot),
  ];

  for (const mapUrl of mapUrls) {
    const map = JSON.parse(await readFile(mapUrl, "utf8"));
    const background = map.layers.find((layer) => layer.name === "Background");

    assert.ok(background, `${mapUrl.pathname} must retain a Background layer.`);
    assert.ok(
      background.data.every((tile) => tile === 0),
      `${mapUrl.pathname} must leave every open playfield cell empty.`,
    );
  }
});
