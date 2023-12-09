import { mapFlow, pipe } from "@utils/pipe";
import { describe, it, expect } from "vitest";
import { lines, load, matchAll, split } from "@utils/generators";
import { drop, enumerate, map } from "@utils/operators";
import { collect, min, reduce } from "@utils/reducers";

type SeedsMapping = {
  seeds: number[];
  mappings: number[][][];
};

const NUMBER_REGEX = /(\d+)/g;

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

function findMapped(mappings: number[][], mapped: number) {
  for (const [target, source, count] of mappings) {
    if (mapped >= source && mapped < source + count) {
      mapped = mapped - source + target;
      break;
    }
  }
  return mapped;
}

function part1(input: string) {
  const seedsMapping = parseMapping(input);
  return pipe(
    seedsMapping.seeds,
    map(seed =>
      pipe(
        seedsMapping.mappings,
        reduce((mapped, mappings) => findMapped(mappings, mapped), seed),
      ),
    ),
    min,
  );
}

describe("2023/day/05/part1", () => {
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
    expect(part1(input)).toEqual(35);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(389056265);
  });
});
