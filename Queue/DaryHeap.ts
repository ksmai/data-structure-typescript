import { IQueue } from './IQueue';

export class DaryHeap implements IQueue<number> {
  protected a: { length: number, [key: number]: number };
  protected n: number;
  protected d: number;

  constructor(d: number = 3) {
    this.d = d;
    this.n = 0;
    this.a = { length: 1 };
  }

  public add(x: number): boolean {
    if (this.n >= this.a.length) {
      this.resize();
    }
    this.a[this.n++] = x;
    this.bubbleUp(this.n - 1);
    return true;
  }

  public remove(): number {
    if (this.n === 0) {
      return null;
    }
    const x = this.a[0];
    this.a[0] = this.a[--this.n];
    this.trickleDown(0);
    if (3 * this.n < this.a.length) {
      this.resize();
    }
    return x;
  }

  protected resize(): void {
    const b = { length: 2 * this.n };
    for (let i = 0; i < this.n; i++) {
      b[i] = this.a[i];
    }
    this.a = b;
  }

  protected bubbleUp(i: number): void {
    let p = this.parent(i);
    while (i > 0 &&  this.a[p] > this.a[i]) {
      this.swap(i, p);
      i = p;
      p = this.parent(i);
    }
  }

  protected trickleDown(i: number): void {
    do {
      let j = -1;
      let min = i;
      for (let k = this.d - 1; k >= 0; k--) {
        const c = this.child(i, k);
        if (c < this.n && this.a[c] < this.a[min]) {
          j = c;
          min = c;
        } 
      }
      if (j >= 0) {
        this.swap(i, j);
      }
      i = j;
    } while(i >= 0);
  }

  protected child(i: number, j: number): number {
    return this.d * i + 1 + j;
  }

  protected parent(i: number): number {
    return Math.floor((i - 1) / this.d);
  }

  protected swap(i: number, j: number): void {
    const tmp = this.a[i];
    this.a[i] = this.a[j];
    this.a[j] = tmp;
  }
}
