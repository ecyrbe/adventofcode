import { cycle, filter, from, lines, load, map, scan, split, takeWhile } from "@utils/generators";
import { describe, it, expect } from "vitest";
import { mapFlow, pipe } from "@utils/pipe";
import { collect, count, reduce } from "@utils/reducers";

const LETTERS_REGEX = /([A-Z]+)/g;

type Nodes = Record<string, { L: string; R: string }>;

const matchAll = (regex: RegExp) => (input: string) => input.matchAll(regex);

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

function traverseModel(model: Model, name: string) {
  return (
    pipe(
      model.instructions,
      cycle,
      scan((name, instruction) => model.nodes[name][instruction], name),
      takeWhile(name => name! !== "ZZZ"),
      count,
    ) + 1
  );
}

function part1(input: string) {
  const model = parse(input);
  return traverseModel(model, "AAA");
}

describe("2023/day/08/part1", () => {
  it("should work with the example 1 input", () => {
    const input = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(2);
  });

  it("should work with the example 2 input", () => {
    const input = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(6);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(19783);
  });
});
