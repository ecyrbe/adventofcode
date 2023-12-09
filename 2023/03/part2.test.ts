import { describe, it, expect } from "vitest";
import { load } from "@utils/loader";
import { pipe } from "@utils/pipe";
import { concat, lines, matchAll } from "@utils/generators";
import { appendOne, filter, flatMap, map, prependOne, window } from "@utils/operators";
import { sum, collect, product } from "@utils/reducers";

const NUMBER_REGEX = /(\d+)/g;

type Iterator = { up: string; current: string; down: string };
type MatchPredicate = (index: number, start: number, end: number) => boolean;

function isAdjacentLeftRight(index: number, start: number, end: number) {
  return index + 1 === start || index === end;
}

function isAdjacentUpDown(index: number, start: number, end: number) {
  return index >= start - 1 && index <= end;
}

function matchRatio(str: string, index: number, predicate: MatchPredicate) {
  return pipe(
    str,
    matchAll(NUMBER_REGEX),
    filter(m => predicate(index, m.index!, m.index! + m[0].length)),
    map(m => +m[0]),
  );
}

function findGearRatio(iter: Iterator, potentialGearIndex: number) {
  return pipe(
    concat(
      matchRatio(iter.current, potentialGearIndex, isAdjacentLeftRight),
      matchRatio(iter.up, potentialGearIndex, isAdjacentUpDown),
      matchRatio(iter.down, potentialGearIndex, isAdjacentUpDown),
    ),
    collect,
  );
}

function* findGearRatios(iter: Iterator) {
  let potentialGearIndex = iter.current.indexOf("*");
  while (potentialGearIndex !== -1) {
    yield findGearRatio(iter, potentialGearIndex);
    potentialGearIndex = iter.current.indexOf("*", potentialGearIndex + 1);
  }
}

function part2(input: string) {
  return pipe(
    input,
    lines,
    prependOne(""),
    appendOne(""),
    window(3),
    map(([up, current, down]): Iterator => ({ up, current, down })),
    flatMap(iter =>
      pipe(
        findGearRatios(iter),
        filter(ratios => ratios.length === 2),
        map(product),
      ),
    ),
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
