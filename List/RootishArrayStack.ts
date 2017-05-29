import { IList } from './IList';
import { ArrayStack } from './ArrayStack';

export class RootishArrayStack<T> implements IList<T> {
  protected blocks = new ArrayStack<T[]>();
  protected n = 0;

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const b = this.i2b(i);
    const j = i - (b + 1) * b / 2;
    return this.blocks.get(b)[j];
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const b = this.i2b(i);
    const j = i - (b + 1) * b / 2;
    const y = this.blocks.get(b)[j];
    this.blocks.get(b)[j] = x;
    return y;
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.n) {
      throw new Error("Array index out of bound!");
    }
    if (this.n >= (this.blocks.size() + 1) * this.blocks.size() / 2) {
      this.grow();
    }
    this.n += 1;
    for (let k = this.n - 1; k > i; k--) {
      this.set(k, this.get(k - 1));
    }
    this.set(i, x);
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      throw new Error("Array index out of bound!");
    }
    const x = this.get(i);
    for (let k = i; k < this.n - 1; k++) {
      this.set(k, this.get(k + 1));
    }
    this.n -= 1;
    if (this.n <= (this.blocks.size() - 1) * (this.blocks.size() - 2) / 2) {
      this.shrink();
    }
    return x;
  }

  public size(): number {
    return this.n;
  }

  protected grow(): void {
    this.blocks.add(this.blocks.size(), []);
  }

  protected shrink(): void {
    if (this.blocks.size() > 0) {
      this.blocks.remove(this.blocks.size() - 1);
    }
  }

  protected i2b(i: number): number {
    return Math.ceil((-3 + Math.sqrt(9 + 8 * i)) / 2);
  }
}
