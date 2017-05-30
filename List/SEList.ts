/* tslint:disable max-classes-per-file */
import { ArrayDeque } from "./ArrayDeque";
import { IList } from "./IList";

class BDeque<T> extends ArrayDeque<T> {
  constructor(b: number = 3) {
    super();
    b = Math.floor(b);
    this.a = { length: b + 1 };
  }

  protected resize(): void {
    return;
  }
}

class Node<T> {
  public d: BDeque<T>;
  public next: Node<T>;
  public prev: Node<T>;

  constructor(b: number = 3) {
    b = Math.floor(b);
    this.d = new BDeque<T>(b);
  }
}

class Location<T> {
  constructor(public u: Node<T>, public j: number) {
  }
}

export class SEList<T> implements IList<T> {
  protected dummy: Node<T>;
  protected n: number;
  protected b: number;

  constructor(b: number = 3) {
    b = Math.floor(b);
    this.dummy = new Node<T>(b);
    this.dummy.next = this.dummy;
    this.dummy.prev = this.dummy;
    this.b = b;
    this.n = 0;
  }

  public size(): number {
    return this.n;
  }

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const l = this.getLocation(i);
    return l.u.d.get(l.j);
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const l = this.getLocation(i);
    return l.u.d.set(l.j, x);
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.n) {
      throw new Error("Array index out of bound!");
    }
    if (i === this.n) {
      this.addLast(x);
      return;
    }
    const l = this.getLocation(i);
    let u = l.u;
    let r = 0;
    while (r < this.b && u !== this.dummy && u.d.size() === this.b + 1) {
      r += 1;
      u = u.next;
    }
    if (r === this.b) {
      this.spread(l.u);
      u = l.u;
    }
    if (u === this.dummy) {
      u = this.addBefore(u);
    }
    while (u !== l.u) {
      u.d.add(0, u.prev.d.remove(u.prev.d.size() - 1));
      u = u.prev;
    }
    u.d.add(l.j, x);
    this.n += 1;
  }

  public addLast(x: T): void {
    let last = this.dummy.prev;
    if (last === this.dummy || last.d.size() === this.b + 1) {
      last = this.addBefore(this.dummy);
    }
    last.d.add(last.d.size(), x);
    this.n += 1;
  }

  public addAll(i: number, ...c: T[]): void {
    for (let j = 0; j < c.length; j++) {
      this.add(i + j, c[j]);
    }
  }

  public remove(i: number): T {
    const l = this.getLocation(i);
    const y = l.u.d.get(l.j);
    let u = l.u;
    let r = 0;
    while (r < this.b && u !== this.dummy && u.d.size() === this.b - 1) {
      u = u.next;
      r += 1;
    }
    if (r === this.b) {
      this.gather(l.u);
    }
    u = l.u;
    u.d.remove(l.j);
    while (u.d.size() < this.b - 1 && u.next !== this.dummy) {
      u.d.add(u.d.size(), u.next.d.remove(0));
      u = u.next;
    }
    if (u.d.size() === 0) {
      this.removeNode(u);
    }
    this.n -= 1;
    return y;
  }

  protected getLocation(i: number): Location<T> {
    if (i < this.n / 2) {
      let p: Node<T> = this.dummy.next;
      while (i >= p.d.size()) {
        i -= p.d.size();
        p = p.next;
      }
      return new Location(p, i);
    } else {
      let p: Node<T> = this.dummy;
      let idx = this.n;
      while (i < idx) {
        p = p.prev;
        idx -= p.d.size();
      }
      return new Location(p, i - idx);
    }
  }

  protected addBefore(w: Node<T>): Node<T> {
    const u = new Node<T>(this.b);
    u.prev = w.prev;
    u.next = w;
    u.prev.next = u;
    u.next.prev = u;
    return u;
  }

  protected removeNode(u: Node<T>): void {
    u.prev.next = u.next;
    u.next.prev = u.prev;
  }

  protected spread(u: Node<T>): void {
    let w = u;
    for (let j = 0; j < this.b; j++) {
      w = w.next;
    }
    w = this.addBefore(w);
    while (w !== u) {
      while (w.d.size() < this.b) {
        w.d.add(0, w.prev.d.remove(w.prev.d.size() - 1));
      }
      w = w.prev;
    }
  }

  protected gather(u: Node<T>): void {
    let w = u;
    for (let j = 0; j < this.b; j++) {
      while (w.d.size() < this.b) {
        w.d.add(w.d.size(), w.next.d.remove(0));
      }
      w = w.next;
    }
    this.removeNode(w);
  }
}
