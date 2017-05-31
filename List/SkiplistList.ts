/* tslint:disable max-classes-per-file no-bitwise */
import { IList } from "./IList";

class Node<T> {
  public x: T;
  public next: { [key: number]: Node<T>, length: number };
  public length: { [key: number]: number, length: number };

  constructor(h: number, x: T) {
    this.x = x;
    this.next = { length: h + 1 };
    this.length = { length: h + 1 };
    for (let j = 0; j < this.next.length; j++) {
      this.next[j] = null;
      this.length[j] = 0;
    }
  }

  public height(): number {
    return this.next.length - 1;
  }
}

export class SkiplistList<T> implements IList<T> {
  protected n: number;
  protected sentinel: Node<T>;
  protected h: number;

  constructor() {
    this.n = 0;
    this.h = 0;
    this.sentinel = new Node(31, null);
  }

  public size(): number {
    return this.n;
  }

  public get(i: number): T {
    return this.getPredNode(i).next[0].x;
  }

  public set(i: number, x: T): T {
    const u = this.getPredNode(i).next[0];
    const y = u.x;
    u.x = x;
    return y;
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.n) {
      throw new Error("Array index out of bound");
    }
    const k = this.randomHeight();
    const p = new Node<T>(k, x);
    if (k > this.h) {
      this.h = k;
    }
    let u = this.sentinel;
    let r = this.h;
    let j = -1;
    while (r >= 0) {
      while (u.next[r] !== null && u.length[r] + j < i) {
        j += u.length[r];
        u = u.next[r];
      }
      u.length[r]++;
      if (r <= k) {
        p.length[r] = u.length[r] - (i - j);
        u.length[r] = i - j;
        p.next[r] = u.next[r];
        u.next[r] = p;
      }
      r--;
    }
    this.n++;
  }

  public addAll(i: number, ...c: T[]): void {
    for (let j = 0; j < c.length; j++) {
      this.add(i + j, c[j]);
    }
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound");
    }
    let u = this.sentinel;
    let r = this.h;
    let j = -1;
    let y: T;
    while (r >= 0) {
      while (u.next[r] !== null && u.length[r] + j < i) {
        j += u.length[r];
        u = u.next[r];
      }
      u.length[r]--;
      if (u.next[r] !== null && u.length[r] + 1 + j === i) {
        y = u.next[r].x;
        u.length[r] += u.next[r].length[r];
        u.next[r] = u.next[r].next[r];
        if (u === this.sentinel && u.next[r] === null) {
          this.h--;
        }
      }
      r--;
    }
    this.n--;
    return y;
  }

  protected getPredNode(i: number): Node<T> {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound");
    }
    let u = this.sentinel;
    let r = this.h;
    let j = -1;
    while (r >= 0) {
      while (u.next[r] !== null && j + u.length[r] < i) {
        j += u.length[r];
        u = u.next[r];
      }
      r--;
    }
    return u;
  }

  protected randomHeight(): number {
    const rand = ~~(Math.random() * Math.pow(2, 32));
    let k = 0;
    let u = 1;
    while ((rand & u) > 0) {
      k++;
      u <<= 1;
    }
    return k;
  }
}
