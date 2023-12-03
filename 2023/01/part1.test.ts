import { describe, it, expect } from "vitest";
import { firstAndLast, lines, load, map } from "@utils/generators";
import { reduce } from "@utils/reducers";
import { pipe } from "@utils/pipe";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function* extractNumbers(line: string) {
  for (const char of line) {
    if (DIGITS.includes(char)) {
      yield +char;
    }
  }
}

function part1(input: string) {
  return pipe(
    lines(input),
    map(line =>
      pipe(
        extractNumbers(line),
        firstAndLast,
        reduce((concat, n) => +`${concat}${n}`, 0),
      ),
    ),
    reduce((sum, number) => sum + number, 0),
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
