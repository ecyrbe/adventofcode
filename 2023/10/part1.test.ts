import { describe, expect, it } from "vitest";
import { load } from "@utils/loader";
import { pipe } from "@utils/pipe";
import { lines } from "@utils/generators";
import { map } from "@utils/operators";
import { collect } from "@utils/reducers";

const authorisedDirections = {
  "╔": [
    [1, 0, "╗╝═"],
    [0, 1, "╚╝║"],
  ],
  "╗": [
    [-1, 0, "╔╚═"],
    [0, 1, "╚╝║"],
  ],
  "╚": [
    [1, 0, "╗╝═"],
    [0, -1, "╔╗║"],
  ],
  "╝": [
    [-1, 0, "╔╚═"],
    [0, -1, "╔╗║"],
  ],
  "═": [
    [1, 0, "╗╝═"],
    [-1, 0, "╔╚═"],
  ],
  "║": [
    [0, 1, "╚╝║"],
    [0, -1, "╔╗║"],
  ],
  "☺": [
    [1, 0, "╗╝═"],
    [0, 1, "╚╝║"],
    [-1, 0, "╔╚═"],
    [0, -1, "╔╗║"],
  ],
};
const START = "☺";

type PipeItems = keyof typeof authorisedDirections | " ";
type PipeMap = string[][];
type Direction = [number, number, string];
type BFSQueue = {
  position: [number, number];
  distance: number;
}[];

function parse(input: string): PipeItems[][] {
  return pipe(input, lines, map(collect), collect) as PipeItems[][];
}

function findStart(map: PipeMap) {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === START) {
        return [x, y] as [number, number];
      }
    }
  }
}

function part1(input: string) {
  const pipeMap = parse(input);
  const start = findStart(pipeMap)!;
  const queue: BFSQueue = [{ position: start, distance: 0 }];
  const visited = new Set<string>();
  visited.add(start.join(","));
  let maxDistance = 0;
  while (queue.length > 0) {
    const { position, distance } = queue.shift()!;
    maxDistance = Math.max(maxDistance, distance);
    const [x, y] = position;
    const item: PipeItems = pipeMap[y][x];
    // @ts-ignore bug in typescript with unicode
    const directions = authorisedDirections[item] as Direction[];
    for (const [dx, dy, authorized] of directions) {
      const newPosition = [x + dx, y + dy] as [number, number];
      const newVisited = newPosition.join(",");
      if (authorized.includes(pipeMap[newPosition[1]][newPosition[0]]) && !visited.has(newVisited)) {
        visited.add(newVisited);
        queue.push({ position: newPosition, distance: distance + 1 });
      }
    }
  }
  return maxDistance;
}

describe("2023/day/10/part1", () => {
  it("should work with the example 1 input", () => {
    const input = `     
 ☺═╗ 
 ║ ║ 
 ╚═╝ 
     `;
    const result = part1(input);
    expect(result).toEqual(4);
  });

  it("should work with the example 2 input", () => {
    const input = `╗═╔╗═
 ╔╝║╗
☺╝╚╚╗
║╔══╝
╚╝ ╚╝`;
    const result = part1(input);
    expect(result).toEqual(8);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(6717);
  });
});
