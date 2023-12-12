import { describe, it, expect } from "vitest";
import { load } from "@utils/loader";
import { mapFlow, pipe } from "@utils/pipe";
import { lines } from "@utils/generators";
import { drop, flatMap, map, transpose } from "@utils/operators";
import { collect, sum } from "@utils/reducers";

function parse(input: string) {
  return pipe(input, lines, mapFlow(collect), collect);
}

function transposeSkyMap(skymap: string[][]) {
  return pipe(skymap, transpose<string>, collect);
}

function memoize(fn: (pos: number) => boolean) {
  const cache = new Map<number, boolean>();
  return (pos: number): boolean => {
    if (cache.has(pos)) {
      return cache.get(pos)!;
    }
    const result = fn(pos);
    cache.set(pos, result);
    return result;
  };
}

function getStarCoordinates(skymap: string[][]) {
  const transposedSkyMap = transposeSkyMap(skymap);
  const hasStarInColumn = memoize((pos: number) => transposedSkyMap[pos].includes("#"));
  const stars: [number, number][] = [];
  let realY = 0;
  for (let y = 0; y < skymap.length; y++) {
    const row = skymap[y];
    if (!row.includes("#")) {
      realY += 1_000_000;
    } else {
      realY += 1;
    }
    let realX = 0;
    for (let x = 0; x < row.length; x++) {
      if (!hasStarInColumn(x)) {
        realX += 1_000_000;
      } else {
        realX += 1;
      }
      if (row[x] === "#") {
        stars.push([realX, realY]);
      }
    }
  }
  return stars;
}

function getStarPairs(skyStars: [number, number][]) {
  return pipe(
    skyStars,
    flatMap((star, index) =>
      pipe(
        skyStars,
        drop(index + 1),
        map(other => [star, other] as [[number, number], [number, number]]),
      ),
    ),
    collect,
  );
}

function computeStarDistances(startPairs: [[number, number], [number, number]][]) {
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

function part2(input: string) {
  return pipe(input, parse, getStarCoordinates, getStarPairs, computeStarDistances);
}

describe("2023/day/11/part2", () => {
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
    const result = part2(input);
    expect(result).toEqual(82000210);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part2(input);
    expect(result).toEqual(648458253817);
  });
});
