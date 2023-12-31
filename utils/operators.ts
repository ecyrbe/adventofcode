// tuple of T with size N
type Tuple<T, N extends number> = number extends N ? T[] : _TupleOf<T, N, []>;
type _TupleOf<T, N extends number, $acc extends unknown[]> = $acc["length"] extends N
  ? $acc
  : _TupleOf<T, N, [T, ...$acc]>;

export function filter<T, S extends T>(fn: (item: T, index: number) => item is S): (input: Iterable<T>) => Generator<S>;
export function filter<T>(fn: (item: T, index: number) => boolean): (input: Iterable<T>) => Generator<T>;
export function filter(fn: (item: any, index: number) => boolean) {
  return function* (input: Iterable<any>) {
    let index = 0;
    for (const item of input) {
      if (fn(item, index++)) {
        yield item;
      }
    }
  };
}

export function map<T, U>(fn: (item: T, index: number) => U) {
  return function* (input: Iterable<T>) {
    let index = 0;
    for (const item of input) {
      yield fn(item, index++);
    }
  };
}

export function filterMap<T, U>(fn: (item: T, index: number) => U | undefined) {
  return function* (input: Iterable<T>): Generator<U> {
    let index = 0;
    for (const item of input) {
      const mapped = fn(item, index++);
      if (mapped !== undefined) {
        yield mapped;
      }
    }
  };
}

export function pluck<T, K extends keyof T>(key: K) {
  return function* (input: Iterable<T>) {
    for (const item of input) {
      yield item[key];
    }
  };
}

export function scan<T, U>(fn: (sum: U, item: T, index: number) => U, initial: U) {
  return function* (input: Iterable<T>) {
    let sum = initial;
    let index = 0;
    for (const item of input) {
      sum = fn(sum, item, index++);
      yield sum;
    }
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

export function takeWhile<T>(fn: (item: T, index: number) => boolean) {
  return function* (input: Iterable<T>) {
    let index = 0;
    for (const item of input) {
      if (!fn(item, index++)) return;
      yield item;
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

export function* tail<T>(input: Iterable<T>) {
  let first = true;
  for (const item of input) {
    if (!first) yield item;
    first = false;
  }
}

export function dropWhile<T>(fn: (item: T, index: number) => boolean) {
  return function* (input: Iterable<T>) {
    let index = 0;
    let dropping = true;
    for (const item of input) {
      if (dropping && !fn(item, index)) dropping = false;
      if (!dropping) yield item;
      index++;
    }
  };
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

export function tap<T>(fn: (item: T, index: number) => void) {
  return function* (input: Iterable<T>) {
    let index = 0;
    for (const item of input) {
      fn(item, index++);
      yield item;
    }
  };
}

export function log<T>(label?: string) {
  return tap((item: T) => (label ? console.log(label, item) : console.log(item)));
}

export function append<T>(other: Iterable<T>) {
  return function* (input: Iterable<T>) {
    yield* input;
    yield* other;
  };
}

export function appendOne<T>(item: T) {
  return function* (input: Iterable<T>) {
    yield* input;
    yield item;
  };
}

export function prepend<T>(other: Iterable<T>) {
  return function* (input: Iterable<T>) {
    yield* other;
    yield* input;
  };
}

export function prependOne<T>(item: T) {
  return function* (input: Iterable<T>) {
    yield item;
    yield* input;
  };
}

export function* cycle<T>(input: Iterable<T>) {
  if (Array.isArray(input)) {
    while (true) {
      yield* input as Iterable<T>;
    }
  } else {
    const items: T[] = [];
    for (const item of input) {
      items.push(item);
      yield item;
    }
    while (true) {
      yield* items;
    }
  }
}

export function* enumerate<T>(input: Iterable<T>) {
  let i = 0;
  for (const item of input) {
    yield [i, item] as [number, T];
    i++;
  }
}

export function* flatten<T>(input: Iterable<Iterable<T>>) {
  for (const inner of input) {
    yield* inner;
  }
}

export function flatMap<T, U>(fn: (item: T, index: number) => Iterable<U>) {
  return function* (input: Iterable<T>) {
    let index = 0;
    for (const item of input) {
      yield* fn(item, index++);
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

export function duplicateWhen<T>(fn: (item: T, index: number) => boolean) {
  return function* (input: Iterable<T>) {
    let index = 0;
    for (const item of input) {
      yield item;
      if (fn(item, index++)) yield item;
    }
  };
}

export function chunk<T, N extends number>(size: N) {
  return function* (input: Iterable<T>): Generator<Tuple<T, N>> {
    let chunk: T[] = [];
    for (const item of input) {
      chunk.push(item);
      if (chunk.length === size) {
        yield chunk as Tuple<T, N>;
        chunk = [];
      }
    }
    if (chunk.length > 0) yield chunk as Tuple<T, N>;
  };
}

export function chunkBy<T>(fn: (item: T, index: number) => boolean) {
  return function* (input: Iterable<T>) {
    let index = 0;
    let chunk: T[] = [];
    for (const item of input) {
      if (fn(item, index++)) {
        yield chunk;
        chunk = [];
      }
      chunk.push(item);
    }
    if (chunk.length > 0) yield chunk;
  };
}

export function window<T, N extends number>(size: N) {
  return function* (input: Iterable<T>): Generator<Tuple<T, N>> {
    let window: T[] = [];
    for (const item of input) {
      window.push(item);
      if (window.length === size) {
        yield window as Tuple<T, N>;
        window.shift();
      }
    }
  };
}

export function* transpose<T>(input: Iterable<Iterable<T>>) {
  const iterators = [...input].map(i => i[Symbol.iterator]());
  while (true) {
    const results = iterators.map(i => i.next());
    if (results.some(r => r.done)) return;
    yield results.map(r => r.value) as T[];
  }
}
