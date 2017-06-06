/* tslint:disable max-classes-per-file */
import { ISSet } from "./ISSet";

const RED = 0;
const BLACK = 1;

class Node {
  public x: number;
  public parent: Node;
  public left: Node;
  public right: Node;
  public colour: number;

  constructor(x: number) {
    this.x = x;
    this.parent = null;
    if (x !== null) {
      this.colour = RED;
      // create external nodes
      this.left = new Node(null);
      this.right = new Node(null);
      this.left.parent = this;
      this.right.parent = this;
    } else {
      this.left = null;
      this.right = null;
      this.colour = BLACK;
    }
  }
}

export class RedBlackTree implements ISSet<number> {
  protected r: Node = null;
  protected n: number = 0;

  public size(): number {
    return this.n;
  }

  public add(x: number): boolean {
    const u = this.findLast(x);
    if (u !== null && u.x === x) {
      return false;
    }
    const w = new Node(x);
    if (u === null) {
      this.r = w;
    } else {
      if (x < u.x) {
        u.left = w;
      } else {
        u.right = w;
      }
      w.parent = u;
    }
    this.n++;
    this.addFixup(w);
    return true;
  }

  public remove(x: number): boolean {
    let u = this.findLast(x);
    if (u === null || u.x !== x) {
      return false;
    }
    let w = u.right;
    if (w.x === null) {
      w = u;
      u = w.left !== null && w.left.x !== null ? w.left : w.right;
    } else {
      while (w.left.x !== null) {
        w = w.left;
      }
      u.x = w.x;
      u = w.right;
    }
    this.splice(w);
    u.colour += w.colour;
    u.parent = w.parent;
    this.removeFixup(u);
    return true;
  }

  public find(x: number): number {
    let u = this.r;
    let w: Node = null;
    while (u !== null && u.x !== null) {
      if (x < u.x) {
        w = u;
        u = u.left;
      } else if (x > u.x) {
        u = u.right;
      } else {
        w = u;
        break;
      }
    }
    return w === null ? null : w.x;
  }

  protected findLast(x: number): Node {
    let u = this.r;
    let prev: Node = null;
    while (u !== null && u.x !== null) {
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
    const w = u.left !== null && u.left.x !== null ? u.left : u.right;
    const p = u.parent;
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

  protected pushBlack(u: Node): void {
    u.colour--;
    u.left.colour++;
    u.right.colour++;
  }

  protected pullBlack(u: Node): void {
    u.colour++;
    u.left.colour--;
    u.right.colour--;
  }

  protected swapColour(u: Node, w: Node): void {
    const tmp = u.colour;
    u.colour = w.colour;
    w.colour = tmp;
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
    if (u.right !== null) {
      u.right.parent = u;
    }
    w.left = u;
    u.parent = w;
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
  }

  protected flipLeft(u: Node): void {
    this.swapColour(u, u.right);
    this.rotateLeft(u);
  }

  protected flipRight(u: Node): void {
    this.swapColour(u, u.left);
    this.rotateRight(u);
  }

  protected addFixup(u: Node): void {
    while (u.colour === RED) {
      if (u === this.r) {
        u.colour = BLACK;
        return;
      }
      let w = u.parent;
      if (w.left.colour === BLACK) {
        this.flipLeft(w);
        u = w;
        w = u.parent;
      }
      if (w.colour === BLACK) {
        return;
      }
      const g = w.parent;
      if (g.right.colour === BLACK) {
        this.flipRight(g);
        return;
      } else {
        this.pushBlack(g);
        u = g;
      }
    }
  }

  protected removeFixup(u: Node): void {
    while (u.colour > BLACK) {
      if (u === this.r) {
        u.colour = BLACK;
      } else if (u.parent.left.colour === RED) {
        u = this.removeFixupCase1(u);
      } else if (u === u.parent.left) {
        u = this.removeFixupCase2(u);
      } else {
        u = this.removeFixupCase3(u);
      }
    }
    if (u !== this.r) {
      const w = u.parent;
      if (w.right.colour === RED && w.left.colour === BLACK) {
        this.flipLeft(w);
      }
    }
  }

  protected removeFixupCase1(u: Node): Node {
    this.flipRight(u.parent);
    return u;
  }

  protected removeFixupCase2(u: Node): Node {
    const w = u.parent;
    const v = w.right;
    this.pullBlack(w);
    this.flipLeft(w);
    const q = w.right;
    if (q.colour === RED) {
      this.rotateLeft(w);
      this.flipRight(v);
      this.pushBlack(q);
      if (v.right.colour === RED) {
        this.flipLeft(v);
      }
      return q;
    } else {
      return v;
    }
  }

  protected removeFixupCase3(u: Node): Node {
    const w = u.parent;
    const v = w.left;
    this.pullBlack(w);
    this.flipRight(w);
    const q = w.left;
    if (q.colour === RED) {
      this.rotateRight(w);
      this.flipLeft(v);
      this.pushBlack(q);
      return q;
    } else {
      if (v.left.colour === RED) {
        this.pushBlack(v);
        return v;
      } else {
        this.flipLeft(v);
        return w;
      }
    }
  }
}
