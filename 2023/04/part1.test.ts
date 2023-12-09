import { describe, it, expect } from "vitest";
import { mapFlow, pipe } from "@utils/pipe";
import { lines, load, matchAll, split } from "@utils/generators";
import { drop, filter, map } from "@utils/operators";
import { collectSet, fold, sum } from "@utils/reducers";

const CARD_REGEX = /[:|]/g;
const NUMBER_REGEX = /(\d+)/g;

function intersect<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter(item => b.has(item)));
}

function part1(input: string) {
  return pipe(
    lines(input),
    mapFlow(
      split(CARD_REGEX),
      drop(1),
      mapFlow(
        matchAll(NUMBER_REGEX),
        map(match => +match[0]),
        collectSet,
      ),
      fold(intersect),
    ),
    filter((set): set is Set<number> => !!set && set.size > 0),
    map(set => 2 ** (set.size - 1)),
    sum,
  );
}

describe("2023/day/04/part1", () => {
  it("should work with the example input", () => {
    const input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 |  9 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
    expect(part1(input)).toEqual(13);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(22897);
  });
});
