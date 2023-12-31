import { describe, expect, it } from "vitest";
import { load } from "@utils/loader";
import { mapFlow, pipe } from "@utils/pipe";
import { lines } from "@utils/generators";
import { firstAndLast } from "@utils/operators";
import { reduce, sum } from "@utils/reducers";

const ALPHADIGITSMAP = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const ALPHADIGITS = Object.keys(ALPHADIGITSMAP) as (keyof typeof ALPHADIGITSMAP)[];
const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function startWithAlphaDigit(line: string) {
  for (const alphaDigit of ALPHADIGITS) {
    if (line.startsWith(alphaDigit)) {
      return ALPHADIGITSMAP[alphaDigit];
    }
  }
  return false;
}

function* extractNumbers(line: string) {
  while (line.length > 0) {
    if (DIGITS.includes(line[0])) {
      yield +line[0];
    } else {
      const alphaDigit = startWithAlphaDigit(line);
      if (alphaDigit) {
        yield alphaDigit;
      }
    }
    line = line.slice(1);
  }
}

function part2(input: string) {
  return pipe(
    lines(input),
    mapFlow(
      extractNumbers,
      firstAndLast,
      reduce((concat, n) => 10 * concat + n, 0),
    ),
    sum,
  );
}

describe("2023/day/01/part2", () => {
  it("should work with the example input", () => {
    const input = `two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen`;
    const result = part2(input);
    expect(result).toEqual(281);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    console.log(part2(input));
    expect(part2(input)).toEqual(54277);
  });
});
