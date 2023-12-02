import fs from "node:fs";
import path from "node:path";

export function load(dir: string) {
  return fs.readFileSync(path.join(dir, "./input.txt"), "utf-8");
}

export function* lines(input: string) {
  while (true) {
    const index = input.indexOf("\n");
    if (index === -1) {
      yield input;
      return;
    }
    yield input.slice(0, index);
    input = input.slice(index + 1);
  }
}

export function filter<T>(fn: (item: T) => boolean) {
  return function* (input: Iterable<T>) {
    for (const item of input) {
      if (fn(item)) {
        yield item;
      }
    }
  };
}

export function map<T, U>(fn: (item: T) => U) {
  return function* (input: Iterable<T>) {
    for (const item of input) {
      yield fn(item);
    }
  };
}

export function reduce<T, U>(fn: (sum: U, item: T) => U, initial: U) {
  return function (input: Iterable<T>) {
    let sum = initial;
    for (const item of input) {
      sum = fn(sum, item);
    }
    return sum;
  };
}

export function take<T>(count: number) {
  return function* (input: Iterable<T>) {
    let i = 0;
    for (const item of input) {
      if (i >= count) return;
      yield item;
      i++;
    }
  };
}

export function drop<T>(count: number) {
  return function* (input: Iterable<T>) {
    let i = 0;
    for (const item of input) {
      if (i >= count) yield item;
      i++;
    }
  };
}

export function last<T>(input: Iterable<T>) {
  let last: T | undefined;
  for (const item of input) {
    last = item;
  }
  return last;
}

export function* firstAndLast<T>(input: Iterable<T>) {
  let last: T | undefined;
  for (const item of input) {
    if (!last) {
      yield item;
    }
    last = item;
  }
  if (last) yield last;
}

export function tap<T>(fn: (item: T) => void) {
  return function* (input: Iterable<T>) {
    for (const item of input) {
      fn(item);
      yield item;
    }
  };
}

export function some<T>(fn: (item: T) => boolean) {
  return function (input: Iterable<T>) {
    for (const item of input) {
      if (fn(item)) return true;
    }
    return false;
  };
}

export function every<T>(fn: (item: T) => boolean) {
  return function (input: Iterable<T>) {
    for (const item of input) {
      if (!fn(item)) return false;
    }
    return true;
  };
}

export function find<T>(fn: (item: T) => boolean) {
  return function (input: Iterable<T>) {
    for (const item of input) {
      if (fn(item)) return item;
    }
  };
}

export function pipe<A, B>(input: A, fn: (input: A) => B): B;
export function pipe<A, B, C>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C
): C;
export function pipe<A, B, C, D>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D
): D;
export function pipe<A, B, C, D, E>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E
): E;
export function pipe<A, B, C, D, E, F>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F
): F;
export function pipe(input: any, ...fns: any[]) {
  return fns.reduce((input, fn) => fn(input), input);
}
