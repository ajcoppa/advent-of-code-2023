#!/usr/bin/env ts-node

import { charIsNumeric, loadFromFile, sum } from "./lib";
import { Coord, getAdjacentCoords, inBounds } from "./lib/Coord";

async function main() {
  const lines: string[] = await loadFromFile("03-input.txt");
  console.log(`Part 1: ${partOne(lines)}`);
}

function partOne(lines: string[]): number {
  return sum(parseGrid(lines));
}

function parseGrid(lines: string[]): number[] {
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

function coordIsSymbolAdjacent(lines: string[], coord: Coord): boolean {
  const linesAsCharMatrix = lines.map(line => line.split(""));
  return getAdjacentCoords(linesAsCharMatrix, coord, true).filter((adjCoord) => {
    const c = lines[adjCoord.y][adjCoord.x];
    return c !== "." && !charIsNumeric(c)
  }).length > 0;
}

main();
