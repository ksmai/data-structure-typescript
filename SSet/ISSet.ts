export interface ISSet<T> {
  add(x: T): boolean;
  remove(x: T): boolean;
  find(x: T): T;
  size(): number;
}
