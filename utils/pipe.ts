import { map } from "./operators";

export function pipe<A, B>(input: A, fn: (input: A) => B): B;
export function pipe<A, B, C>(input: A, fn1: (input: A) => B, fn2: (input: B) => C): C;
export function pipe<A, B, C, D>(input: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D): D;
export function pipe<A, B, C, D, E>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
): H;
export function pipe(input: any, ...fns: any[]) {
  return fns.reduce((input, fn) => fn(input), input);
}

export function mapFlow<A, B>(fn: (item: A) => B): (input: Iterable<A>) => Generator<B>;
export function mapFlow<A, B, C>(fn1: (item: A) => B, fn2: (item: B) => C): (input: Iterable<A>) => Generator<C>;
export function mapFlow<A, B, C, D>(
  fn1: (item: A) => B,
  fn2: (item: B) => C,
  fn3: (item: C) => D,
): (input: Iterable<A>) => Generator<D>;
export function mapFlow<A, B, C, D, E>(
  fn1: (item: A) => B,
  fn2: (item: B) => C,
  fn3: (item: C) => D,
  fn4: (item: D) => E,
): (input: Iterable<A>) => Generator<E>;
export function mapFlow<A, B, C, D, E, F>(
  fn1: (item: A) => B,
  fn2: (item: B) => C,
  fn3: (item: C) => D,
  fn4: (item: D) => E,
  fn5: (item: E) => F,
): (input: Iterable<A>) => Generator<F>;
export function mapFlow<A, B, C, D, E, F, G>(
  fn1: (item: A) => B,
  fn2: (item: B) => C,
  fn3: (item: C) => D,
  fn4: (item: D) => E,
  fn5: (item: E) => F,
  fn6: (item: F) => G,
): (input: Iterable<A>) => Generator<G>;
export function mapFlow<A, B, C, D, E, F, G, H>(
  fn1: (item: A) => B,
  fn2: (item: B) => C,
  fn3: (item: C) => D,
  fn4: (item: D) => E,
  fn5: (item: E) => F,
  fn6: (item: F) => G,
  fn7: (item: G) => H,
): (input: Iterable<A>) => Generator<H>;
export function mapFlow(...fns: any[]) {
  // @ts-ignore
  return map(item => pipe(item, ...fns));
}
