/* tslint:disable max-classes-per-file */
import { ISSet } from "./ISSet";

class Node {
  public x: number;
  public parent: Node;
  public left: Node;
  public right: Node;
  public h: number;

  constructor(x: number) {
    this.x = x;
    this.parent = null;
    this.left = null;
    this.right = null;
    this.h = 0;
  }
}

export class AVLTree implements ISSet<number> {
  protected n: number = 0;
  protected r: Node = null;

  public size(): number {
    return this.n;
  }

  public add(x: number): boolean {
    const nodes = this.findNodes(x);
    const p = nodes.pop();
    if (p !== undefined && p.x === x) {
      return false;
    }
    const w = new Node(x);
    if (p === undefined) {
      this.r = w;
    } else {
      if (x < p.x) {
        p.left = w;
      } else {
        p.right = w;
      }
      w.parent = p;
      this.computeHeight(p);
      for (let i = nodes.length - 1; i >= 0; i--) {
        this.computeHeight(nodes[i]);
      }
      this.rebalance(p.parent);
    }
    this.n++;
    return true;
  }

  public remove(x: number): boolean {
    const nodes = this.findNodes(x);
    const p = nodes.pop();
    if (p === undefined || p.x !== x) {
      return false;
    }
    let w = p.right;
    if (w === null) {
      this.splice(p);
    } else {
      nodes.push(p);
      while (w.left !== null) {
        nodes.push(w);
        w = w.left;
      }
      p.x = w.x;
      this.splice(w);
    }
    for (let i = nodes.length - 1; i >= 0; i--) {
      this.computeHeight(nodes[i]);
    }
    this.rebalance(w !== null ? w.parent : p.parent);
    return true;
  }

  public find(x: number): number {
    const nodes = this.findNodes(x);
    let u = nodes.pop();
    if (u === undefined) {
      return null;
    }
    if (u.x >= x) {
      return u.x;
    }
    let p = nodes.pop();
    while (p !== undefined && p.left !== u) {
      u = p;
      p = nodes.pop();
    }
    return p === undefined ? null : p.x;
  }

  protected findNodes(x: number): Node[] {
    const nodes = [];
    let u = this.r;
    while (u !== null) {
      nodes.push(u);
      if (x < u.x) {
        u = u.left;
      } else if (x > u.x) {
        u = u.right;
      } else {
        break;
      }
    }
    return nodes;
  }

  protected splice(u: Node): void {
    const w = u.left !== null ? u.left : u.right;
    const p = u.parent;
    if (w !== null) {
      w.parent = p;
    }
    if (p === null) {
      this.r = w;
    } else {
      if (p.left === u) {
        p.left = w;
      } else {
        p.right = w;
      }
    }
    this.n--;
  }

  protected rotateLeft(u: Node): void {
    const w = u.right;
    const p = u.parent;
    w.parent = p;
    if (p === null) {
      this.r = w;
    } else {
      if (p.left === u) {
        p.left = w;
      } else {
        p.right = w;
      }
    }
    u.right = w.left;
    if (w.left !== null) {
      w.left.parent = u;
    }
    w.left = u;
    u.parent = w;
    this.computeHeight(u);
    this.computeHeight(w);
  }

  protected rotateRight(u: Node): void {
    const w = u.left;
    const p = u.parent;
    w.parent = p;
    if (p === null) {
      this.r = w;
    } else {
      if (p.left === u) {
        p.left = w;
      } else {
        p.right = w;
      }
    }
    u.left = w.right;
    if (u.left !== null) {
      u.left.parent = u;
    }
    w.right = u;
    u.parent = w;
    this.computeHeight(u);
    this.computeHeight(w);
  }

  protected computeHeight(u: Node): void {
    const hLeft = u.left !== null ? u.left.h : -1;
    const hRight = u.right !== null ? u.right.h : -1;
    u.h = 1 + Math.max(hLeft, hRight);
  }

  protected rebalance(u: Node): void {
    while (u !== null) {
      const hLeft = u.left !== null ? u.left.h : 0;
      const hRight = u.right !== null ? u.right.h : 0;
      const diff = hLeft - hRight;
      if (diff > 1) {
        if (u.left.right !== null) {
          this.rotateLeft(u.left);
        } else {
          this.rotateRight(u.left);
        }
        this.rotateRight(u);
        u = u.parent.parent;
      } else if (diff < -1) {
        if (u.right.left !== null) {
          this.rotateRight(u.right);
        } else {
          this.rotateLeft(u.right);
        }
        this.rotateLeft(u);
        u = u.parent.parent;
      } else {
        u = u.parent;
      }
    }
  }
}
