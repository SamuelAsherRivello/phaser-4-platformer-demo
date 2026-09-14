import { readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

const applicationRoot = resolve("phaser4-platformer");
const tiledRoot = resolve(applicationRoot, "assets/tiled");
const mapSourcePath = resolve(tiledRoot, "Level01.tmj");
const mapDataPath = resolve(applicationRoot, "assets/maps/foozle-lab-level.json");
const runtimeMapPath = resolve(applicationRoot, "assets/maps/foozle-lab-runtime.json");
const runtimeStructureImagePath = resolve(
  applicationRoot,
  "assets/images/FoozleLab/Tileset/level_tileset-288.png",
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toMapRelativePath(mapPath, targetPath) {
  return relative(dirname(mapPath), targetPath).replaceAll("\\", "/");
}

async function loadEmbeddedTilesets(map) {
  return Promise.all(map.tilesets.map(async ({ firstgid, source }) => {
    const tilesetPath = resolve(tiledRoot, source);
    const tileset = JSON.parse(await readFile(tilesetPath, "utf8"));
    const imagePath = resolve(dirname(tilesetPath), tileset.image);

    return {
      ...tileset,
      firstgid,
      image: toMapRelativePath(mapDataPath, imagePath),
    };
  }));
}

async function syncLevel() {
  const authoringMap = JSON.parse(await readFile(mapSourcePath, "utf8"));
  const embeddedTilesets = await loadEmbeddedTilesets(authoringMap);

  const levelData = clone(authoringMap);
  delete levelData.compressionlevel;
  levelData.tilesets = embeddedTilesets;

  const [structureTileset] = embeddedTilesets;
  const runtimeMap = clone(levelData);
  runtimeMap.tilesets = [{
    ...structureTileset,
    image: toMapRelativePath(runtimeMapPath, runtimeStructureImagePath),
    imagewidth: 288,
    imageheight: 288,
    columns: 9,
    tilecount: 81,
  }];

  const firstUnsupportedGid = structureTileset.firstgid + structureTileset.tilecount;
  runtimeMap.layers = runtimeMap.layers.map((layer) => {
    if (layer.type !== "tilelayer") {
      return layer;
    }

    return {
      ...layer,
      data: layer.data.map((gid) => gid >= structureTileset.firstgid && gid < firstUnsupportedGid ? gid : 0),
    };
  });

  await Promise.all([
    writeFile(mapDataPath, `${JSON.stringify(levelData, null, 2)}\n`),
    writeFile(runtimeMapPath, `${JSON.stringify(runtimeMap, null, 2)}\n`),
  ]);

  console.log("Synced Level01.tmj to its runtime data and WebGL-safe static map.");
}

await syncLevel();
