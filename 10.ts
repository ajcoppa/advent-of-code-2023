#!/usr/bin/env ts-node

import { identity, loadFromFile } from "./lib";
import { Coord, Grid, inBounds } from "./lib/Coord";

async function main() {
  const lines: string[] = await loadFromFile("10-input.txt");
  const grid = parseGrid(lines);
  const start = parseStart(lines);
  grid[start.y][start.x].allowed = determineStartAllowedDirections(grid, start);
  console.log(`Part 1: ${partOne(grid, start)}`);
}

function partOne(grid: Grid<Tile<number>>, start: Coord): number {
  mapGrid(grid, start);
  const gridValues = grid.flat().map(tile => tile.object).filter(n => n !== Number.MAX_SAFE_INTEGER);
  return Math.max(...gridValues);
}

function mapGrid(grid: Grid<Tile<number>>, start: Coord, distance: number = 0): Grid<Tile<number>> {
  let nextCoords = [start];
  while (nextCoords.length > 0) {
    const currentCoords = [...nextCoords];
    currentCoords.forEach(coord => {
      const value = grid[coord.y][coord.x].object;
      grid[coord.y][coord.x].object = Math.min(value, distance);
    });
    nextCoords = currentCoords.map(c => getNextCoordsToMark(grid, c)).flat();
    distance++;
  }
  return grid;
}

function getNextCoordsToMark(grid: Grid<Tile<number>>, coord: Coord): Coord[] {
  const point = grid[coord.y][coord.x];
  const allowedDirs = [...point.allowed];
  const modifiers = allowedDirs.map(directionPositionModifiers);
  const filteredNextCoords = modifiers.map((modifier) => ({
    x: modifier.x(coord.x), y: modifier.y(coord.y)
  })).filter(c => 
    inBounds(c.x, c.y, grid[0].length, grid.length) &&
    grid[c.y][c.x].object > grid[coord.y][coord.x].object
  );

  return filteredNextCoords;
}

function printGrid(grid: Grid<Tile<number>>): void {
  const s = grid.map(r => r.map(t => t.object === Number.MAX_SAFE_INTEGER ? "." : t.object).join("")).join("\n");
  console.log(s);
}

function directionPositionModifiers(direction: Direction): Modifiers {
  switch (direction) {
    case Direction.Up:
      return { x: identity, y: (n) => n - 1 };
    case Direction.Right:
      return { x: (n) => n + 1, y: identity };
    case Direction.Down:
      return { x: identity, y: (n) => n + 1 };
    case Direction.Left:
      return { x: (n) => n - 1, y: identity };
  }
}

function parseGrid(lines: string[]): Grid<Tile<number>> {
  return lines.map(line => {
    const chars = line.split("");
    return chars.map(c => ({
      allowed: parseDirections(c),
      object: Number.MAX_SAFE_INTEGER
    }));
  });
}

function parseDirections(c: string): AllowedDirections {
  if (c === "|") {
    return new Set([Direction.Up, Direction.Down]);
  } else if (c === "-") {
    return new Set([Direction.Left, Direction.Right]);
  } else if (c === "L") {
    return new Set([Direction.Up, Direction.Right]);
  } else if (c === "J") {
    return new Set([Direction.Up, Direction.Left]);
  } else if (c === "7") {
    return new Set([Direction.Left, Direction.Down]);
  } else if (c === "F") {
    return new Set([Direction.Right, Direction.Down]);
  } else if (c === "S") {
    // We'll filter down further later, after parsing the full grid
    return new Set([Direction.Up, Direction.Right, Direction.Down, Direction.Left]);
  } else {
    return new Set();
  }
}

function parseStart(lines: string[]): Coord {
  for (let r = 0; r < lines.length; r++) {
    const row = lines[r];
    for (let c = 0; c < row.length; c++) {
      if (row.charAt(c) === "S") {
        return { x: c, y: r };
      }
    }
  }
  console.error("Couldn't find starting coord");
  process.exit(1);
}

function determineStartAllowedDirections(
  grid: Grid<Tile<number>>,
  start: Coord
): AllowedDirections {
  const allowedDirs = [Direction.Up, Direction.Right, Direction.Down, Direction.Left];
  const modifiers = allowedDirs.map(dir => ({
    direction: dir, // keep track of the direction this modifier belongs to
    modifier: directionPositionModifiers(dir)
  }));
  const filteredNextCoords = modifiers.map((modifier) => ({
    x: modifier.modifier.x(start.x),
    y: modifier.modifier.y(start.y),
    // flip it to check whether the adjacent coord can come back to the original
    directionToCheck: flip(modifier.direction)
  })).filter((coord) => 
    inBounds(coord.x, coord.y, grid[0].length, grid.length) &&
    grid[coord.y][coord.x].allowed.has(coord.directionToCheck)
  ).map(thing => flip(thing.directionToCheck)); // use the original direction again

  return new Set(filteredNextCoords);
}

function flip(d: Direction): Direction {
  switch (d) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Right:
      return Direction.Left;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
  }
}

interface Modifiers {
  x: (n: number) => number;
  y: (n: number) => number;
}

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

type AllowedDirections = Set<Direction>;

type Tile<A> = {
  allowed: AllowedDirections,
  object: A
}

main();
