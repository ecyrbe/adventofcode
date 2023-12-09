import { drop, lines, load, log, map, matchAll, prependOne, scan, zipWith } from "@utils/generators";
import { mapFlow, pipe } from "@utils/pipe";
import { collect, last, sum } from "@utils/reducers";
import { describe, it, expect } from "vitest";

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

function predictSensor(history: number[], predicted: number = 0): number {
  const first = history[0];
  const last = history[history.length - 1];
  if (first === last && first === 0) {
    return -predicted;
  } else {
    return -predictSensor(historyDeltas(history), first - predicted);
  }
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
  return pipe(histories, map(predictSensor), sum);
}

describe("2023/day/08/part1", () => {
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
