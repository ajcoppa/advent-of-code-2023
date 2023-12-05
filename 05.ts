#!/usr/bin/env ts-node

import fs from "fs/promises";

async function main() {
  const text: string = await fs.readFile("05-input.txt", {
    encoding: "utf-8",
  });
  const seedsLine = text.match(/seeds: ([^\n]+)/);
  if (!seedsLine) {
    console.error(`Failed parsing seeds line: ${seedsLine}`);
    process.exit(1);
  }
  const seeds = parseSeeds(seedsLine[1]);
  const seedMapLines = text.match(/\w+-to-\w+ map:(.*)/);
  if (!seedMapLines) {
    console.error(`Failed parsing seed maps`);
    process.exit(1);
  }
  const maps = parseMaps(text);
  console.log(`Part 1: ${partOne(seeds, maps)}`);
}

function partOne(seeds: number[], maps: SeedMap[]): number {
  const processedSeeds = seeds.map(seed => processSeed(seed, maps));
  return Math.min(...processedSeeds);
}

function processSeed(seed: number, maps: SeedMap[]): number {
  let processedSeed = seed;
  maps.forEach(map => {
    let processedAlready = false;
    map.ranges.forEach(range => {
      if (!processedAlready && processedSeed >= range.source && processedSeed < range.source + range.diff) {
        const diff = range.dest - range.source;
        processedSeed += diff;
        processedAlready = true;
      } 
    });

  });
  return processedSeed;
}

function parseSeeds(line: string): number[] {
  return line.split(" ").map(s => parseInt(s, 10));
}

function parseMaps(text: string): SeedMap[] {
  return text.split("\n\n").slice(1).map((seedmapText) => {
    const lines = seedmapText.split("\n");
    const nameMatcher = lines[0].match(/(\w+)-to-(\w+)/);
    if (!nameMatcher || nameMatcher.length < 3) {
      console.error(`Failed parsing seed map line: ${lines[0]}`);
      process.exit(1);
    }
    const sourceName = nameMatcher[1];
    const destName = nameMatcher[2];

    const rangeStrs = lines.slice(1);
    const ranges: SeedRange[] = rangeStrs.map((rangeStr) => {
      const values = rangeStr.split(" ");
      if (values.length !== 3) {
        console.error(`Failed parsing seed map range: ${rangeStr}`);
        process.exit(1);
      }
      return {
        source: parseInt(values[1], 10),
        dest: parseInt(values[0], 10),
        diff: parseInt(values[2], 10),
      };
    });
    return {
      sourceName,
      destName,
      ranges
    };
  });
}

type SeedMap = {
  sourceName: string,
  destName: string,
  ranges: SeedRange[],
}

type SeedRange = {
  source: number,
  dest: number,
  diff: number
}

main();
