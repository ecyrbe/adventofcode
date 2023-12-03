import { describe, it, expect } from "vitest";
import { split, lines, load, map } from "@utils/generators";
import { reduce } from "@utils/reducers";
import { pipe } from "@utils/pipe";

type Game = {
  id: number;
  rounds: Generator<{
    red: number;
    green: number;
    blue: number;
  }>;
};

function max(game: Game) {
  return pipe(
    game.rounds,
    reduce(
      (maximum, round) => ({
        red: Math.max(maximum.red, round.red),
        green: Math.max(maximum.green, round.green),
        blue: Math.max(maximum.blue, round.blue),
      }),
      { red: 0, green: 0, blue: 0 },
    ),
  );
}

function parseGame(line: string): Game {
  const gameIndex = line.indexOf(":");
  const id = +line.slice(5, gameIndex);
  const rounds = pipe(
    line.slice(gameIndex + 1),
    split(";"),
    map(round => {
      const colors = round.split(",");
      const red = colors.find(color => color.includes("red"));
      const green = colors.find(color => color.includes("green"));
      const blue = colors.find(color => color.includes("blue"));
      return {
        red: red ? +red.slice(0, red.indexOf("red")) : 0,
        green: green ? +green.slice(0, green.indexOf("green")) : 0,
        blue: blue ? +blue.slice(0, blue.indexOf("blue")) : 0,
      };
    }),
  );
  return { id, rounds };
}

function part2(input: string) {
  return pipe(
    lines(input),
    map(parseGame),
    map(max),
    reduce((sum, round) => sum + round.blue * round.green * round.red, 0),
  );
}

describe("2023/day/02/part2", () => {
  it("should work with the example input", () => {
    const input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;
    expect(part2(input)).toEqual(2286);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    console.log(part2(input));
    expect(part2(input)).toEqual(66681);
  });
});
