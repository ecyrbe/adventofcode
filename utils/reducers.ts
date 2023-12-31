/**
 * This files contains reducers. Reducers are functions that take an iterable and return a single value.
 * They consume an iterable, so they are usually used as the last function in a pipe.
 * Note that infinite iterables will cause infinite loops. Only use reducers on finite iterables.
 */

export function reduce<T, U>(fn: (sum: U, item: T) => U, initial: U) {
  return function (input: Iterable<T>) {
    let sum = initial;
    for (const item of input) {
      sum = fn(sum, item);
    }
    return sum;
  };
}

export function fold<T>(fn: (sum: T, item: T) => T) {
  return function (input: Iterable<T>) {
    let sum: T | undefined;
    for (const item of input) {
      if (sum === undefined) {
        sum = item;
      } else {
        sum = fn(sum, item);
      }
    }
    return sum;
  };
}

export function join(separator: string) {
  return function (input: Iterable<string>) {
    let result = "";
    for (const item of input) {
      result += item + separator;
    }
    return result.slice(0, result.length - separator.length);
  };
}

export function sort<T>(compareFn: (a: T, b: T) => number) {
  return function* (input: Iterable<T>) {
    yield* [...input].sort(compareFn);
  };
}

export function* reverse<T>(input: Iterable<T>) {
  yield* [...input].reverse();
}

export function first<T>(input: Iterable<T>) {
  for (const item of input) {
    return item;
  }
}

export function last<T>(input: Iterable<T>) {
  if (Array.isArray(input)) return input.at(-1) as T;
  let last: T | undefined;
  for (const item of input) {
    last = item;
  }
  return last;
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

export function includes<T>(item: T) {
  return function (input: Iterable<T>) {
    for (const inner of input) {
      if (item === inner) return true;
    }
    return false;
  };
}

export function find<T>(fn: (item: T) => boolean) {
  return function (input: Iterable<T>) {
    for (const item of input) {
      if (fn(item)) return item;
    }
  };
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

export function product(input: Iterable<number>) {
  let product = 1;
  for (const item of input) {
    product *= item;
  }
  return product;
}

export function average(input: Iterable<number>) {
  let sum = 0;
  let count = 0;
  for (const item of input) {
    sum += item;
    count++;
  }
  if (count === 0) return 0;
  return sum / count;
}

export function alternateSum(input: Iterable<number>) {
  let sum = 0;
  let even = true;
  for (const item of input) {
    if (even) {
      sum += item;
    } else {
      sum -= item;
    }
    even = !even;
  }
  return sum;
}

export function count<T>(input: Iterable<T>) {
  let count = 0;
  for (const item of input) {
    count++;
  }
  return count;
}

export function unzip<T, U>(input: Iterable<[T, U]>) {
  const output1: T[] = [];
  const output2: U[] = [];
  for (const [item1, item2] of input) {
    output1.push(item1);
    output2.push(item2);
  }
  return [output1, output2] as [Iterable<T>, Iterable<U>];
}

export function partition<T>(fn: (item: T) => boolean) {
  return function (input: Iterable<T>) {
    const trueValues: T[] = [];
    const falseValues: T[] = [];
    for (const item of input) {
      if (fn(item)) {
        trueValues.push(item);
      } else {
        falseValues.push(item);
      }
    }
    return [trueValues, falseValues] as [Iterable<T>, Iterable<T>];
  };
}

export function collect<T>(input: Iterable<T>) {
  return [...input];
}

export function collectSet<T>(input: Iterable<T>) {
  return new Set(input);
}

export function collectMap<T, U>(input: Iterable<[T, U]>) {
  return new Map(input);
}
