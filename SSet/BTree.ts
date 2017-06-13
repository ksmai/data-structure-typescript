/* tslint:disable max-classes-per-file */
import { ISSet } from "./ISSet";

const B = 2;

class Node {
  public id: number;
  public keys: number[];
  public children: number[];

  constructor(private bs: BlockStore) {
    this.keys = Array(2 * B).fill(null);
    this.children = Array(2 * B).fill(-1);
    this.id = bs.placeBlock(this);
  }

  public add(key: number, child: number): void {
    let i = 0;
    while (this.keys[i] !== null && this.keys[i] < key) {
      i++;
    }
    this.keys.copyWithin(i + 1, i);
    this.keys[i] = key;
    const lastChild = this.children[this.children.length - 1];
    this.children.copyWithin(i + 2, i + 1);
    this.children[i + 1] = child;
    this.children.push(lastChild);
  }

  public remove(i: number): number {
    const [x] = this.keys.splice(i, 1);
    this.keys.push(null);
    return x;
  }

  public isFull(): boolean {
    return this.keys[this.keys.length - 1] !== null;
  }

  public split(): Node {
    const w = new Node(this.bs);
    for (let j = 0; j < B; j++) {
      w.keys[j] = this.keys[j + B];
      this.keys[j + B] = null;
      w.children[j] = this.children[j + B + 1] || -1;
      this.children[j + B + 1] = -1;
    }
    this.children.length = this.keys.length;
    return w;
  }

  public isLeaf(): boolean {
    return this.children[0] === -1;
  }

  public size(): number {
    const idx = this.keys.findIndex((key) => key === null);
    return idx === -1 ? B * 2 : idx;
  }
}

class BlockStore {
  protected freeBlocks: number[] = [];
  protected blocks: Node[] = [];

  public readBlock(i: number): Node {
    return this.blocks[i] || null;
  }

  public writeBlock(i: number, u: Node): void {
    this.blocks[i] = u;
  }

  public freeBlock(i: number): void {
    if (this.blocks[i]) {
      this.blocks[i] = null;
      this.freeBlocks.push(i);
    }
  }

  public placeBlock(u: Node): number {
    const i = this.freeBlocks.shift() || this.blocks.length;
    this.writeBlock(i, u);
    return i;
  }
}

export class BTree implements ISSet<number> {
  protected n: number;
  protected ri: number;
  protected bs: BlockStore;

  constructor() {
    this.n = 0;
    this.ri = -1;
    this.bs = new BlockStore();
  }

  public add(x: number): boolean {
    if (this.n === 0) {
      const u = new Node(this.bs);
      u.keys[0] = x;
      this.ri = u.id;
    } else {
      let w: Node;
      try {
        w = this.addRecursive(x, this.ri);
      } catch (e) {
        return false;
      }
      if (w !== null) {
        const newroot = new Node(this.bs);
        x = w.remove(0);
        this.bs.writeBlock(w.id, w);
        newroot.children[0] = this.ri;
        newroot.keys[0] = x;
        newroot.children[1] = w.id;
        this.ri = newroot.id;
        this.bs.writeBlock(this.ri, newroot);
      }
    }
    this.n++;
    return true;
  }

  public remove(x: number): boolean {
    const ret = this.removeRecursive(x, this.ri);
    if (ret) {
      const r = this.bs.readBlock(this.ri);
      if (r.size() < B - 1) {
        this.bs.freeBlock(this.ri);
        this.ri = r.children[0];
      }
    }
    return ret;
  }

  public find(x: number): number {
    let z = null;
    let ui = this.ri;
    while (ui >= 0) {
      const u = this.bs.readBlock(ui);
      const i = this.findIt(u.keys, x);
      if (i < 0) {
        return u.keys[-i - 1];
      }
      if (u.keys[i] !== null) {
        z = u.keys[i];
      }
      ui = u.children[i];
    }
    return z;
  }

  public size(): number {
    return this.n;
  }

  protected findIt(arr: number[], x: number): number {
    let lo = 0;
    let hi = arr.length;
    while (lo !== hi) {
      const m = Math.floor((lo + hi) / 2);
      if (arr[m] === null || arr[m] > x) {
        hi = m;
      } else if (arr[m] < x) {
        lo = m + 1;
      } else {
        return -m - 1;
      }
    }
    return lo;
  }

  protected addRecursive(x: number, ui: number): Node {
    const u = this.bs.readBlock(ui);
    const i = this.findIt(u.keys, x);
    if (i < 0) {
      throw new Error("DuplicateValueException");
    }
    if (u.children[i] < 0) {
      u.add(x, -1);
      this.bs.writeBlock(u.id, u);
    } else {
      const w = this.addRecursive(x, u.children[i]);
      if (w !== null) {
        x = w.remove(0);
        this.bs.writeBlock(w.id, w);
        u.add(x, w.id);
        this.bs.writeBlock(u.id, u);
      }
    }
    return u.isFull() ? u.split() : null;
  }

  protected removeRecursive(x: number, ui: number): boolean {
    if (ui < 0) {
      return false;
    }
    const u = this.bs.readBlock(ui);
    let i = this.findIt(u.keys, x);
    if (i < 0) {
      i = -(i + 1);
      if (u.isLeaf()) {
        u.remove(i);
      } else {
        u.keys[i] = this.removeSmallest(u.children[i + 1]);
        this.checkUnderflow(u, i + 1);
      }
      this.n--;
      return true;
    } else if (this.removeRecursive(x, u.children[i])) {
      this.checkUnderflow(u, i);
      return true;
    }
    return false;
  }

  protected removeSmallest(ui: number): number {
    const u = this.bs.readBlock(ui);
    if (u.isLeaf()) {
      return u.remove(0);
    }
    const y = this.removeSmallest(u.children[0]);
    this.checkUnderflow(u, 0);
    return y;
  }

  protected checkUnderflow(u: Node, i: number): void {
    if (u.children[i] < 0) {
      return;
    }
    if (i === 0) {
      this.checkUnderflowZero(u, i);
    } else {
      this.checkUnderflowNonZero(u, i);
    }
  }

  protected checkUnderflowNonZero(u: Node, i: number): void {
    const w = this.bs.readBlock(u.children[i]);
    if (w.size() < B - 1) {
      const v = this.bs.readBlock(u.children[i - 1]);
      if (v.size() > B - 1) {
        this.shiftLR(u, i - 1, v, w);
      } else {
        this.merge(u, i - 1, v, w);
      }
    }
  }

  protected shiftLR(u: Node, i: number, v: Node, w: Node): void {
    const j = v.size();
    w.add(u.keys[i], v.children[j]);
    v.children[j] = -1;
    u.keys[i] = v.remove(j - 1);
  }

  protected merge(u: Node, i: number, v: Node, w: Node): void {
    const j = v.size();
    v.keys[j] = u.remove(i);
    u.children.copyWithin(i + 1, i + 2);
    u.children[u.children.length - 1] = -1;
    const k = w.size();
    let m: number;
    for (m = 0; m < k; m++) {
      v.keys[j + 1 + m] = w.keys[m];
      v.children[j + 1 + m] = w.children[m];
    }
    v.children[j + 1 + m] = w.children[m];
    this.bs.freeBlock(w.id);
  }

  protected checkUnderflowZero(u: Node, i: number): void {
    const w = this.bs.readBlock(u.children[i]);
    if (w.size() < B - 1) {
      const v = this.bs.readBlock(u.children[i + 1]);
      if (v.size() > B - 1) {
        this.shiftRL(u, i, v, w);
      } else {
        this.merge(u, i, w, v);
      }
    }
  }

  protected shiftRL(u: Node, i: number, v: Node, w: Node): void {
    w.add(u.keys[i], v.children[0]);
    u.keys[i] = v.keys[0];
    v.children.copyWithin(0, 1);
    v.keys.copyWithin(0, 1);
    v.keys[v.keys.length - 1] = null;
    v.children[v.children.length - 1] = -1;
  }
}
