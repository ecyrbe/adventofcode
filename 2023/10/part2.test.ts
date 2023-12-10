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
  "☺": [[0, 1, "╚╝║"]],
};

const poleDirections = ["north", "south", "east", "west"] as const;

const START = "☺";

type PipeItems = keyof typeof authorisedDirections | " ";
type PipeMap = string[][];
type Direction = [number, number, string];
type PoleDirection = (typeof poleDirections)[number];
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
const directionMap = {
  north: {
    "╔": "north-east",
    "╗": "north-west",
  },
  "north-east": {
    "═": "east",
    "╗": "south",
    "╝": "north",
  },
  "north-west": {
    "═": "west",
    "╔": "south",
    "╚": "north",
  },
  south: {
    "╚": "south-east",
    "╝": "south-west",
  },
  "south-east": {
    "═": "east",
    "╗": "south",
    "╝": "north",
  },
  "south-west": {
    "═": "west",
    "╔": "south",
    "╚": "north",
  },
  east: {
    "╗": "south",
    "╝": "north",
  },
  west: {
    "╔": "south",
    "╚": "north",
  },
};

function getDirection(direction: PoleDirection, item: PipeItems): PoleDirection {
  // @ts-ignore bug in typescript with unicode
  return directionMap[direction][item] || direction;
}

function buildLoop(pipeMap: PipeItems[][]) {
  const pipeLoop = new Map<string, PoleDirection>();
  const start = findStart(pipeMap)!;
  const queue = [start];
  const startKey = start.join(",");
  let direction: PoleDirection = "south";
  pipeLoop.set(startKey, direction);
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const currentPipe: PipeItems = pipeMap[y][x];
    // @ts-ignore bug in typescript with unicode
    const directions = authorisedDirections[currentPipe] as Direction[];
    for (const [dx, dy, authorized] of directions) {
      const newPosition = [x + dx, y + dy] as [number, number];
      const newVisited = newPosition.join(",");
      const nextPipe = pipeMap[newPosition[1]][newPosition[0]];
      if (authorized.includes(nextPipe) && !pipeLoop.has(newVisited)) {
        direction = getDirection(direction, nextPipe);
        pipeLoop.set(newVisited, direction);
        queue.push(newPosition);
      }
    }
  }
  return pipeLoop;
}

function totalNotInLoop(pipeMap: PipeItems[][], loop: Map<string, PoleDirection>) {
  let total = 0;
  for (let y = 0; y < pipeMap.length; y++) {
    const row = pipeMap[y];
    let rowTotal = 0;
    let inLoop = false;
    let lastswitch = "";
    for (let x = 0; x < row.length; x++) {
      const key = [x, y].join(",");
      const isDirectionSwitch = (dir: "north" | "south") =>
        loop.has(key) && loop.get(key)?.includes(dir) && lastswitch !== dir;

      if (!loop.has(key) && inLoop) {
        rowTotal += 1;
      } else if (isDirectionSwitch("north")) {
        inLoop = !inLoop;
        lastswitch = "north";
      } else if (isDirectionSwitch("south")) {
        inLoop = !inLoop;
        lastswitch = "south";
      }
    }
    total += rowTotal;
  }
  return total;
}

function part2(input: string) {
  const pipeMap = parse(input);
  const loop = buildLoop(pipeMap);
  return totalNotInLoop(pipeMap, loop);
}

describe("2023/day/10/part2", () => {
  it("should work with the example 1 input", () => {
    const input = `     
 ☺═╗ 
 ║ ║ 
 ╚═╝ 
     `;
    const result = part2(input);
    expect(result).toEqual(1);
  });

  it("should work with the example 2 input", () => {
    const input = `
 ╗═╔╗═
  ╔╝║╗
 ☺╝╚╚╗
 ║╔══╝
 ╚╝ ╚╝`;
    const result = part2(input);
    expect(result).toEqual(1);
  });

  it("should work with the example 3 input", () => {
    const input = `
 ☺═══════╗
 ║╔═════╗║
 ║║     ║║
 ║║     ║║
 ║╚═╗ ╔═╝║
 ║  ║ ║  ║
 ╚══╝ ╚══╝
           `;
    const result = part2(input);
    expect(result).toEqual(4);
  });

  it("should work with the example 4 input", () => {
    const input = `
 ╔════╗╔╗╔╗╔╗╔═╗
 ║╔══╗║║║║║║║║╔╝
 ║║ ╔╝║║║║║║║║╚╗
╔╝╚╗╚╗╚╝╚╝║║╚╝ ╚═╗
╚══╝ ╚╗   ╚╝☺╗╔═╗╚╗
    ╔═╝  ╔╗╔╝║╚╗╚╗╚╗
    ╚╗ ╔╗║║╚╗║ ╚╗╚╗║
     ║╔╝╚╝║╔╝║╔╗║ ╚╝
    ╔╝╚═╗ ║║ ║║║║
    ╚═══╝ ╚╝ ╚╝╚╝   `;
    const result = part2(input);
    expect(result).toEqual(8);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part2(input);
    console.log(result);
    expect(result).toEqual(381);
  });
});
