import { IList } from "./IList";

export class ArrayStack<T> implements IList<T> {
  private a: { [key: number]: T, length: number } = { length: 1 };
  private n: number = 0;

  public size(): number {
    return this.n;
  }

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i >= this.n) {
      throw new Error("Array index out of bound!");
    }
    return this.a[i];
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i >= this.n) {
      throw new Error("Array index out of bound!");
    }
    const y = this.a[i];
    this.a[i] = x;
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
    for (let j = this.n; j > i; j--) {
      this.a[j] = this.a[j - 1];
    }
    this.a[i] = x;
    this.n += 1;
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const x = this.a[i];
    for (let j = i; j < this.n - 1; j++) {
      this.a[j] = this.a[j + 1];
    }
    this.n -= 1;
    if (this.n * 3 <= this.a.length) {
      this.resize();
    }
    return x;
  }

  protected resize(): void {
    const b = { length: Math.max(this.n * 2, 1) };
    for (let i = 0; i < this.n; i++) {
      b[i] = this.a[i];
    }
    this.a = b;
  }
}
