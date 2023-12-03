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
