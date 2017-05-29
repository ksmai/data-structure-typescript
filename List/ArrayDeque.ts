import { IList } from "./IList";

export class ArrayDeque<T> implements IList<T> {
  protected a: { [key: number]: T, length: number } = { length: 1 };
  protected n: number = 0;
  protected j: number = 0;

  public size() {
    return this.n;
  }

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    return this.a[(this.j + i) % this.a.length];
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const y = this.a[(this.j + i) % this.a.length];
    this.a[(this.j + i) % this.a.length] = x;
    return y;
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.n) {
      throw new Error("Array index out of bound!");
    }
    if (this.n + 1 > this.a.length) {
      this.resize();
    }
    if (i < this.n / 2) {
      this.j = this.j === 0 ? this.a.length - 1 : this.j - 1;
      this.n += 1;
      for (let k = 0; k < i; k++) {
        this.set(k, this.get(k + 1));
      }
    } else {
      this.n += 1;
      for (let k = this.n - 1; k > i; k--) {
        this.set(k, this.get(k - 1));
      }
    }
    this.set(i, x);
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const x = this.a[(this.j + i) % this.a.length];
    if (i < this.n / 2) {
      for (let k = i; k > 0; k--) {
        this.set(k, this.get(k - 1));
      }
      this.j = (this.j + 1) % this.a.length;
    } else {
      for (let k = i; k < this.n - 1; k++) {
        this.set(k, this.get(k + 1));
      }
    }
    this.n -= 1;
    if (3 * this.n < this.a.length) {
      this.resize();
    }
    return x;
  }

  protected resize(): void {
    const b = { length: Math.max(1, this.n * 2) };
    for (let i = 0; i < this.n; i++) {
      b[i] = this.get(i);
    }
    this.j = 0;
    this.a = b;
  }
}
