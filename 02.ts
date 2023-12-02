#!/usr/bin/env ts-node

import { loadFromFile, sum } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("02-input.txt");
  console.log(`Part 1: ${partOne(lines)}`);
}

function partOne(lines: string[]) {
  const games = lines.map(lineToGame);
  const setup = parseRound("12 red, 13 green, 14 blue");
  const possibleGames = games.filter(game => gameIsPossible(setup, game));
  return sum(possibleGames.map(game => game.id));
}

function lineToGame(line: string): Game {
  return {
    id: parseId(line),
    rounds: removeGamePrefix(line).split("; ").map(str => parseRound(str)),
  }; 
}

function parseId(line: string): number {
  const matcher = line.match(/Game (\d+):*/);
  if (matcher === null || matcher.length < 2) {
    console.error(`Parsing id for ${line} failed`);
    process.exit(1);
  }
  return parseInt(matcher[1], 10);
}

function gameIsPossible(setup: Round, game: Game): boolean {
  return game.rounds.every(round => roundIsPossible(setup, round));
}

function roundIsPossible(setup: Round, round: Round): boolean {
  return [Color.Red, Color.Green, Color.Blue].every(c => (setup.get(c) || 0) >= (round.get(c) || 0));
}

function removeGamePrefix(line: string): string {
  const colonPosition = line.indexOf(":");
  return line.substring(colonPosition + 2);
}

function parseRound(roundStr: string): Round {
  const cubes = roundStr.split(", ");
  const round = newRound();
  cubes.forEach(cube => {
    const matcher = cube.match(/(\d+) (\w+)/);
    if (matcher === null || matcher.length < 2) {
      console.error(`Parsing cube ${cube} failed`);
      process.exit(1);
    }

    const n = parseInt(matcher[1], 10);
    const color = parseColor(matcher[2]);
    round.set(color, n);
  });
  return round;
}

enum Color { Red, Green, Blue };

function parseColor(s: string): Color {
  if (s === "red") {
    return Color.Red;
  } else if (s === "green") {
    return Color.Green;
  } else if (s === "blue") {
    return Color.Blue;
  }

  console.error(`Parsing color ${s} failed`);
  process.exit(1);
}

type Round = Map<Color, number>;

function newRound(): Round {
  return new Map([
    [Color.Red, 0],
    [Color.Green, 0],
    [Color.Blue, 0],
  ]);
}

type Game = {
  id: number,
  rounds: Round[],
};

main();
