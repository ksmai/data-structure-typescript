/* tslint:disable max-classes-per-file no-bitwise */
import { ISSet } from "./ISSet";

class Node<T> {
  public x: T;
  public next: { length: number, [key: number]: Node<T> };

  constructor(h: number, x: T) {
    this.x = x;
    this.next = { length: h + 1 };
    for (let j = 0; j < this.next.length; j++) {
      this.next[j] = null;
    }
  }

  public height(): number {
    return this.next.length - 1;
  }
}

export class SkiplistSSet<T> implements ISSet<T> {
  protected n: number;
  protected h: number;
  protected sentinel: Node<T>;

  constructor() {
    this.n = 0;
    this.h = 0;
    this.sentinel = new Node<T>(31, null);
  }

  public add(x: T): boolean {
    let u = this.sentinel;
    let r = this.h;
    const stack = [];
    while (r >= 0) {
      while (u.next[r] !== null && u.next[r].x < x) {
        u = u.next[r];
      }
      if (u.next[r] !== null && u.next[r].x === x) {
        return false;
      }
      stack[r] = u;
      r--;
    }
    const k = this.randomHeight();
    const w = new Node<T>(k, x);
    while (k > this.h) {
      this.h++;
      stack[this.h] = this.sentinel;
    }
    for (let j = 0; j < stack.length; j++) {
      w.next[j] = stack[j].next[j];
      stack[j].next[j] = w;
    }
    this.n++;
    return true;
  }

  public remove(x: T): boolean {
    let removed = false;
    let u = this.sentinel;
    let r = this.h;
    while (r >= 0) {
      while (u.next[r] !== null && u.next[r].x < x) {
        u = u.next[r];
      }
      if (u.next[r] !== null && u.next[r].x === x) {
        removed = true;
        u.next[r] = u.next[r].next[r];
      }
      if (u === this.sentinel && u.next[r] === null) {
        this.h--;
      }
      r--;
    }
    if (removed) {
      this.n--;
    }
    return removed;
  }

  public size(): number {
    return this.n;
  }

  public find(x: T): T {
    const u = this.findPredNode(x);
    return u.next[0] === null ? null : u.next[0].x;
  }

  protected findPredNode(x: T): Node<T> {
    let u = this.sentinel;
    let r = this.h;
    while (r >= 0) {
      while (u.next[r] !== null && u.next[r].x < x) {
        u = u.next[r];
      }
      r--;
    }
    return u;
  }

  protected randomHeight(): number {
    const rand = (Math.random() * Math.pow(2, 32)) | 0;
    let k = 0;
    let m = 1;
    while ((k & m) > 0) {
      k++;
      m <<= 1;
    }
    return k;
  }
}
