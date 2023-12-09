import fs from "node:fs";
import path from "node:path";
import { pipe } from "./pipe";

export function load(dir: string) {
  return fs.readFileSync(path.join(dir, "./input.txt"), "utf-8");
}

export function split(separator: string | RegExp) {
  return function* (input: string) {
    let start = 0;
    if (typeof separator === "string") {
      let index = input.indexOf(separator);
      while (index !== -1) {
        yield input.slice(start, index);
        start = index + separator.length;
        index = input.indexOf(separator, start);
      }
    } else {
      const match = input.matchAll(separator);
      for (const m of match) {
        yield input.slice(start, m.index);
        start = m.index! + m[0].length;
      }
    }
    yield input.slice(start);
  };
}

export function* lines(input: string) {
  yield* pipe(input, split("\n"));
}

export function* from<T>(input: Iterable<T>) {
  yield* input;
}

export const matchAll = (regex: RegExp) => (input: string) => input.matchAll(regex);

export function recursive<T>(fn: (item: T) => T) {
  return function* (initial: T) {
    let item = initial;
    while (true) {
      yield item;
      item = fn(item);
    }
  };
}

export function* range(start: number, end: number = Infinity, step: number = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

export function* repeat<T>(item: T, count: number = Infinity) {
  for (let i = 0; i < count; i++) {
    yield item;
  }
}

export function* concat<T>(...inputs: Iterable<T>[]) {
  for (const input of inputs) {
    yield* input;
  }
}

export function* zip<T, U>(input1: Iterable<T>, input2: Iterable<U>) {
  const iterator1 = input1[Symbol.iterator]();
  const iterator2 = input2[Symbol.iterator]();
  while (true) {
    const result1 = iterator1.next();
    const result2 = iterator2.next();
    if (result1.done || result2.done) return;
    yield [result1.value, result2.value] as [T, U];
  }
}

export function zipWith<T, U, V>(fn: (item1: T, item2: U) => V, input1: Iterable<T>) {
  return function* (input2: Iterable<U>) {
    for (const [item1, item2] of zip(input1, input2)) {
      yield fn(item1, item2);
    }
  };
}
