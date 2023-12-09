#!/usr/bin/env ts-node

import { loadFromFile, product, zip } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("06-input.txt");
  const races = parseLines(lines);
  console.log(`Part 1: ${partOne(races)}`);
}

function partOne(races: Race[]): number {
  return product(races.map(winningCount));
}

function winningCount(r: Race): number {
  const isWinner = (t: number) => {
    const speed = r.time - t;
    const distanceTraveled = speed * (r.time - speed);
    return distanceTraveled > r.distance;
  };

  // find middle, which will be the max distance possible
  const middleTime = Math.ceil((r.time - 1) / 2);

  let winCount = 0;
  // work outwards, counting 2 at a time until it's less than winning.
  // this works because distance traveled will be the same on the
  // negative and positive side of the middle number
  for (let i = middleTime; i >= 0 && isWinner(i); i--) {
    winCount += 2;
  }

  // even races have a single max in the middle, so the first win should be
  // counted as 1 instead of 2
  winCount -= r.time % 2 === 0 ? 1 : 0;
  return winCount;
}

function parseLines(lines: string[]): Race[] {
  const [times, distances] = lines.map(parseRaceLine);
  return zip(times, distances).map(raceArray => ({
    time: raceArray[0],
    distance: raceArray[1]
  }));
}

function parseRaceLine(line: string): number[] {
  return line
    .split(" ")
    .slice(1) // chop off label
    .filter(c => c !== "")
    .map(s => parseInt(s, 10));
}

type Race = {
  time: number,
  distance: number
}

main();
