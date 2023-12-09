import { describe, it, expect } from "vitest";
import { mapFlow, pipe } from "@utils/pipe";
import { lines, load } from "@utils/generators";
import { filter, map, firstAndLast } from "@utils/operators";
import { reduce, sum } from "@utils/reducers";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function part1(input: string) {
  return pipe(
    lines(input),
    mapFlow(
      filter(char => DIGITS.includes(char)),
      firstAndLast,
      map(n => +n),
      reduce((concat, n) => 10 * concat + n, 0),
    ),
    sum,
  );
}

describe("2023/day/01/part1", () => {
  it("should work with the example input", () => {
    const input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
    expect(part1(input)).toEqual(142);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    console.log(part1(input));
    expect(part1(input)).toEqual(54390);
  });
});
