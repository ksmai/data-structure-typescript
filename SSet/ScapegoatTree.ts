/* tslint:disable max-classes-per-file */
import { ISSet } from "./ISSet";

class Node {
  public parent: Node;
  public left: Node;
  public right: Node;
  public x: number;

  constructor(x: number) {
    this.x = x;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

export class ScapegoatTree implements ISSet<number> {
  protected r: Node = null;
  protected n: number = 0;
  protected q: number = 0;

  public size(): number {
    return this.n;
  }

  public add(x: number): boolean {
    const u = new Node(x);
    const d = this.addWithDepth(u);
    if (d > this.maxDepth) {
      let w = u.parent;
      let childSize = this.sizeAt(w);
      let parentSize: number;
      if (w.parent.left === w) {
        parentSize = this.sizeAt(w.parent, childSize);
      } else {
        parentSize = this.sizeAt(w.parent, undefined, childSize);
      }
      while (childSize * 3 <= parentSize * 2) {
        w = w.parent;
        childSize = this.sizeAt(w);
        if (w.parent.left === w) {
          parentSize = this.sizeAt(w.parent, childSize);
        } else {
          parentSize = this.sizeAt(w.parent, undefined, childSize);
        }
      }
      this.rebuild(w.parent);
    }
    return d >= 0;
  }

  public remove(x: number): boolean {
    const u = this.findLast(x);
    if (u === null || u.x !== x) {
      return false;
    }
    if (u.left === null || u.right === null) {
      this.splice(u);
    } else {
      let w = u.right;
      while (w.left !== null) {
        w = w.left;
      }
      u.x = w.x;
      this.splice(w);
    }
    if (2 * this.n < this.q) {
      this.rebuild(this.r);
      this.q = this.n;
    }
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

  protected addWithDepth(u: Node): number {
    let w = this.r;
    let prev: Node = null;
    let d = 0;
    while (w !== null) {
      prev = w;
      if (u.x < w.x) {
        w = w.left;
      } else if (u.x > w.x) {
        w = w.right;
      } else {
        return -1;
      }
      d++;
    }
    if (prev === null) {
      this.r = u;
    } else {
      u.parent = prev;
      if (u.x < prev.x) {
        prev.left = u;
      } else {
        prev.right = u;
      }
    }
    this.n++;
    this.q++;
    return d;
  }

  protected sizeAt(u: Node, leftSize?: number, rightSize?: number): number {
    if (u === null) {
      return 0;
    }
    if (leftSize === undefined) {
      leftSize = this.sizeAt(u.left);
    }
    if (rightSize === undefined) {
      rightSize = this.sizeAt(u.right);
    }
    return 1 + leftSize + rightSize;
  }

  protected rebuild(u: Node): void {
    const ns = this.sizeAt(u);
    const nodes: Node[] = [];
    this.packIntoArray(u, nodes, 0);
    const p = u.parent;
    if (p === null) {
      this.r = this.buildBalanced(nodes, 0, ns);
      this.r.parent = null;
    } else if (p.left === u) {
      p.left = this.buildBalanced(nodes, 0, ns);
      p.left.parent = p;
    } else {
      p.right = this.buildBalanced(nodes, 0, ns);
      p.right.parent = p;
    }
  }

  protected packIntoArray(u: Node, arr: Node[], i: number): number {
    if (u === null) {
      return i;
    }
    i = this.packIntoArray(u.left, arr, i);
    arr[i++] = u;
    return this.packIntoArray(u.right, arr, i);
  }

  protected buildBalanced(a: Node[], i: number, ns: number): Node {
    if (ns === 0) {
      return null;
    }
    const m = Math.floor(ns / 2);
    a[m + i].left = this.buildBalanced(a, i, m);
    if (a[m + i].left !== null) {
      a[m + i].left.parent = a[m + i];
    }
    a[m + i].right = this.buildBalanced(a, i + m + 1, ns - m - 1);
    if (a[m + i].right !== null) {
      a[m + i].right.parent = a[m + i];
    }
    return a[m + i];
  }

  protected get maxDepth(): number {
    return (Math.log(this.q) / Math.log(1.5));
  }
}
