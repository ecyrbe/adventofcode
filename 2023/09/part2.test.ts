import { describe, it, expect } from "vitest";
import { mapFlow, pipe } from "@utils/pipe";
import { lines, load, matchAll, recursive } from "@utils/generators";
import { drop, map, scan, takeWhile } from "@utils/operators";
import { collect, sum } from "@utils/reducers";

const NUMBER_REGEX = /(-?\d+)/g;
type Deltas = [number, number];

function parse(input: string) {
  return pipe(
    input,
    lines,
    mapFlow(
      matchAll(NUMBER_REGEX),
      map(m => +m[0]),
      collect,
    ),
    collect,
  );
}

function interleavedDifference(input: Iterable<number>) {
  let sum = 0;
  let i = 0;
  for (const item of input) {
    if (i++ % 2 !== 0) sum = sum - item;
    else sum = sum + item;
  }
  return sum;
}

function pastSensor(history: number[], predicted: number = 0) {
  return pipe(
    history,
    recursive(historyDeltas),
    takeWhile(history => history[0] !== history[history.length - 1] || history[0] !== 0),
    map(history => history[0]),
    interleavedDifference,
  );
}

function historyDeltas(history: number[]) {
  return pipe(
    history,
    scan((deltas, item) => [deltas[1], item] as Deltas, [0, 0] as Deltas),
    drop(1),
    map(([a, b]) => b - a),
    collect,
  );
}

function part2(input: string) {
  const histories = parse(input);
  return pipe(histories, map(pastSensor), sum);
}

describe("2023/day/08/part2", () => {
  it("should work with the example 1 input", () => {
    const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;
    const result = part2(input);
    console.log(result);
    expect(result).toEqual(2);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part2(input);
    console.log(result);
    expect(result).toEqual(942);
  });
});
