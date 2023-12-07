import { chunk, drop, enumerate, lines, load, log, map, split } from "@utils/generators";
import { mapFlow, pipe } from "@utils/pipe";
import { collect, find, min, reduce, sort } from "@utils/reducers";
import { describe, it, expect } from "vitest";

type Seed = [number, number];
type Mapping = [[number, number], [number, number]];

type SeedsMapping = {
  seeds: Seed[];
  mappings: Mapping[][];
};

const NUMBER_REGEX = /(\d+)/g;

const matchAll = (regex: RegExp) => (input: string) => input.matchAll(regex);

function parseMapping(input: string) {
  return pipe(
    input,
    split(/\S+: |\n\n\S+ \S+:\n/g),
    drop(1),
    enumerate,
    reduce(
      (seedsMapping, [index, value]) => {
        switch (index) {
          case 0:
            seedsMapping.seeds = pipe(
              value,
              matchAll(NUMBER_REGEX),
              map(m => +m[0]),
              chunk(2),
              map(([start, count]) => [start, start + count] as Seed),
              collect,
            );
            break;
          default:
            seedsMapping.mappings.push(
              pipe(
                value,
                lines,
                mapFlow(
                  matchAll(NUMBER_REGEX),
                  map(m => +m[0]),
                  collect,
                ),
                map(
                  ([target, source, count]) =>
                    [
                      [source, source + count],
                      [target, target + count],
                    ] as Mapping,
                ),
                collect,
              ),
            );
        }
        return seedsMapping;
      },
      { seeds: [], mappings: [] } as SeedsMapping,
    ),
  );
}

function mapToTarget(source: number, mapping: Mapping) {
  return source - mapStart(mapping) + mapTargetStart(mapping);
}

function mapStart(mapping: Mapping) {
  return mapping[0][0];
}

function mapEnd(mapping: Mapping) {
  return mapping[0][1];
}

function mapTargetStart(mapping: Mapping) {
  return mapping[1][0];
}

function minLocation(start: number, end: number, mappings: Mapping[][], depth = 0): number {
  if (mappings.length === depth) {
    return start;
  }

  for (const mapping of mappings[depth]) {
    if (start >= mapStart(mapping) && end <= mapEnd(mapping)) {
      return minLocation(mapToTarget(start, mapping), mapToTarget(end, mapping), mappings, depth + 1);
    }
    if (start < mapStart(mapping) && end > mapEnd(mapping)) {
      return Math.min(
        minLocation(start, mapStart(mapping), mappings, depth),
        minLocation(mapEnd(mapping), end, mappings, depth),
        minLocation(
          mapToTarget(mapStart(mapping), mapping),
          mapToTarget(mapEnd(mapping), mapping),
          mappings,
          depth + 1,
        ),
      );
    }
    if (start < mapStart(mapping) && end > mapStart(mapping)) {
      return Math.min(
        minLocation(start, mapStart(mapping), mappings, depth),
        minLocation(mapToTarget(mapStart(mapping), mapping), mapToTarget(end, mapping), mappings, depth + 1),
      );
    }
    if (start < mapEnd(mapping) && end > mapEnd(mapping)) {
      return Math.min(
        minLocation(mapToTarget(start, mapping), mapToTarget(mapEnd(mapping), mapping), mappings, depth + 1),
        minLocation(mapEnd(mapping), end, mappings, depth),
      );
    }
  }
  return minLocation(start, end, mappings, depth + 1);
}

function part2(input: string) {
  const seedsMapping = parseMapping(input);
  return pipe(
    seedsMapping.seeds,
    map(([start, end]) => minLocation(start, end, seedsMapping.mappings)),
    min,
  );
}

describe("2023/day/05/part2", () => {
  it("should work with the example input", () => {
    const input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;
    expect(part2(input)).toEqual(46);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part2(input);
    console.log(result);
    expect(result).toEqual(137516820);
  });
});
