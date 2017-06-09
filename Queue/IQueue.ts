export interface IQueue<T> {
  add(x: T): boolean;
  remove(): T;
}
