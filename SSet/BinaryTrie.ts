/* tslint:disable max-classes-per-file no-bitwise */
import { ISSet } from "./ISSet";

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

  constructor(x: number = null) {
    this.x = x;
    this.child = [null, null];
    this.parent = null;
    this.jump = null;
  }
}

export class BinaryTrie implements ISSet<number> {
  protected n: number;
  protected r: Node;
  protected dummy: Node;

  constructor() {
    this.n = 0;
    this.r = new Node();
    this.dummy = new Node();
    this.dummy.child[prev] = this.dummy;
    this.dummy.child[next] = this.dummy;
    this.r.jump = this.dummy;
  }

  public add(x: number): boolean {
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
      u.child[c] = new Node();
      u.child[c].parent = u;
      u = u.child[c];
    }
    u.x = x;
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
      return u.x;
    }
    u = (c === left) ? u.jump : u.jump.child[next];
    return (u === this.dummy) ? null : u.x;
  }

  public size(): number {
    return this.n;
  }
}
