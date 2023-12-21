#!/usr/bin/env ts-node

import { loadFromFile, same, sum } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("09-input.txt");
  const sequences: number[][] = parseSequences(lines);
  console.log(`Part 1: ${partOne(sequences)}`);
  console.log(`Part 2: ${partTwo(sequences)}`);
}

function partOne(sequences: number[][]): number {
  const triangles = sequences.map(triangleSequences);
  return sum(triangles.map(nextTriangleNumber));
}

function partTwo(sequences: number[][]): number {
  const triangles = sequences.map(triangleSequences);
  return sum(triangles.map(prevTriangleNumber));
}

function triangleSequences(sequence: number[]): number[][] {
  const subSequences: number[][] = [sequence];
  let currentSubsequence = sequence;
  while (!same(subSequences[subSequences.length - 1])) {
    const nextSubSequence: number[] = [];
    for (let i = 1; i < currentSubsequence.length; i++) {
      const diff = currentSubsequence[i] - currentSubsequence[i - 1];
      nextSubSequence.push(diff);
    }
    subSequences.push(nextSubSequence);
    currentSubsequence = nextSubSequence;
  }
  return subSequences;
}

function nextTriangleNumber(sequences: number[][]): number {
  for (let seqIndex = sequences.length - 2; seqIndex >= 0; seqIndex--) {
    const sequence = sequences[seqIndex];
    const prevSequence = sequences[seqIndex + 1];
    const prevNumber = prevSequence[prevSequence.length - 1];
    const nextNumber = sequence[sequence.length - 1] + prevNumber;
    sequence.push(nextNumber);
  }
  return sequences[0][sequences[0].length - 1];
}

function prevTriangleNumber(sequences: number[][]): number {
  for (let seqIndex = sequences.length - 2; seqIndex >= 0; seqIndex--) {
    const sequence = sequences[seqIndex];
    const prevSequence = sequences[seqIndex + 1];
    const prevNumber = prevSequence[0];
    const nextNumber = sequence[0] - prevNumber;
    sequence.unshift(nextNumber);
  }
  return sequences[0][0];
}

function parseSequences(lines: string[]): number[][] {
  return lines.map(line => line.split(" ").map(s => parseInt(s, 10)));
}

main();
