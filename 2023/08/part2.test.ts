import { describe, it, expect } from "vitest";
import { mapFlow, pipe } from "@utils/pipe";
import { from, lines, load, matchAll } from "@utils/generators";
import { cycle, filter, map, scan, takeWhile } from "@utils/operators";
import { collect, count, fold, reduce } from "@utils/reducers";

const LETTERS_REGEX = /([A-Z]+)/g;

type Paths = Record<string, { L: string; R: string }>;
type Directions = keyof Paths[string];

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
      (desertMap, array) => {
        if (desertMap.directions.length === 0) {
          desertMap.directions = pipe(from(array[0]), collect) as Directions[];
          return desertMap;
        }
        const [path, L, R] = array;
        desertMap.paths[path] = { L, R };
        return desertMap;
      },
      { directions: [], paths: {} } as {
        directions: Directions[];
        paths: Paths;
      },
    ),
  );
}

type DesertMap = ReturnType<typeof parse>;

function pathsEndingWithA(paths: Paths) {
  return pipe(
    Object.keys(paths),
    filter(path => path.endsWith("A")),
  );
}

function traverseDesertMap(desertMap: DesertMap, path: string) {
  return (
    pipe(
      desertMap.directions,
      cycle,
      scan((path, direction) => desertMap.paths[path][direction], path),
      takeWhile(path => !path.endsWith("Z")),
      count,
    ) + 1
  );
}

function part2(input: string) {
  const desertMap = parse(input);
  return pipe(
    desertMap.paths,
    pathsEndingWithA,
    map(path => traverseDesertMap(desertMap, path)),
    fold(lcm),
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
