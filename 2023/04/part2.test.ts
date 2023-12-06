import { drop, lines, load, map, prependOne, split, take } from "@utils/generators";
import { mapFlow, pipe } from "@utils/pipe";
import { collect, collectSet, fold, reduce, reverse, sum } from "@utils/reducers";
import { describe, it, expect } from "vitest";

const CARD_REGEX = /[:|]/g;
const NUMBER_REGEX = /(\d+)/g;

const matchAll = (regex: RegExp) => (input: string) => input.matchAll(regex);

function intersect<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter(item => b.has(item)));
}

function part2(input: string) {
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
    map(set => set?.size ?? 0),
    reverse,
    reduce((acc, wins) => [pipe(acc, take(wins), sum) + 1, ...acc], [] as number[]),
    sum,
  );
}

describe("2023/day/04/part2", () => {
  it("should work with the example input", () => {
    const input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
    console.log(part2(input));
    expect(part2(input)).toEqual(30);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part2(input);
    console.log(result);
    expect(result).toEqual(5095824);
  });
});
