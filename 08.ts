#!/usr/bin/env ts-node

import { all, loadFromFile, lcmAll } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("08-input.txt");
  const instructions = parseInstructions(lines[0]);
  console.log(instructions.length);
  const nodes = parseNodes(lines.slice(1));
  console.log(`Part 1: ${partOne(instructions, nodes)}`);
  console.log(`Part 2: ${partTwo(instructions, nodes)}`);
}

function partOne(instructions: Instruction[], nodes: Map<string, Node<string>>): number {
  let current = "AAA", instructionIndex = 0, pathLength = 0;
  while (current != "ZZZ") {
    const instruction = instructions[instructionIndex];
    const value = instruction === Instruction.Left ? nodes.get(current)?.left : nodes.get(current)?.right;
    if (!value) {
      console.error(`Couldn't parse value for ${instruction} and ${nodes.get(current)}`);
      process.exit(1);
    }
    current = value;
    pathLength++;
    instructionIndex++;
    if (instructionIndex >= instructions.length) instructionIndex = 0;
  }
  return pathLength;
}

function partTwo(instructions: Instruction[], nodes: Map<string, Node<string>>): number {
  let paths: string[] = [];
  for (const [k, v] of nodes) {
    if (k.endsWith("A")) {
      paths.push(k);
    }
  }

  // map the counts required to get each path to end in Z
  const counts = paths.map(path => {
    let instructionIndex = 0, current = path, count = 0;
    while (!current.endsWith("Z")) {
      const instruction = instructions[instructionIndex];
      const next = instruction === Instruction.Left
        ? nodes.get(current)?.left
        : nodes.get(current)?.right;
      if (!next) {
        console.error(`Couldn't parse value for ${instruction} and ${nodes.get(path)}`);
        process.exit(1);
      }

      current = next;
      count++;
      instructionIndex++;
      if (instructionIndex >= instructions.length) instructionIndex = 0;
    }
    return count;
  });

  // least-common multiple all of them to figure out where the various loops align
  // this wouldn't work in the general case, but works for the input provided.
  return lcmAll(counts);
}

function parseInstructions(line: string): Instruction[] {
  return line.split("").map(c => {
    if (c === "L") return Instruction.Left;
    if (c === "R") return Instruction.Right;
    console.error(`Couldn't parse instruction ${c}`);
    process.exit(1);
  });
}

function parseNodes(lines: string[]): Map<string, Node<string>> {
  const nodesMap: Map<string, Node<string>> = new Map();
  lines.forEach(line => {
    const [value, pairStr] = line.split(" = ");
    const withoutParens = pairStr.slice(1, pairStr.length - 1);
    const [left, right] = withoutParens.split(", ");
    nodesMap.set(value, {value, left, right});
  });
  return nodesMap;
}

enum Instruction {
  Left,
  Right
}

type Node<A> = {
  value: A,
  left: A,
  right: A
};

main();
