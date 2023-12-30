#!/usr/bin/env ts-node

import { any, loadFromFile, sum, uniquePairs } from "./lib";
import { Coord, Grid, transpose } from "./lib/Coord";

async function main() {
  const lines: string[] = await loadFromFile("11-input.txt");
  const galaxy = parseUniverse(lines);
  console.log(`Part 1: ${partOne(galaxy)}`);
}

function partOne(grid: Grid<Tile>): number {
  grid = expandUniverse(grid);
  const galaxies = parseGalaxyCoords(grid);
  const pairs = uniquePairs(galaxies);
  const distances = pairs.map(([c1, c2]) => linearDistance(c1, c2));
  return sum(distances);
}

function parseUniverse(lines: string[]): Grid<Tile> {
  return lines.map(line => line.split("").map(c => c === "#"));
}

function expandUniverse(grid: Grid<Tile>): Grid<Tile> {
  const ysToInsertRows = grid.map((row, y) =>
    (!any(row) ? [y] : [])
  ).flat();
  const xsToInsertColumns = transpose(grid).map((row, x) =>
    (!any(row) ? [x] : [])
  ).flat();

  // Go from end to beginning to avoid needing to adjust indexes while mutating
  for (let yi = ysToInsertRows.length - 1; yi >= 0; yi--) {
    const y = ysToInsertRows[yi];
    grid = insertRow(grid, y);
  }
  for (let xi = xsToInsertColumns.length - 1; xi >= 0; xi--) {
    const x = xsToInsertColumns[xi];
    grid = transpose(insertRow(transpose(grid), x));
  }
  return grid;
}

function insertRow(grid: Grid<Tile>, y: number): Grid<Tile> {
  // row at y is already empty, so just copy it
  const emptyRow = [...grid[y]];
  return [...grid.slice(0, y), emptyRow, ...grid.slice(y)]
}

function printGrid(grid: Grid<Tile>): void {
  const s = grid.map(r => r.map(v => v ? "#" : ".").join("")).join("\n");
  console.log(s);
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

type Tile = boolean;

main();
