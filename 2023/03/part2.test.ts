import { describe, it, expect } from "vitest";
import { concat, drop, flatMap, lines, load, map, scan, tap } from "@utils/generators";
import { pipe } from "@utils/pipe";
import { sum, collect } from "@utils/reducers";

const NUMBER_REGEX = /(\d+)/g;

type Iterator = { up: string; current: string; down: string };
type MatchPredicate = (index: number, start: number, end: number) => boolean;

function iterate(iter: Iterator, item: string) {
  const up = iter.current;
  const current = iter.down;
  const down = item;
  return { up, current, down };
}

function isAdjacentLeftRight(index: number, start: number, end: number) {
  return index + 1 === start || index === end;
}

function isAdjacentUpDown(index: number, start: number, end: number) {
  return index >= start - 1 && index <= end;
}

function* matchRatio(str: string, index: number, predicate: MatchPredicate) {
  const match = str.matchAll(NUMBER_REGEX);
  for (const m of match) {
    const start = m.index!;
    const end = m.index! + m[0].length;
    if (predicate(index, start, end)) {
      yield +m[0];
    }
  }
}

function* findGearRatio(iter: Iterator, potentialGearIndex: number) {
  const potentialGears = pipe(
    concat(
      matchRatio(iter.current, potentialGearIndex, isAdjacentLeftRight),
      matchRatio(iter.up, potentialGearIndex, isAdjacentUpDown),
      matchRatio(iter.down, potentialGearIndex, isAdjacentUpDown),
    ),
    collect,
  );
  if (potentialGears.length === 2) {
    yield potentialGears.reduce((product, item) => product * item, 1);
  }
}

function* findGearRatios(iter: Iterator) {
  let potentialGearIndex = iter.current.indexOf("*");
  while (potentialGearIndex !== -1) {
    yield* findGearRatio(iter, potentialGearIndex);
    potentialGearIndex = iter.current.indexOf("*", potentialGearIndex + 1);
  }
}

function part2(input: string) {
  return pipe(
    input + `\n`,
    lines,
    scan(iterate, { up: "", current: "", down: "" }),
    drop(1),
    flatMap(findGearRatios),
    sum,
  );
}

describe("2023/day/03/part2", () => {
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
    expect(part2(input)).toEqual(467835);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    console.log(part2(input));
    expect(part2(input)).toEqual(83279367);
  });
});
