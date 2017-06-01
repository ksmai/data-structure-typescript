export interface IUSet<T> {
  add(x: T): boolean;
  remove(x: T): T;
  find(x: T): T;
  size(): number;
}
