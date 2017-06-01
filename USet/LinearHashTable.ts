/* tslint:disable no-bitwise */
import { IUSet } from "./IUSet";

// only support number for easier hash code computation
export class LinearHashTable implements IUSet<number> {
  protected n: number;
  protected q: number;
  protected d: number;
  protected del: number;
  protected t: { length: number, [key: number]: number };
  protected tab: number[][];
  protected r: number;
  protected w: number;

  constructor() {
    this.n = 0;
    this.q = 0;
    this.d = 1;
    this.r = 4;
    this.w = 32;
    this.del = Infinity;
    this.t = { length: 1 << this.d };
    for (let i = 0; i < this.t.length; i++) {
      this.t[i] = null;
    }
    this.tab = [];
    for (let i = 0; i < this.r; i++) {
      this.tab[i] = [];
      for (let j = 0; j < (1 << (this.w / this.r)); j++) {
        this.tab[i][j] = ((Math.random() * ((1 << this.w) - 1)) | 0);
      }
    }
  }

  public add(x: number): boolean {
    if (this.find(x) !== null) {
      return false;
    }
    if ((2 * (this.q + 1)) > this.t.length) {
      this.resize();
    }
    let h = this.hash(x);
    while (this.t[h] !== null && this.t[h] !== this.del) {
      h = (h === this.t.length - 1) ? 0 : h + 1;
    }
    if (this.t[h] !== this.del) {
      this.q++;
    }
    this.n++;
    this.t[h] = x;
    return true;
  }

  public remove(x: number): number {
    let h = this.hash(x);
    while (this.t[h] !== null) {
      if (this.t[h] !== this.del && this.t[h] === x) {
        const y = this.t[h];
        this.t[h] = this.del;
        this.n--;
        if (this.n * 8 < this.t.length) {
          this.resize();
        }
        return y;
      }
      h = (h === this.t.length - 1) ? 0 : h + 1;
    }
    return null;
  }

  public find(x: number): number {
    let h = this.hash(x);
    while (this.t[h] !== null) {
      if (this.t[h] !== this.del && this.t[h] === x) {
        return this.t[h];
      }
      h = (h === this.t.length - 1) ? 0 : h + 1;
    }
    return null;
  }

  public size(): number {
    return this.n;
  }

  protected resize(): void {
    this.d = 1;
    while ((1 << this.d) < 3 * this.n) {
      this.d++;
    }
    const tnew = { length: 1 << this.d };
    for (let i = 0; i < tnew.length; i++) {
      tnew[i] = null;
    }
    for (let i = 0; i < this.t.length; i++) {
      if (this.t[i] !== null && this.t[i] !== this.del) {
        let h = this.hash(this.t[i]);
        while (tnew[h] !== null) {
          h = (h === tnew.length - 1) ? 0 : h + 1;
        }
        tnew[h] = this.t[i];
      }
    }
    this.t = tnew;
    this.q = this.n;
  }

  protected hash(x: number): number {
    let h = 0;
    for (let i = 0; i < this.r; i++) {
      h ^= this.tab[i][(x >>> (this.w / this.r * i)) & 0xff];
    }
    return h >>> (this.w - this.d);
  }
}
