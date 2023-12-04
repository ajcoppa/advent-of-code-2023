#!/usr/bin/env ts-node

import { charIsNumeric, loadFromFile, product, sum } from "./lib";
import { Coord, getAdjacentCoords, inBounds } from "./lib/Coord";

async function main() {
  const lines: string[] = await loadFromFile("03-input.txt");
  console.log(`Part 1: ${partOne(lines)}`);
  console.log(`Part 2: ${partTwo(lines)}`);
}

function partOne(lines: string[]): number {
  const partNumbersMap = parseGearRatios(lines, coordIsSymbol);
  const partNumbers: number[] = [];
  for (const [_, value] of partNumbersMap) {
    partNumbers.push(...value);
  }
  return sum(partNumbers);
}

function partTwo(lines: string[]): number {
  const gearRatios = parseGearRatios(lines, coordIsStar);
  const combined: number[] = [];
  for (const [_, value] of gearRatios) {
    if (value.length > 1) {
      combined.push(product(value));
    }
  }

  return sum(combined);
}

function parseGearRatios(lines: string[], adjacentFilter: FilterFunc): Map<string, number[]> {
  let coord = { x: 0, y: 0 },
    currentVal = "",
    currentMatchingCoords: Coord[] = [],
    gearMap: Map<string, number[]> = new Map();

  while (true) {
    const value = lines[coord.y][coord.x];
    let nextCurrentVal: string,
        nextMatchingCoords: Coord[] = [];
    if (charIsNumeric(value)) {
      // numeric, so concat to currentVal and check adjacency
      nextCurrentVal = currentVal + value;
      const adjMatchingCoords = filterAdjacentCoords(lines, coord, adjacentFilter);
      nextMatchingCoords = [...currentMatchingCoords, ...adjMatchingCoords];
    } else {
      // non-numeric, so look at currentVal + symbol adjacency to determine whether to include
      if (currentVal.length > 0 && currentMatchingCoords.length > 0) {
        // Use string for coords due to object equality
        const mapKey = `${currentMatchingCoords[0].x},${currentMatchingCoords[0].y}`;
        const existingGears = gearMap.get(mapKey);
        const value = parseInt(currentVal, 10);
        
        if (existingGears) {
          existingGears.push(value);
          gearMap.set(mapKey, existingGears);
        } else {
          gearMap.set(mapKey, [value]);
        }
      }

      // reset currentVal + symbol adjacency
      nextCurrentVal = "";
      nextMatchingCoords = [];
    }

    let nextX = coord.x + 1;
    let nextY = coord.y;
    if (!inBounds(nextX, coord.y, lines[0].length, lines.length)) {
      // move to the next row
      nextX = 0;
      nextY = coord.y + 1;
      if (!inBounds(nextX, nextY, lines[0].length, lines.length)) {
        // finished the whole grid, return our accumulated list of numbers
        return gearMap;
      }
    }

    const nextCoord = { x: nextX, y: nextY };

    coord = nextCoord;
    currentVal = nextCurrentVal;
    currentMatchingCoords = nextMatchingCoords;
  }
}

type FilterFunc = (lines: string[], coord: Coord) => boolean;

function filterAdjacentCoords(lines: string[], coord: Coord, f: FilterFunc): Coord[] {
  const linesAsCharMatrix = lines.map((line) => line.split(""));
  return getAdjacentCoords(linesAsCharMatrix, coord, true).filter(
    (adjCoord) => f(lines, adjCoord)
  );
}

function coordIsSymbol(lines: string[], coord: Coord): boolean {
  const c = lines[coord.y][coord.x];
  return c !== "." && !charIsNumeric(c);
}

function coordIsStar(lines: string[], coord: Coord): boolean {
  return lines[coord.y][coord.x] === "*";
}

main();
