import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

test("the two manual rule maps are retained but no longer registered with the project", async () => {
  const project = JSON.parse(
    await readFile(new URL("assets/tiled/PhaserPlatformer.tiled-project", appRoot), "utf8"),
  );
  assert.equal(project.automappingRulesFile, undefined);

  const rules = await readFile(new URL("assets/tiled/automap/rules.txt", appRoot), "utf8");
  assert.match(rules, /\[Level01\.tmj\][\s\S]*rounded-room-frame\.tmj/);
  assert.match(rules, /\[Level01\.tmj\][\s\S]*structure-room-frame\.tmj/);
});

test("AutoMap uses eight connected border rules for each scalable room frame", async () => {
  const readRule = async (fileName) => JSON.parse(
    await readFile(new URL(`assets/tiled/automap/${fileName}`, appRoot), "utf8"),
  );
  const borderTiles = (ruleMap) => {
    const output = ruleMap.layers.find(({ name }) => name === "output_Midground1");
    return output.data.filter(Boolean);
  };
  const ruleIslandCount = (ruleMap) => {
    const cells = new Set();
    for (const layer of ruleMap.layers) {
      for (const [index, tile] of layer.data.entries()) {
        if (tile) cells.add(index);
      }
    }
    let islands = 0;
    while (cells.size) {
      islands += 1;
      const pending = [cells.values().next().value];
      cells.delete(pending[0]);
      while (pending.length) {
        const index = pending.pop();
        const x = index % ruleMap.width;
        const y = Math.floor(index / ruleMap.width);
        for (const neighborY of [y - 1, y, y + 1]) {
          for (const neighborX of [x - 1, x, x + 1]) {
            const neighbor = neighborY * ruleMap.width + neighborX;
            if (neighborX >= 0 && neighborX < ruleMap.width && neighborY >= 0 && neighborY < ruleMap.height && cells.delete(neighbor)) {
              pending.push(neighbor);
            }
          }
        }
      }
    }
    return islands;
  };

  const rounded = await readRule("rounded-room-frame.tmj");
  assert.deepEqual(
    borderTiles(rounded),
    [61, 62, 63, 70, 72, 79, 80, 81],
    "The dark set produces only its four corners and four straight border tiles.",
  );
  assert.equal(ruleIslandCount(rounded), 8, "Each rounded edge or corner must be one isolated, connected rule.");

  const blue = await readRule("structure-room-frame.tmj");
  assert.deepEqual(
    borderTiles(blue),
    [1, 2, 4, 10, 13, 28, 29, 31],
    "The blue set excludes the user-marked red tiles from the scalable border rule.",
  );
  assert.equal(ruleIslandCount(blue), 8, "Each blue edge or corner must be one isolated, connected rule.");
});

test("native Terrain Shape Fill paints either rectangular room frame onto the selected layer", async () => {
  const tileset = JSON.parse(
    await readFile(new URL("assets/tiled/tilesets/foozle-lab-structure.tsj", appRoot), "utf8"),
  );
  assert.deepEqual(
    tileset.wangsets.map(({ name }) => name),
    ["Blue Room Border", "Dark Rounded Room Border"],
  );
  assert.deepEqual(
    tileset.wangsets.map(({ type }) => type),
    ["edge", "edge"],
  );
  assert.deepEqual(
    tileset.wangsets[0].wangtiles.map(({ tileid }) => tileid),
    [0, 1, 3, 9, 10, 12, 27, 28, 30],
    "The blue Terrain set uses only the unmarked border and centre tiles.",
  );
  assert.deepEqual(
    tileset.wangsets[1].wangtiles.map(({ tileid }) => tileid),
    [51, 52, 53, 60, 61, 62, 69, 70, 71],
    "The dark Terrain set maps the actual rounded-room frame, not the hazard and prop tiles below it.",
  );
});
