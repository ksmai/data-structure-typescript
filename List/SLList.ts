/* tslint:disable max-classes-per-file */
import { IList } from "./IList";

class Node<T> {
  public x: T;
  public next: Node<T>;
}

export class SLList<T> implements IList<T> {
  protected head: Node<T>;
  protected tail: Node<T>;
  protected n: number;

  constructor() {
    this.n = 0;
    this.head = null;
    this.tail = null;
  }

  public size(): number {
    return this.n;
  }

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    let p = this.head;
    for (let j = 0; j < i; j++) {
      p = p.next;
    }
    return p.x;
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    let p = this.head;
    for (let j = 0; j < i; j++) {
      p = p.next;
    }
    const y = p.x;
    p.x = x;
    return y;
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.n) {
      throw new Error("Array index out of bound!");
    }
    const u = new Node<T>();
    u.x = x;
    this.n += 1;
    if (i === 0) {
      u.next = this.head;
      this.head = u;
    } else {
      let p = this.head;
      for (let j = 0; j < i - 1; j++) {
        p = p.next;
      }
      u.next = p.next;
      p.next = u;
    }
    if (!u.next) {
      this.tail = u;
    }
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
    const x = this.get(i);
    if (i === 0) {
      this.head = this.head.next;
      if (this.n === 1) {
        this.tail = null;
      }
    } else {
      let p = this.head;
      for (let j = 0; j < i - 1; j++) {
        p = p.next;
      }
      p.next = p.next.next;
      if (!p.next) {
        this.tail = p;
      }
    }
    this.n -= 1;
    return x;
  }

  public secondLast(): Node<T> {
    let p = this.head;
    while (!!p && !!p.next && !!p.next.next) {
      p = p.next;
    }
    return p;
  }

  public reverse(): void {
    this.tail = this.head;
    while (!!this.tail.next) {
      const p = this.tail.next;
      this.tail.next = p.next;
      p.next = this.head;
      this.head = p;
    }
  }
}
