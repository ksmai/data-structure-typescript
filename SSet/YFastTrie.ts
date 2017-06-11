import { XFastTrie } from './XFastTrie';
import { ISSet } from './ISSet';

const w = 32;

export class YFastTrie implements ISSet<number> {
  protected xft: XFastTrie;
  protected n: number;

  constructor() {
    this.xft = new XFastTrie();
    this.xft.add(0xffffffff);
    this.n = 0;
  }

  public add(x: number): boolean {
    const t = this.xft.findNode(x).t;
    if (t.add(x)) {
      this.n++;
      if (Math.random() < 1 / w) {
        this.xft.add(x, t.split(x));
      }
      return true;
    }
    return false;
  }

  public remove(x: number): boolean {
    const u = this.xft.findNode(x);
    const t = u.t;
    const ret = t.remove(x);
    if (u.x === x && x !== 0xffffffff) {
      u.child[1].t.absorb(t);
      this.xft.remove(x);
    }
    if (ret) {
      this.n--;
    }
    return ret;
  }

  public find(x: number): number {
    return this.xft.findNode(x).t.find(x);
  }

  public size(): number {
    return this.n;
  }
}
