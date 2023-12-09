import { drop, lines, load, log, map, matchAll, prependOne, scan, zipWith } from "@utils/generators";
import { mapFlow, pipe } from "@utils/pipe";
import { collect, last, sum } from "@utils/reducers";
import { describe, it, expect } from "vitest";

const NUMBER_REGEX = /(-?\d+)/g;

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
  const first = history[0];
  const last = history[history.length - 1];
  if (first === last && first === 0) {
    return predicted;
  } else {
    return predictSensor(historyDeltas(history), predicted + last);
  }
}

function historyDeltas(history: number[]) {
  return pipe(
    history,
    scan((two, item) => [two[1], item] as [number, number], [0, 0] as [number, number]),
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
