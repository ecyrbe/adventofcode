import { load } from "@utils/loader";
import { describe, it, expect } from "vitest";
import { lines, split, zip } from "@utils/generators";
import { map, transpose, take, drop } from "@utils/operators";
import { mapFlow, pipe } from "@utils/pipe";
import { collect, every, join, reverse, sum } from "@utils/reducers";

function reflectionRow(block: string[][]): number {
  for (let idx = 1; idx < block.length; idx++) {
    const left = pipe(block, take(idx), reverse);
    const right = pipe(block, drop(idx));
    const totalDistance = pipe(
      zip(left, right),
      map(([l, r]) => distance(l, r)),
      sum,
    );
    if (totalDistance === 1) {
      return idx;
    }
  }
  return 0;
}

function score(block: string[][]): number {
  const scoreRow = reflectionRow(block);
  const scoreCol = reflectionRow(pipe(block, transpose<string>, collect));
  return 100 * scoreRow + scoreCol;
}

function distance(left: string[], right: string[]): number {
  return pipe(
    zip(left, right),
    map(([l, r]) => (l === r ? 0 : 1)),
    sum,
  );
}

function parse(input: string): string[][][] {
  return pipe(input, split(/\n\n/g), mapFlow(lines, mapFlow(collect), collect), collect);
}

function part2(input: string) {
  const blocks = parse(input);
  return pipe(blocks, map(score), sum);
}

describe("2023/12/part2", () => {
  it("should work with the sample input", () => {
    const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;
    const result = part2(input);
    expect(result).toEqual(400);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part2(input);
    expect(result).toEqual(30449);
  });
});
