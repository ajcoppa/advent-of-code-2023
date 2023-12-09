import fs from "fs/promises";

export async function loadFromFile(
  path: string,
  filterEmpty: boolean = true
): Promise<string[]> {
  const text = await fs.readFile(path, { encoding: "utf-8" });
  const lines = text.split("\n");
  return filterEmpty ? lines.filter((l) => l.length > 0) : lines;
}

export function identity<A>(x: A) {
  return x;
}

export function any(xs: boolean[]): boolean {
  return xs.reduce((a, b) => a || b, false);
}

export function all(xs: boolean[]): boolean {
  return xs.reduce((a, b) => a && b, true);
}

export function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

export function product(xs: number[]): number {
  return xs.reduce((a, b) => a * b);
}

export function repeat<A>(x: A, n: number): A[] {
  const xs: A[] = [];
  for (let i = 0; i < n; i++) {
    xs.push(x);
  }
  return xs;
}

export function charIsNumeric(c: string) {
  const zero = "0".charCodeAt(0);
  const nine = "9".charCodeAt(0);
  const cCode = c.charCodeAt(0);
  return cCode >= zero && cCode <= nine;
}

export function chunk<A>(list: A[], chunkSize: number): A[][] {
  let chunks: A[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

export function zip<A>(one: A[], two: A[]): A[][] {
  return one.map(function (elem, i) {
    return [elem, two[i]];
  });
}
