export function reduce<T, U>(fn: (sum: U, item: T) => U, initial: U) {
  return function (input: Iterable<T>) {
    let sum = initial;
    for (const item of input) {
      sum = fn(sum, item);
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
    return result.slice(0, -separator.length);
  };
}

export function first<T>(input: Iterable<T>) {
  for (const item of input) {
    return item;
  }
}

export function last<T>(input: Iterable<T>) {
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

export function count<T>(input: Iterable<T>) {
  let count = 0;
  for (const item of input) {
    count++;
  }
  return count;
}

export function toArray<T>(input: Iterable<T>) {
  return [...input];
}

export function toSet<T>(input: Iterable<T>) {
  return new Set(input);
}

export function toMap<T, U>(input: Iterable<[T, U]>) {
  return new Map(input);
}
