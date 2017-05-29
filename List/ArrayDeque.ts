/* tslint:disable no-bitwise */
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
    return this.a[(this.j + i) & (this.a.length - 1)];
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const y = this.a[(this.j + i) & (this.a.length - 1)];
    this.a[(this.j + i) & (this.a.length - 1)] = x;
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
      // Similar to System.arraycopy in Java
      this.arraycopy(this.j, this.j + 1, this.j + i + 1);
    } else {
      this.n += 1;
      this.arraycopy(this.j + i + 1, this.j + i, this.j + this.n);
    }
    this.set(i, x);
  }

  public addAll(i: number, ...c: T[]): void {
    if (this.n + c.length > this.a.length) {
      this.resize(2 * (this.n + c.length));
    }
    for (let j = 0; j < c.length; j++) {
      this.add(i + j, c[j]);
    }
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const x = this.a[(this.j + i) & (this.a.length - 1)];
    if (i < this.n / 2) {
      this.arraycopy(this.j + 1, this.j, this.j + i);
      this.j = (this.j + 1) & (this.a.length - 1);
    } else {
      this.arraycopy(this.j + i, this.j + i + 1, this.j + this.n);
    }
    this.n -= 1;
    if (3 * this.n < this.a.length) {
      this.resize();
    }
    return x;
  }

  protected resize(size = this.n * 2): void {
    const pow = Math.ceil(Math.log2(size));
    size = Math.pow(2, pow);
    const b = { length: Math.max(1, size) };
    for (let i = 0; i < this.n; i++) {
      b[i] = this.get(i);
    }
    this.j = 0;
    this.a = b;
  }

  protected arraycopy(dest: number, start: number, end: number) {
    if (start >= end) {
      return;
    }
    const wrap = end > this.a.length || dest >= this.a.length;
    if (wrap) {
      if (start >= dest) {
        Array.prototype.copyWithin.call(this.a, dest, start, this.a.length);
        this.a[this.a.length - 1] = this.a[0] === undefined ?
          this.a[this.a.length - 1] :
          this.a[0];
        Array.prototype.copyWithin.call(this.a, 0, 1, end & (this.a.length - 1));
      } else {
        Array.prototype.copyWithin.call(this.a, 1, 0, end & (this.a.length - 1));
        this.a[0] = this.a[this.a.length - 1] === undefined ?
          this.a[0] :
          this.a[this.a.length - 1];
        Array.prototype.copyWithin.call(
          this.a,
          dest & (this.a.length - 1),
          start & (this.a.length - 1),
          this.a.length - 1,
        );
      }
    } else {
      Array.prototype.copyWithin.call(this.a, dest, start, end);
    }
  }
}
