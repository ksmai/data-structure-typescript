/* tslint:disable max-classes-per-file */
import { IList } from "./IList";

class Node<T> {
  public x: T;
  public prev: Node<T>;
  public next: Node<T>;
}

export class DLList<T> implements IList<T> {
  protected dummy: Node<T>;
  protected n: number;

  constructor() {
    this.n = 0;
    this.dummy = new Node<T>();
    this.dummy.next = this.dummy;
    this.dummy.prev = this.dummy;
    this.dummy.x = null;
  }

  public size(): number {
    return this.n;
  }

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    return this.getNode(i).x;
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const n = this.getNode(i);
    const y = n.x;
    n.x = x;
    return y;
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.n) {
      throw new Error("Array index out of bound!");
    }
    this.addBefore(this.getNode(i), x);
  }

  public addAll(i: number, ...c: T[]): void {
    for (let j = 0; j < c.length; j++) {
      this.add(i + j, c[j]);
    }
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const u = this.getNode(i);
    this.removeNode(u);
    return u.x;
  }

  protected getNode(i: number): Node<T> {
    let n: Node<T>;
    if (i < this.n / 2) {
      n = this.dummy.next;
      for (let j = 0; j < i; j++) {
        n = n.next;
      }
    } else {
      n = this.dummy;
      for (let j = this.n; j > i; j--) {
        n = n.prev;
      }
    }
    return n;
  }

  protected addBefore(w: Node<T>, x: T): Node<T> {
    const u = new Node<T>();
    u.x = x;
    u.prev = w.prev;
    u.next = w;
    u.prev.next = u;
    u.next.prev = u;
    this.n += 1;
    return u;
  }

  protected removeNode(w: Node<T>): void {
    w.prev.next = w.next;
    w.next.prev = w.prev;
    this.n -= 1;
  }
}
