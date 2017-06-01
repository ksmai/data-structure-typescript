/* tslint:disable prefer-for-of no-bitwise */
import { IUSet } from "./IUSet";

// only support number for simplicity in obtaining hash codes
export class ChainedHashTable implements IUSet<number> {
  protected n: number;
  protected d: number;
  protected t: { length: number, [key: number]: number[] };
  protected z: number;
  protected w: number;

  constructor() {
    this.n = 0;
    this.d = 1;
    this.z = 4102541685;
    this.w = 32;
    this.t = { length: 1 << this.d };
    for (let i = 0; i < this.t.length; i++) {
      this.t[i] = [];
    }
  }

  public add(x: number): boolean {
    if (this.find(x) !== null) {
      return false;
    }
    if (this.n + 1 > this.t.length) {
      this.resize();
    }
    this.t[this.hash(x)].push(x);
    this.n++;
    return true;
  }

  public remove(x: number): number {
    const list = this.t[this.hash(x)];
    for (let i = 0; i < list.length; i++) {
      if (list[i] === x) {
        const [y] = list.splice(i, 1);
        this.n--;
        return y;
      }
    }
    return null;
  }

  public find(x: number): number {
    const list = this.t[this.hash(x)];
    for (let i = 0; i < list.length; i++) {
      if (list[i] === x) {
        return list[i];
      }
    }
    return null;
  }

  public size(): number {
    return this.n;
  }

  protected resize(): void {
    this.d++;
    const tnew = { length: 1 << this.d };
    for (let i = 0; i < tnew.length; i++) {
      tnew[i] = [];
    }
    for (let i = 0; i < this.t.length; i++) {
      for (let j = 0; j < this.t[i].length; j++) {
        const h = this.hash(this.t[i][j]);
        tnew[h].push(this.t[i][j]);
      }
    }
    this.t = tnew;
  }

  protected hash(x: number): number {
    return (this.z * x) >>> (this.w - this.d);
  }
}
