export interface IList<T> {
  size(): number;
  get(i: number): T;
  set(i: number, x: T): T;
  add(i: number, x: T): void;
  addAll(i: number, ...c: T[]): void;
  remove(i: number): T;
}
