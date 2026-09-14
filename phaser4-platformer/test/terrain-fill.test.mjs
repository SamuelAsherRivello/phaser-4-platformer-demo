import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

test("AutoMap turns a StructureMask rectangle into the nine deterministic frame tiles", async () => {
  const project = JSON.parse(
    await readFile(new URL("assets/tiled/PhaserPlatformer.tiled-project", appRoot), "utf8"),
  );
  assert.equal(project.automappingRulesFile, "automap/rules.txt");

  const rules = await readFile(new URL("assets/tiled/automap/rules.txt", appRoot), "utf8");
  assert.match(rules, /\[Level01\.tmj\][\s\S]*structure-rectangles\.tmj/);

  const ruleMap = JSON.parse(
    await readFile(new URL("assets/tiled/automap/structure-rectangles.tmj", appRoot), "utf8"),
  );
  assert.equal(ruleMap.properties.find(({ name }) => name === "AutomappingRadius")?.value, 1);
  assert.deepEqual(
    ruleMap.layers.map(({ name }) => name),
    ["input_StructureMask", "inputnot_StructureMask", "output_Midground1"],
  );

  const output = ruleMap.layers.find(({ name }) => name === "output_Midground1");
  const tileAt = (x, y) => output.data[y * ruleMap.width + x];
  assert.deepEqual(
    [tileAt(1, 1), tileAt(5, 1), tileAt(9, 1), tileAt(1, 5), tileAt(5, 5), tileAt(9, 5), tileAt(1, 9), tileAt(5, 9), tileAt(9, 9)],
    [1, 2, 3, 10, 11, 12, 19, 20, 21],
    "Every rectangular mask cell gets its one stable corner, edge, or center tile.",
  );
});
