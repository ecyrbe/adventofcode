import { describe, it, expect } from "vitest";
import { pipe, mapFlow } from "@utils/pipe";
import { lines, load, matchAll } from "@utils/generators";
import { map, zipAll } from "@utils/operators";
import { product } from "@utils/reducers";

const NUMBER_REGEX = /(\d+)/g;

function parse(input: string) {
  return pipe(
    input,
    lines,
    mapFlow(
      str => str.replace(/ /g, ""),
      matchAll(NUMBER_REGEX),
      map(m => +m[0]),
    ),
    zipAll,
  );
}

function part1(input: string) {
  const races = parse(input) as Generator<[number, number]>;
  return pipe(
    races,
    map(([time, distance]) => {
      const min = Math.floor((time - Math.sqrt(time ** 2 - 4 * distance)) / 2) + 1;
      const max = Math.ceil((time + Math.sqrt(time ** 2 - 4 * distance)) / 2) - 1;
      return max - min + 1;
    }),
    product,
  );
}

describe("2023/day/06/part1", () => {
  it("should work with the example input", () => {
    const input = `Time:      7  15   30
Distance:  9  40  200`;
    const result = part1(input);
    expect(result).toEqual(71503);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(30565288);
  });
});
