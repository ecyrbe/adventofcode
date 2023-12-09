import { describe, it, expect } from "vitest";
import { load } from "@utils/loader";
import { pipe } from "@utils/pipe";
import { lines } from "@utils/generators";
import { enumerate, filter, map } from "@utils/operators";
import { collect, reduce, sort, sum } from "@utils/reducers";

const cards = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"] as const;
type Card = (typeof cards)[number];
type Hand = {
  hand: string;
  kind: number[];
  order: string;
  bid: number;
};

function kind(hand: string) {
  return pipe(
    hand as Iterable<Card>,
    reduce(
      (kind, card) => {
        kind[card] = (kind[card] ?? 0) + 1;
        return kind;
      },
      {} as Record<Card, number>,
    ),
    kind => {
      if (kind["J"] > 0) {
        let maxCard: Card | undefined = undefined;
        for (const card of cards) {
          if (card === "J") continue;
          if (!maxCard && kind[card] > 0) {
            maxCard = card;
          } else if (maxCard && kind[card] > kind[maxCard]) {
            maxCard = card;
          }
        }
        if (maxCard) {
          kind[maxCard] += kind["J"];
          kind["J"] = 0;
        }
      }
      return kind;
    },
    obj => Object.values(obj),
    filter(count => count > 1),
    sort((a, b) => b - a),
    collect,
  );
}

function orderedHand(hand: string) {
  return hand.replace(/A/g, "Z").replace(/K/g, "Y").replace(/Q/g, "X").replace(/J/g, "1").replace(/T/g, "V");
}

function compareHands(hand1: Hand, hand2: Hand) {
  if (hand1.kind.length > 0 && hand2.kind.length > 0) {
    if (hand1.kind[0] > hand2.kind[0]) {
      return 1;
    }
    if (hand1.kind[0] < hand2.kind[0]) {
      return -1;
    }
    if (hand1.kind.length > 1 && hand2.kind.length === 1) {
      return 1;
    }
    if (hand2.kind.length > 1 && hand1.kind.length === 1) {
      return -1;
    }
    if (hand1.order > hand2.order) {
      return 1;
    }
    if (hand1.order < hand2.order) {
      return -1;
    }
    return 0;
  }
  if (hand1.kind.length > 0) {
    return 1;
  }
  if (hand2.kind.length > 0) {
    return -1;
  }
  if (hand1.order > hand2.order) {
    return 1;
  }
  if (hand1.order < hand2.order) {
    return -1;
  }
  return 0;
}

function parse(input: string) {
  return pipe(
    input,
    lines,
    map(line => line.split(" ")),
    map(([hand, bid]) => ({ hand, kind: kind(hand), order: orderedHand(hand), bid: +bid })),
  );
}

function part1(input: string) {
  const hands = parse(input);
  return pipe(
    hands,
    sort(compareHands),
    enumerate,
    map(([index, hand]) => hand.bid * (index + 1)),
    sum,
  );
}

describe("2023/day/05/part1", () => {
  it("should work with the example input", () => {
    const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(5905);
  });

  it("should work with the puzzle input", () => {
    const input = load(__dirname);
    const result = part1(input);
    console.log(result);
    expect(result).toEqual(253253225);
  });
});
