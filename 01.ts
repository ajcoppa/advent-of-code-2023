#!/usr/bin/env ts-node

import { charIsNumeric, loadFromFile, sum } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("01-input.txt");
  console.log(`Part 1: ${partOne(lines)}`);
  console.log(`Part 2: ${partTwo(lines)}`);
}

function partOne(lines: string[]): number {
  const calibrations = lines.map(line => {
    const digits: number[] = line.split("").filter(charIsNumeric).map(c => parseInt(c, 10));
    return digits[0] * 10 + digits[digits.length - 1];
  });
  return sum(calibrations);
}

function partTwo(lines: string[]): number {
  const calibrations = lines.map(line => (
    findDigit(line, true) * 10 + findDigit(line, false)
  ));
  return sum(calibrations);
}

function findDigit(line: string, fromStart: boolean = true) {
  const digitStrings = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  let i = fromStart ? 0 : line.length - 1;
  let tick = (n: number) => fromStart ? n + 1 : n - 1;
  let reachedEnd = (line: string, i: number) => fromStart ? i >= line.length : i < 0;
  let accum = "";
  
  let nextChar: string;
  while (!reachedEnd(line, i)) {
    nextChar = line.charAt(i);
    if (charIsNumeric(nextChar)) {
      return parseInt(nextChar, 10);
    }

    // not numeric, try adding to the word accumulator and see if the word matches a digit word instead
    accum = fromStart ? accum.concat(nextChar) : nextChar.concat(accum);

    const matchingDigitWords = digitStrings.filter((digitStr) => accum.includes(digitStr));
    if (matchingDigitWords.length > 0) {
      const matchingWord = matchingDigitWords[0];
      const digit = digitStrings.findIndex(w => w === matchingWord) + 1;
      return digit;
    }
    i = tick(i);
  }
  console.error("Failed to find digit string.");
  process.exit(1);
}

main();
