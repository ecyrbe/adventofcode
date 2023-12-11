import { describe, it, expect } from "vitest";
import { load } from "@utils/loader";
import { mapFlow, pipe } from "@utils/pipe";
import { lines } from "@utils/generators";
import { duplicateWhen, enumerate, filter, flatMap, map, transpose } from "@utils/operators";
import { collect, sum } from "@utils/reducers";

function parse(input: string) {
  return pipe(
    input,
    lines,
    mapFlow(collect),
    duplicateWhen(stars => stars.every(star => star === ".")),
    transpose,
    duplicateWhen((stars: string[]) => stars.every(star => star === ".")),
    transpose,
    mapFlow(enumerate, collect),
    enumerate,
    collect,
  );
}

function getStarPairs(skymap: [number, [number, string][]][]) {
  const skyStars = pipe(
    skymap,
    map(row => [
      row[0],
      pipe(
        row[1],
        filter(column => column[1] !== "."),
        map(column => column[0]),
        collect,
      ),
    ]),
    filter(row => (row[1] as number[]).length > 0),
    flatMap(row =>
      pipe(
        row[1] as number[],
        map(column => [row[0], column] as [number, number]),
      ),
    ),
    collect,
  );
  const startPairs = skyStars.flatMap((star, index) =>
    skyStars.slice(index + 1).map(other => [star, other] as [[number, number], [number, number]]),
  );
  return startPairs;
}

function part1(input: string) {
  //                                y        x      star
  const skymap = parse(input) as [number, [number, string][]][];
  const startPairs = getStarPairs(skymap);
  return pipe(
    startPairs,
    map(([star1, star2]) => {
      const [x1, y1] = star1;
      const [x2, y2] = star2;
      return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }),
    sum,
  );
}

describe("2023/day/11/part1", () => {
  it("should work with the example input", () => {
    const input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;
    const result = part1(input);
    expect(result).toEqual(374);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    expect(result).toEqual(9550717);
  });
});
