import fs from "node:fs";
import path from "node:path";

export function load(dir: string) {
  return fs.readFileSync(path.join(dir, "./input.txt"), "utf-8");
}

export function split(separator: string) {
  return function* (input: string) {
    let index = input.indexOf(separator);
    while (index !== -1) {
      yield input.slice(0, index);
      input = input.slice(index + separator.length);
      index = input.indexOf(separator);
    }
    yield input;
  };
}

export function* lines(input: string) {
  yield* pipe(input, split("\n"));
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

export function includes<T>(item: T) {
  return function (input: Iterable<T>) {
    for (const inner of input) {
      if (item === inner) return true;
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

export function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

export function* repeat<T>(item: T, count: number) {
  for (let i = 0; i < count; i++) {
    yield item;
  }
}

export function* concat<T>(...inputs: Iterable<T>[]) {
  for (const input of inputs) {
    for (const item of input) {
      yield item;
    }
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

export function* enumerate<T>(input: Iterable<T>) {
  let i = 0;
  for (const item of input) {
    yield [i, item] as [number, T];
    i++;
  }
}

export function* flat<T>(input: Iterable<Iterable<T>>) {
  for (const inner of input) {
    for (const item of inner) {
      yield item;
    }
  }
}

export function* flatMap<T, U>(fn: (item: T) => Iterable<U>) {
  return function* (input: Iterable<T>) {
    for (const item of input) {
      for (const inner of fn(item)) {
        yield inner;
      }
    }
  };
}

export function* unique<T>(input: Iterable<T>) {
  const seen = new Set<T>();
  for (const item of input) {
    if (!seen.has(item)) {
      seen.add(item);
      yield item;
    }
  }
}

export function* duplicate<T>(input: Iterable<T>) {
  for (const item of input) {
    yield item;
    yield item;
  }
}

export function* chunk<T>(input: Iterable<T>, size: number) {
  let chunk: T[] = [];
  for (const item of input) {
    chunk.push(item);
    if (chunk.length === size) {
      yield chunk;
      chunk = [];
    }
  }
  if (chunk.length > 0) yield chunk;
}

export function* chunkBy<T>(input: Iterable<T>, fn: (item: T) => boolean) {
  let chunk: T[] = [];
  for (const item of input) {
    if (fn(item)) {
      yield chunk;
      chunk = [];
    }
    chunk.push(item);
  }
  if (chunk.length > 0) yield chunk;
}

export function min<T>(input: Iterable<T>) {
  let min: T | undefined;
  for (const item of input) {
    if (!min || item < min) {
      min = item;
    }
  }
  return min;
}

export function max<T>(input: Iterable<T>) {
  let max: T | undefined;
  for (const item of input) {
    if (!max || item > max) {
      max = item;
    }
  }
  return max;
}

export function sum(input: Iterable<number>) {
  let sum = 0;
  for (const item of input) {
    sum += item;
  }
  return sum;
}

export function average(input: Iterable<number>) {
  let sum = 0;
  let count = 0;
  for (const item of input) {
    sum += item;
    count++;
  }
  return sum / count;
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
export function pipe<A, B, C, D, E, F, G>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H
): H;
export function pipe(input: any, ...fns: any[]) {
  return fns.reduce((input, fn) => fn(input), input);
}
