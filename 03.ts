#!/usr/bin/env ts-node

import { Direction, charIsNumeric, loadFromFile, product, sum } from "./lib";
import { Coord, getAdjacentCoords, inBounds } from "./lib/Coord";

async function main() {
  const lines: string[] = await loadFromFile("03-input.txt");
  console.log(`Part 1: ${partOne(lines)}`);
  console.log(`Part 2: ${partTwo(lines)}`);
}

function partOne(lines: string[]): number {
  return sum(parsePartNumbers(lines));
}

function partTwo(lines: string[]): number {
  const gearRatios = parseGearRatios(lines);
  const combined: number[] = [];
  for (const [_, value] of gearRatios) {
    if (value.length > 1) {
      combined.push(product(value));
    }
  }

  return sum(combined);
}

function parsePartNumbers(lines: string[]): number[] {
  let coord = {x: 0, y: 0},
      currentVal = "",
      currentSymbolAdjacent = false,
      accum: number[] = [];
  
  while (true) {
    const value = lines[coord.y][coord.x];
    let nextCurrentVal: string, nextSymbolAdjacent: boolean;
    if (charIsNumeric(value)) {
      // numeric, so concat to currentVal and check adjacency
      nextCurrentVal = currentVal + value;
      nextSymbolAdjacent =
        currentSymbolAdjacent || coordIsSymbolAdjacent(lines, coord);
    } else {
      // non-numeric, so look at currentVal + symbol adjacency to determine whether to include
      if (currentVal.length > 0 && currentSymbolAdjacent) {
        accum.push(parseInt(currentVal, 10));
      }

      // reset currentVal + symbol adjacency
      nextCurrentVal = "";
      nextSymbolAdjacent = false;
    }

    let nextX = coord.x + 1;
    let nextY = coord.y;
    if (!inBounds(nextX, coord.y, lines[0].length, lines.length)) {
      // move to the next row
      nextX = 0;
      nextY = coord.y + 1;
      if (!inBounds(nextX, nextY, lines[0].length, lines.length)) {
        // finished the whole grid, return our accumulated list of numbers
        return accum;
      }
    }

    const nextCoord = { x: nextX, y: nextY };

    coord = nextCoord;
    currentVal = nextCurrentVal;
    currentSymbolAdjacent = nextSymbolAdjacent;
  }
}

function parseGearRatios(lines: string[]): Map<string, number[]> {
  let coord = { x: 0, y: 0 },
    currentVal = "",
    currentStarAdjacent = false,
    currentWhichStar: Coord | null = null,
    gearMap: Map<string, number[]> = new Map();

  while (true) {
    const value = lines[coord.y][coord.x];
    let nextCurrentVal: string,
        nextStarAdjacent: boolean,
        nextWhichStar: Coord | null;
    if (charIsNumeric(value)) {
      // numeric, so concat to currentVal and check adjacency
      nextCurrentVal = currentVal + value;
      nextWhichStar = currentWhichStar || coordOfAdjacentStar(lines, coord);
      nextStarAdjacent = nextWhichStar !== null;
    } else {
      // non-numeric, so look at currentVal + symbol adjacency to determine whether to include
      if (currentVal.length > 0 && currentStarAdjacent && currentWhichStar !== null) {
        const mapKey = `${currentWhichStar.x},${currentWhichStar.y}`;
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
      nextStarAdjacent = false;
      nextWhichStar = null;
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
    currentStarAdjacent = nextStarAdjacent;
    currentWhichStar = nextWhichStar;
  }
}

function coordIsSymbolAdjacent(lines: string[], coord: Coord): boolean {
  const linesAsCharMatrix = lines.map(line => line.split(""));
  return getAdjacentCoords(linesAsCharMatrix, coord, true).filter((adjCoord) => {
    const c = lines[adjCoord.y][adjCoord.x];
    return c !== "." && !charIsNumeric(c)
  }).length > 0;
}

function coordOfAdjacentStar(lines: string[], coord: Coord): Coord | null {
  const linesAsCharMatrix = lines.map((line) => line.split(""));
  const adjacentStars = getAdjacentCoords(linesAsCharMatrix, coord, true).filter((adjCoord) => {
    const c = lines[adjCoord.y][adjCoord.x];
    return c === "*";
  });
  return adjacentStars.length > 0 ? adjacentStars[0] : null;
}

main();
