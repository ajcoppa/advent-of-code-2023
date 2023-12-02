#!/usr/bin/env ts-node

import { loadFromFile, sum } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("01-input.txt");
  console.log(`Part 1: ${partOne(lines)}`);
}

function partOne(lines: string[]): number {
  const calibrations = lines.map(line => {
    const digits: number[] = line.split("").filter(charIsNumeric).map(c => parseInt(c, 10));
    return digits[0] * 10 + digits[digits.length - 1];
  });
  return sum(calibrations);
}

function charIsNumeric(c: string) {
  const zero = "0".charCodeAt(0);
  const nine = "9".charCodeAt(0);
  const cCode = c.charCodeAt(0);
  return cCode >= zero && cCode <= nine;
}

main();
