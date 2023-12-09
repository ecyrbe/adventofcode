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

function predictSensor(history: number[], predicted: number = 0) {
  return pipe(
    history,
    recursive(historyDeltas),
    takeWhile(history => history[0] !== history[history.length - 1] || history[0] !== 0),
    map(history => history[history.length - 1]),
    sum,
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

function part1(input: string) {
  const histories = parse(input);
  return pipe(histories, map(predictSensor), sum);
}

describe("2023/day/08/part1", () => {
  it("should work with the example 1 input", () => {
    const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(114);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(2175229206);
  });
});
