import { IQueue } from './IQueue';

export class BinaryHeap implements IQueue<number> {
  protected n: number = 0;
  protected a: { length: number, [key: number]: number } = { length: 1 };

  public add(x: number): boolean {
    if (this.n >= this.a.length) {
      this.resize();
    }
    this.a[this.n++] = x;
    this.bubbleUp(this.n - 1);
    return true;
  }

  public remove(): number {
    return this.removeIndex(0);
  }

  public removeIndex(i: number): number {
    i = Math.floor(i);
    if (i < 0 || i > this.n - 1) {
      return null;
    }
    const x = this.a[i];
    this.a[i] = this.a[--this.n];
    this.trickleDown(i);
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
      let r = this.right(i);
      let l = this.left(i);
      if (r < this.n && this.a[r] < this.a[i]) {
        if (this.a[l] < this.a[r]) {
          j = l;
        } else {
          j = r;
        }
      } else if (l < this.n && this.a[l] < this.a[i]) {
        j = l;
      }
      if (j >= 0) {
        this.swap(i, j);
      }
      i = j;
    } while(i >= 0);
  }

  protected left(i: number): number {
    return 2 * i + 1;
  }

  protected right(i: number): number {
    return 2 * i + 2;
  }

  protected parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  protected swap(i: number, j: number): void {
    const tmp = this.a[i];
    this.a[i] = this.a[j];
    this.a[j] = tmp;
  }
}
