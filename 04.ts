#!/usr/bin/env ts-node

import { loadFromFile, repeat, sum } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("04-input.txt");
  const cards = parseCards(lines);
  console.log(`Part 1: ${partOne(cards)}`);
  console.log(`Part 2: ${partTwo(cards)}`);
}

function partOne(cards: Card[]): number {
  return sum(cards.map(scoreCard));
}

function partTwo(cards: Card[]): number {
  const scores = cards.map(scoreCardTwo);
  const multipliers = repeat(1, scores.length);
  for (let i = 0; i < scores.length; i++) {
    for (let j = i + 1; j < scores[i] + i + 1; j++) {
      multipliers[j] += multipliers[i];
    }
  }
  return sum(multipliers);
}

function parseCards(lines: string[]): Card[] {
  return lines.map(line => {
    const withoutPrefix = line.split(": ")[1];
    const [winningNumbersStr, myNumbersStr] = withoutPrefix.split(" | ");
    const winningNumbers = strsToNumbers(winningNumbersStr);
    const myNumbers = strsToNumbers(myNumbersStr);
    return {
      winningNumbers,
      myNumbers
    };
  });
}

function strsToNumbers(s: string): number[] {
  return s.split(" ").filter((s) => s !== "").map(n => parseInt(n, 10));
}

function scoreCard(c: Card): number {
  const myWinners = c.myNumbers.filter((n) => c.winningNumbers.includes(n));
  return myWinners.length > 0 ? 2 ** (myWinners.length - 1) : 0;
}

function scoreCardTwo(c: Card): number {
  return c.myNumbers.filter((n) => c.winningNumbers.includes(n)).length;
}

type Card = {
  winningNumbers: number[],
  myNumbers: number[],
}

main();