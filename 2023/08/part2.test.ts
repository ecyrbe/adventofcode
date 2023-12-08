import { cycle, filter, from, lines, load, map, scan, split, takeWhile } from "@utils/generators";
import { describe, it, expect } from "vitest";
import { mapFlow, pipe } from "@utils/pipe";
import { collect, count, every, reduce } from "@utils/reducers";

const LETTERS_REGEX = /([A-Z]+)/g;

type Nodes = Record<string, { L: string; R: string }>;

const matchAll = (regex: RegExp) => (input: string) => input.matchAll(regex);

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

function gcd(a: number, b: number) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

function parse(input: string) {
  return pipe(
    input,
    lines,
    mapFlow(
      matchAll(LETTERS_REGEX),
      map(m => m[0]),
      collect,
    ),
    filter(items => items.length > 0),
    reduce(
      (model, array) => {
        if (model.instructions.length === 0) {
          model.instructions = pipe(from(array[0]), collect) as ("L" | "R")[];
          return model;
        }
        const [name, L, R] = array;
        model.nodes[name] = { L, R };
        return model;
      },
      { instructions: [], nodes: {} } as {
        instructions: ("L" | "R")[];
        nodes: Nodes;
      },
    ),
  );
}

type Model = ReturnType<typeof parse>;

function getNodesEndingWithA(nodes: Nodes) {
  return pipe(
    Object.keys(nodes),
    filter(name => name.endsWith("A")),
  );
}

function traverseModel(model: Model, name: string) {
  return (
    pipe(
      model.instructions,
      cycle,
      scan((name, instruction) => model.nodes[name][instruction], name),
      takeWhile(name => !name.endsWith("Z")),
      count,
    ) + 1
  );
}

function part2(input: string) {
  const model = parse(input);
  return pipe(
    model.nodes,
    getNodesEndingWithA,
    map(name => traverseModel(model, name)),
    reduce(lcm, 1),
  );
}

describe("2023/day/08/part2", () => {
  it("should work with the example 1 input", () => {
    const input = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;
    const result = part2(input);
    console.log(result);
    expect(result).toEqual(2);
  });

  it("should work with the example 2 input", () => {
    const input = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;
    const result = part2(input);
    console.log(result);
    expect(result).toEqual(6);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part2(input);
    console.log(result);
    expect(result).toEqual(9177460370549);
  });
});