import { describe, it, expect } from "vitest";
import { load } from "@utils/loader";
import { mapFlow, pipe } from "@utils/pipe";
import { lines } from "@utils/generators";
import { duplicateWhen, enumerate, filter, flatMap, map, transpose } from "@utils/operators";
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
      realY += 2;
    } else {
      realY += 1;
    }
    let realX = 0;
    for (let x = 0; x < row.length; x++) {
      if (!hasStarInColumn(x)) {
        realX += 2;
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
  const startPairs = skyStars.flatMap((star, index) =>
    skyStars.slice(index + 1).map(other => [star, other] as [[number, number], [number, number]]),
  );
  return startPairs;
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

function part1(input: string) {
  const skymap = parse(input);
  const starCoordinates = getStarCoordinates(skymap);
  const startPairs = getStarPairs(starCoordinates);
  return computeStarDistances(startPairs);
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
