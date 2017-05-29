import { IList } from "./IList";

export class ConsecutiveArrayDeque<T> implements IList<T> {
  protected a: { [key: number]: T, length: number } = { length: 1 };
  protected n: number = 0;
  protected j: number = 0;

  public size(): number {
    return this.n;
  }

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    return this.a[this.j + i];
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const y = this.a[this.j + i];
    this.a[this.j + i] = x;
    return y;
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.n) {
      throw new Error("Array index out of bound!");
    }
    if (i < this.n / 2) {
      if (this.j - 1 < 0) {
        this.rebuild();
      }
      Array.prototype.copyWithin
        .call(this.a, this.j - 1, this.j, this.j + i);
      this.j -= 1;
      this.a[this.j + i] = x;
    } else {
      if (this.j + this.n > this.a.length - 1) {
        this.rebuild();
      }
      Array.prototype.copyWithin
        .call(this.a, this.j + i + 1, this.j + i, this.j + this.n);
      this.a[this.j + i] = x;
    }
    this.n += 1;
  }

  public addAll(i: number, ...c: T[]): void {
    if (this.n + c.length > this.a.length) {
      this.rebuild(2 * (this.n + c.length));
    }
    for (let k = 0; k < c.length; k++) {
      this.add(i + k, c[k]);
    }
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const x = this.get(i);
    if (i < this.n / 2) {
      Array.prototype.copyWithin
        .call(this.a, this.j + 1, this.j, this.j + i);
      this.j += 1;
    } else {
      Array.prototype.copyWithin
        .call(this.a, this.j + i, this.j + i + 1, this.j + this.n);
    }
    this.n -= 1;
    if (this.n * 3 < this.a.length) {
      this.rebuild();
    }
    return x;
  }

  public rebuild(size = this.n * 2): void {
    const b = { length: Math.max(size, 1) };
    const j = Math.floor((size - this.n) / 2);
    for (let i = 0; i < this.n; i++) {
      b[i + j] = this.get(i);
    }
    this.j = j;
    this.a = b;
  }
}
