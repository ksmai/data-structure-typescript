/* tslint:disable max-classes-per-file prefer-for-of no-bitwise */
import { IUSet } from "../USet/IUSet";
import { ISSet } from "./ISSet";
import { Treap } from "./Treap";

class HashTable implements IUSet<Node> {
  protected n: number;
  protected d: number;
  protected t: { length: number, [key: number]: Node[] };
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

  public add(x: Node): boolean {
    if (this.find(x) !== null) {
      return false;
    }
    if (this.n + 1 > this.t.length) {
      this.resize();
    }
    this.t[this.hash(x.x)].push(x);
    this.n++;
    return true;
  }

  public remove(x: Node): Node {
    const list = this.t[this.hash(x.x)];
    for (let i = 0; i < list.length; i++) {
      if (list[i].x === x.x) {
        const [y] = list.splice(i, 1);
        this.n--;
        return y;
      }
    }
    return null;
  }

  public find(x: Node): Node {
    const list = this.t[this.hash(x.x)];
    for (let i = 0; i < list.length; i++) {
      if (list[i].x === x.x) {
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
        const h = this.hash(this.t[i][j].x);
        tnew[h].push(this.t[i][j]);
      }
    }
    this.t = tnew;
  }

  protected hash(x: number): number {
    return (this.z * x) >>> (this.w - this.d);
  }
}

const prev = 0;
const next = 1;
const left = 0;
const right = 1;
const w = 32;

class Node {
  public x: number;
  public child: [Node, Node];
  public parent: Node;
  public jump: Node;
  public t: Treap;

  constructor(x: number = null) {
    this.x = x;
    this.child = [null, null];
    this.parent = null;
    this.jump = null;
    this.t = null;
  }
}

export class XFastTrie implements ISSet<number> {
  protected n: number;
  protected r: Node;
  protected dummy: Node;
  protected t: HashTable[];

  constructor() {
    this.n = 0;
    this.r = new Node(0);
    this.dummy = new Node();
    this.dummy.child[prev] = this.dummy;
    this.dummy.child[next] = this.dummy;
    this.r.jump = this.dummy;
    this.t = [];
    for (let i = 0; i <= w; i++) {
      this.t[i] = new HashTable();
    }
    this.t[0].add(this.r);
  }

  public add(x: number, t: Treap = null): boolean {
    let i: number;
    let c: number;
    let u = this.r;
    for (i = 0; i < w; i++) {
      c = x >>> w - 1 - i & 1;
      if (u.child[c] === null) {
        break;
      }
      u = u.child[c];
    }
    if (i === w) {
      return false;
    }
    const pred = (c === left) ? u.jump.child[prev] : u.jump;
    u.jump = null;
    for (; i < w; i++) {
      c = x >>> w - 1 - i & 1;
      u.child[c] = new Node(x >>> w - 1 - i);
      u.child[c].parent = u;
      u = u.child[c];
      this.t[i + 1].add(u);
    }
    u.x = x;
    u.t = t || new Treap();
    u.child[prev] = pred;
    u.child[next] = pred.child[next];
    u.child[prev].child[next] = u;
    u.child[next].child[prev] = u;
    let v = u.parent;
    while (v !== null) {
      if ((v.child[left] === null && (v.jump === null || v.jump.x > x)) ||
        (v.child[right] === null && (v.jump === null || v.jump.x < x))) {
        v.jump = u;
      }
      v = v.parent;
    }
    this.n++;
    return true;
  }

  public remove(x: number): boolean {
    let c: number;
    let u = this.r;
    for (let i = 0; i < w; i++) {
      c = x >>> w - 1 - i & 1;
      if (u.child[c] === null) {
        return false;
      }
      u = u.child[c];
    }
    u.child[prev].child[next] = u.child[next];
    u.child[next].child[prev] = u.child[prev];
    let v = u.parent;
    for (let i = w - 1; i >= 0; i--) {
      c = x >>> w - 1 - i & 1;
      this.t[i + 1].remove(v.child[c]);
      v.child[c] = null;
      if (v.child[1 - c] !== null) {
        break;
      }
      v = v.parent;
    }
    if (v !== null) {
      v.jump = u;
    }
    while (v !== null) {
      if (v.jump === u) {
        if (v.child[left] === null) {
          v.jump = u.child[next];
        } else if (v.child[right] === null) {
          v.jump = u.child[prev];
        }
      }
      v = v.parent;
    }
    this.n--;
    return true;
  }

  public find(x: number): number {
    const u = this.findNode(x);
    return u === null ? null : u.x;
  }

  public size(): number {
    return this.n;
  }

  public findNode(x: number): Node {
    let l = 0;
    let h = w + 1;
    let u = this.r;
    let v: Node;
    while (h - l > 1) {
      const i = Math.floor((h + l) / 2);
      v = this.t[i].find(new Node(i > 0 ? x >>> w - i : 0));
      if (v !== null) {
        l = i;
        u = v;
      } else {
        h = i;
      }
    }
    if (l === w) {
      return u;
    }
    const pred = ((x >>> w - l - 1 & 1) === 1 ) ?
      u.jump :
      u.jump.child[prev];
    return pred.child[next] === this.dummy ? null : pred.child[next];
  }
}
