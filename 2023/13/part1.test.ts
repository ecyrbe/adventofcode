import { load } from "@utils/loader";
import { describe, it, expect } from "vitest";
import { lines, split, zip } from "@utils/generators";
import { map, transpose, take, drop } from "@utils/operators";
import { mapFlow, pipe } from "@utils/pipe";
import { collect, every, join, reverse, sum } from "@utils/reducers";

function reflectionRow(block: string[][]): number {
  for (let idx = 1; idx < block.length; idx++) {
    const left = pipe(block, take(idx), mapFlow(join("")), reverse);
    const right = pipe(block, drop(idx), mapFlow(join("")));
    const isMirror = pipe(
      zip(left, right),
      every(([l, r]) => l === r),
    );
    if (isMirror) {
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

function parse(input: string): string[][][] {
  return pipe(input, split(/\n\n/g), mapFlow(lines, mapFlow(collect), collect), collect);
}

function part1(input: string) {
  const blocks = parse(input);
  return pipe(blocks, map(score), sum);
}

describe("2023/12/part1", () => {
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
    const result = part1(input);
    expect(result).toEqual(405);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    expect(result).toEqual(37113);
  });
});
