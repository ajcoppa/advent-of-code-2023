#!/usr/bin/env ts-node

import { any, loadFromFile, sum, uniquePairs } from "./lib";
import { Coord, Grid, transpose } from "./lib/Coord";

async function main() {
  const lines: string[] = await loadFromFile("11-input.txt");
  const galaxy = parseUniverse(lines);
  console.log(`Part 1: ${partOne(galaxy)}`);
  console.log(`Part 2: ${partTwo(galaxy)}`);
}

function partOne(grid: Grid<Tile>): number {
  const galaxies = parseGalaxyCoords(grid);
  const pairs = uniquePairs(galaxies);
  const distances = pairs.map(([c1, c2]) => 
    expandedDistance(c1, c2, rowsToExpand(grid), columnsToExpand(grid), 2)
  );
  return sum(distances);
}

function partTwo(grid: Grid<Tile>): number {
  const galaxies = parseGalaxyCoords(grid);
  const pairs = uniquePairs(galaxies);
  const distances = pairs.map(([c1, c2]) =>
    expandedDistance(c1, c2, rowsToExpand(grid), columnsToExpand(grid))
  );
  return sum(distances);
}

function parseUniverse(lines: string[]): Grid<Tile> {
  return lines.map(line => line.split("").map(c => c === "#"));
}

function rowsToExpand(grid: Grid<Tile>): number[] {
  return grid.map((row, y) => (!any(row) ? [y] : [])).flat();
}

function columnsToExpand(grid: Grid<Tile>): number[] {
  return transpose(grid)
    .map((row, x) => (!any(row) ? [x] : []))
    .flat();
}

function parseGalaxyCoords(grid: Grid<Tile>): Coord[] {
  return grid.map((r, y) =>
    r.map((v, x) =>
      v ? [{x: x, y: y}] : []
    ).flat()
  ).flat();
}

function linearDistance(c1: Coord, c2: Coord): number {
  return Math.abs(c2.y - c1.y) + Math.abs(c2.x - c1.x); 
}

function expandedDistance(
  c1: Coord,
  c2: Coord,
  rowsToExpand: number[],
  columnsToExpand: number[],
  expansionFactor: number = 1_000_000
): number {
  const expandedRowsInScope = rowsToExpand.filter(r =>
    (r >= c1.y && r <= c2.y) ||
    (r >= c2.y && r <= c1.y)
  ).length;
  const expandedColumnsInScope = columnsToExpand.filter(col =>
    (col >= c1.x && col <= c2.x) ||
    (col >= c2.x && col <= c1.x)
  ).length;
  return linearDistance(c1, c2) +
    (expandedRowsInScope * (expansionFactor - 1)) +
    (expandedColumnsInScope * (expansionFactor - 1));
}

type Tile = boolean;

main();
