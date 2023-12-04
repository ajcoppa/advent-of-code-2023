#!/usr/bin/env ts-node

import { loadFromFile, sum } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("04-input.txt");
  const cards = parseCards(lines);
  console.log(`Part 1: ${partOne(cards)}`);
}

function partOne(cards: Card[]): number {
  return sum(cards.map(scoreCard));
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



type Card = {
  winningNumbers: number[],
  myNumbers: number[],
}

main();