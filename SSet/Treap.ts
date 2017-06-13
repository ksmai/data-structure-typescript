/* tslint:disable max-classes-per-file */
import { ISSet } from "./ISSet";

class Node {
  public x: number;
  public p: number;
  public parent: Node;
  public left: Node;
  public right: Node;

  constructor(x: number) {
    this.x = x;
    this.p = Math.random();
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

export class Treap implements ISSet<number> {
  protected r: Node = null;
  protected n = 0;

  public add(x: number): boolean {
    const p = this.findLast(x);
    const u = new Node(x);
    if (this.addChild(p, u)) {
      this.bubbleUp(u);
      return true;
    } else {
      return false;
    }
  }

  public remove(x: number): boolean {
    const u = this.findLast(x);
    if (u === null || u.x !== x) {
      return false;
    }
    this.trickleDown(u);
    this.splice(u);
    return true;
  }

  public find(x: number): number {
    let u = this.r;
    let closest: Node = null;
    while (u !== null) {
      if (x < u.x) {
        closest = u;
        u = u.left;
      } else if (x > u.x) {
        u = u.right;
      } else {
        return u.x;
      }
    }
    return closest !== null ? closest.x : null;
  }

  public size(): number {
    return this.n;
  }

  // all elements in t2 should be less than the smallest one in this treap
  public absorb(t2: Treap): void {
    if (t2.n === 0) {
      return;
    }
    const dummyRoot = new Node(null);
    dummyRoot.right = this.r;
    if (dummyRoot.right !== null) {
      dummyRoot.right.parent = dummyRoot;
    }
    dummyRoot.left = t2.r;
    dummyRoot.left.parent = dummyRoot;
    this.r = dummyRoot;
    this.n += t2.n + 1;
    this.trickleDown(dummyRoot);
    this.splice(dummyRoot);
  }

  // t2 contains all elements less than or equal to x
  // assume x is in the treap
  public split(x: number): Treap {
    const dummyNode = new Node(null);
    dummyNode.p = -1;
    const last = this.findLast(x);
    let u = last.right;
    if (u === null) {
      last.right = dummyNode;
      dummyNode.parent = last;
    } else {
      while (u.left !== null) {
        u = u.left;
      }
      u.left = dummyNode;
      dummyNode.parent = u;
    }
    this.bubbleUp(dummyNode);
    const t2 = new Treap();
    t2.r = dummyNode.left;
    t2.r.parent = null;
    t2.n = this.computeSize(t2.r);
    this.r = dummyNode.right;
    if (this.r !== null) {
      this.r.parent = null;
    }
    this.n -= t2.n;
    return t2;
  }

  protected findLast(x: number): Node {
    let u = this.r;
    let prev: Node = null;
    while (u !== null) {
      prev = u;
      if (x < u.x) {
        u = u.left;
      } else if (x > u.x) {
        u = u.right;
      } else {
        return u;
      }
    }
    return prev;
  }

  protected addChild(p: Node, w: Node): boolean {
    if (p !== null) {
      if (w.x < p.x) {
        p.left = w;
      } else if (w.x > p.x) {
        p.right = w;
      } else {
        return false;
      }
      w.parent = p;
    } else {
      this.r = w;
    }
    this.n++;
    return true;
  }

  protected splice(u: Node): void {
    const c = u.left || u.right;
    const p = u.parent;
    if (p !== null) {
      if (p.left === u) {
        p.left = c;
      } else {
        p.right = c;
      }
      if (c !== null) {
        c.parent = p;
      }
    } else {
      this.r = c;
    }
    this.n--;
  }

  protected rotateLeft(u: Node): void {
    if (u === null || u.right === null) {
      return;
    }
    const w = u.right;
    w.parent = u.parent;
    if (u.parent !== null) {
      if (u.parent.left === u) {
        u.parent.left = w;
      } else {
        u.parent.right = w;
      }
    } else {
      this.r = w;
    }
    u.right = w.left;
    if (u.right !== null) {
      u.right.parent = u;
    }
    w.left = u;
    u.parent = w;
  }

  protected rotateRight(u: Node): void {
    if (u === null || u.left === null) {
      return;
    }
    const w = u.left;
    w.parent = u.parent;
    if (u.parent !== null) {
      if (u.parent.left === u) {
        u.parent.left = w;
      } else {
        u.parent.right = w;
      }
    } else {
      this.r = w;
    }
    u.left = w.right;
    if (u.left !== null) {
      u.left.parent = u;
    }
    w.right = u;
    u.parent = w;
  }

  protected bubbleUp(u: Node): void {
    while (u.parent !== null && u.parent.p > u.p) {
      if (u.parent.left === u) {
        this.rotateRight(u.parent);
      } else {
        this.rotateLeft(u.parent);
      }
    }
  }

  protected trickleDown(u: Node): void {
    while (u.left !== null || u.right !== null) {
      if (u.left === null) {
        this.rotateLeft(u);
      } else if (u.right === null) {
        this.rotateRight(u);
      } else if (u.left.p < u.right.p) {
        this.rotateRight(u);
      } else {
        this.rotateLeft(u);
      }
    }
  }

  protected computeSize(u: Node): number {
    if (u === null) {
      return 0;
    }
    return 1 + this.computeSize(u.left) + this.computeSize(u.right);
  }
}
