import { ArrayDeque } from "./ArrayDeque";
import { IList } from "./IList";

export class Treque<T> implements IList<T> {
  protected front = new ArrayDeque<T>();
  protected back = new ArrayDeque<T>();

  public size() {
    return this.front.size() + this.back.size();
  }

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.size() - 1) {
      throw new Error("Array index out of bound!");
    }
    if (i < this.front.size()) {
      return this.front.get(i);
    } else {
      return this.back.get(i - this.front.size());
    }
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.size() - 1) {
      throw new Error("Array index out of bound!");
    }
    if (i < this.front.size()) {
      return this.front.set(i, x);
    } else {
      return this.back.set(i - this.front.size(), x);
    }
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.size()) {
      throw new Error("Array index out of bound!");
    }
    if (i < this.front.size()) {
      this.front.add(i, x);
    } else {
      this.back.add(i - this.front.size(), x);
    }
    this.balance();
  }

  public addAll(i: number, ...c: T[]): void {
    // add first item, then last item, then second item, second-last item
    // to reduce possible needs for rebalancing
    for (let j = 0; j < c.length; j++) {
      const k = Math.ceil(j / 2);
      this.add(k + i, c[j % 2 === 0 ? k : c.length - k]);
    }
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.size() - 1) {
      throw new Error("Array index out of bound!");
    }
    let x: T;
    if (i < this.front.size()) {
      x = this.front.remove(i);
    } else {
      x = this.back.remove(i - this.front.size());
    }
    this.balance();
    return x;
  }

  protected balance(): void {
    if (this.size() < 3) {
      return;
    }
    const newFront = new ArrayDeque<T>();
    const newBack = new ArrayDeque<T>();
    if (this.front.size() * 3 < this.back.size()) {
      const s = Math.floor(this.size() / 2) - this.front.size();
      for (let i = 0; i < this.front.size(); i++) {
        newFront.add(i, this.front.get(i));
      }
      for (let i = 0; i < s; i++) {
        newFront.add(newFront.size(), this.back.get(i));
      }
      for (let i = 0; i < this.back.size() - s; i++) {
        newBack.add(i, this.back.get(s + i));
      }
    } else if (this.back.size() * 3 < this.front.size()) {
      const s = this.front.size() - Math.floor(this.size() / 2);
      for (let i = 0; i < this.front.size() - s; i++) {
        newFront.add(i, this.front.get(i));
      }
      for (let i = 0; i < s; i++) {
        newBack.add(i, this.front.get(this.front.size() - s + i));
      }
      for (let i = 0; i < this.back.size(); i++) {
        newBack.add(newBack.size(), this.back.get(i));
      }
    } else {
      return;
    }
    this.front = newFront;
    this.back = newBack;
  }
}
