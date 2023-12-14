#!/usr/bin/env ts-node

import { loadFromFile } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("08-input.txt");
  const instructions = parseInstructions(lines[0]);
  const nodes = parseNodes(lines.slice(1));
  console.log(`Part 1: ${partOne(instructions, nodes)}`);
}

function partOne(instructions: Instruction[], nodes: Map<string, Node<string>>): number {
  console.log(instructions);
  console.log(nodes);
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
