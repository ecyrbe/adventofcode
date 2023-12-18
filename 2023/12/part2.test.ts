import { lines, split } from "@utils/generators";
import { load } from "@utils/loader";
import { map } from "@utils/operators";
import { pipe } from "@utils/pipe";
import { collect } from "@utils/reducers";
import { describe, it, expect } from "vitest";

function part2(input: string) {
  const inp = parse(input);
  return solve(inp, 5);
}

type Input = Array<[string[], number[]]>;

export function parse(input: string): Input {
  return pipe(
    input,
    lines,
    map(line => {
      const [prefix, suffix] = line.split(" ");
      const first = pipe(prefix, collect);
      const second = pipe(
        suffix,
        split(","),
        map(n => +n),
        collect,
      );
      return [first, second] as [string[], number[]];
    }),
    collect,
  );
}

export function solve(input: Input, repeat: number): number {
  let result = 0;
  let pattern: string[] = [];
  let springs: number[] = [];
  let broken: number[] = new Array(200).fill(0);
  let table: number[] = new Array(200 * 50).fill(0);

  for (const [first, second] of input) {
    pattern = [];
    springs = [];

    for (let i = 1; i < repeat; i++) {
      pattern.push(...first);
      pattern.push("?");
      springs.push(...second);
    }

    pattern.push(...first);
    pattern.push(".");
    springs.push(...second);

    let sum = 0;
    broken.push(0);

    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== ".") {
        sum += 1;
      }
      broken[i + 1] = sum;
    }

    let wiggle = pattern.length - springs.reduce((a, b) => a + b, 0) - springs.length + 1;

    let size = springs[0];
    sum = 0;
    let valid = true;

    for (let i = 0; i < wiggle; i++) {
      if (pattern[i + size] === "#") {
        sum = 0;
      } else if (valid && broken[i + size] - broken[i] === size) {
        sum += 1;
      }

      table[i + size] = sum;

      valid = valid && pattern[i] !== "#";
    }

    let start = size + 1;

    for (let row = 1; row < springs.length; row++) {
      let size = springs[row];
      let previous = (row - 1) * pattern.length;
      let current = row * pattern.length;

      sum = 0;

      for (let i = start; i < start + wiggle; i++) {
        if (pattern[i + size] === "#") {
          sum = 0;
        } else if (table[previous + i - 1] > 0 && pattern[i - 1] !== "#" && broken[i + size] - broken[i] === size) {
          sum += table[previous + i - 1];
        }

        table[current + i + size] = sum;
      }

      start += size + 1;
    }

    result += sum;
  }
  return result;
}

describe("2023/12/part2", () => {
  it("should work with the sample input", () => {
    const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;
    const result = part2(input);
    expect(result).toEqual(525152);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part2(input);
    expect(result).toEqual(50338344809230);
  });
});
