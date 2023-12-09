import { describe, it, expect } from "vitest";
import { load } from "@utils/loader";
import { pipe } from "@utils/pipe";
import { lines } from "@utils/generators";
import { appendOne, flatMap, map, prependOne, window } from "@utils/operators";
import { sum } from "@utils/reducers";

const NUMBER_REGEX = /(\d+)/g;
const NOPARTS_REGEX = /^\.+$/;

type Iterator = { prev: string; current: string; next: string };

function extractAdjacent(str: string, start: number, end: number) {
  return str.slice(Math.max(start - 1, 0), Math.min(end + 1, str.length)) || ".";
}

function hasAdjacentPart(prevChar: string, nextChar: string, prevMatch: string, nextMatch: string) {
  return prevChar !== "." || nextChar !== "." || !NOPARTS_REGEX.test(prevMatch) || !NOPARTS_REGEX.test(nextMatch);
}

function* findEngineParts(iter: Iterator) {
  const match = iter.current.matchAll(NUMBER_REGEX);
  for (const m of match) {
    const start = m.index!;
    const end = m.index! + m[0].length;
    const prevMatch = extractAdjacent(iter.prev, start, end);
    const nextMatch = extractAdjacent(iter.next, start, end);
    const prevChar = iter.current[start - 1] || ".";
    const nextChar = iter.current[end] || ".";
    if (hasAdjacentPart(prevChar, nextChar, prevMatch, nextMatch)) {
      yield +m[0];
    }
  }
}

function part1(input: string) {
  return pipe(
    input,
    lines,
    prependOne(""),
    appendOne(""),
    window(3),
    map(([prev, current, next]): Iterator => ({ prev, current, next })),
    flatMap(findEngineParts),
    sum,
  );
}

describe("2023/day/03/part1", () => {
  it("should work with the example input", () => {
    const input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
    expect(part1(input)).toEqual(4361);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    console.log(part1(input));
    expect(part1(input)).toEqual(531561);
  });
});
