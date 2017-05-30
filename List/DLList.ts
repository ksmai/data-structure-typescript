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

  public isPalindrome(): boolean {
    let i = 0;
    let p = this.dummy;
    let n = this.dummy;
    while (i < Math.floor(this.n / 2)) {
      p = p.prev;
      n = n.next;
      if (p.x !== n.x) {
        return false;
      }
      i += 1;
    }
    return true;
  }

  public rotate(r: number): void {
    r = Math.floor(r);
    while (r < 0) {
      r += this.n;
    }
    r %= this.n;
    if (r % this.n === 0) {
      return;
    }
    let tail: Node<T> = this.dummy;
    if (r < this.n / 2) {
      for (let j = 0; j <= r; j++) {
        tail = tail.prev;
      }
    } else {
      for (let j = 0; j < this.n - r; j++) {
        tail = tail.next;
      }
    }
    this.dummy.prev.next = this.dummy.next;
    this.dummy.next.prev = this.dummy.prev;
    this.dummy.prev = tail;
    this.dummy.next = tail.next;
    this.dummy.prev.next = this.dummy;
    this.dummy.next.prev = this.dummy;
  }

  public truncate(i: number): DLList<T> {
    i = Math.floor(i);
    if (i < 0 || i >= this.n) {
      return new DLList<T>();
    }
    let tail = this.dummy;
    if (i < this.n / 2) {
      for (let j = 0; j < i; j++) {
        tail = tail.next;
      }
    } else {
      for (let j = 0; j <= this.n - i; j++) {
        tail = tail.prev;
      }
    }
    const h = tail.next;
    const t = this.dummy.prev;
    const l2 = new DLList<T>();
    l2.n = this.n - i;
    l2.dummy.prev = t;
    t.next = l2.dummy;
    l2.dummy.next = h;
    h.prev = l2.dummy;
    this.dummy.prev = tail;
    tail.next = this.dummy;
    this.n = i;
    return l2;
  }

  public absorb(l2: DLList<T>): void {
    const m = l2.size();
    for (let j = 0; j < m; j++) {
      this.add(this.size(), l2.remove(0));
    }
  }

  public deal(): DLList<T> {
    const n = this.size();
    const l2 = new DLList<T>();
    for (let idx = 0, j = 0; j < n; j++) {
      if (j % 2 === 1) {
        l2.add(l2.size(), this.remove(idx));
      } else {
        idx += 1;
      }
    }
    return l2;
  }

  public reverse(): void {
    for (let j = 0; j < this.n; j++) {
      this.add(0, this.remove(j));
    }
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
