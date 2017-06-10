/* tslint:disable max-classes-per-file */
import { IQueue } from "./IQueue";

class Node {
  public x: number;
  public parent: Node;
  public left: Node;
  public right: Node;

  constructor(x: number) {
    this.x = x;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

export class MeldableHeap implements IQueue<number> {
  protected n: number = 0;
  protected r: Node = null;

  public add(x: number): boolean {
    const u = new Node(x);
    this.r = this.merge(this.r, u);
    this.r.parent = null;
    this.n++;
    return true;
  }

  public remove(): number {
    if (this.r === null) {
      return null;
    }
    const x = this.r.x;
    this.r = this.merge(this.r.left, this.r.right);
    if (this.r !== null) {
      this.r.parent = null;
    }
    this.n--;
    return x;
  }

  protected merge(h1: Node, h2: Node): Node {
    if (h1 === null) {
      return h2;
    } else if (h2 === null) {
      return h1;
    } else if (h1.x > h2.x) {
      return this.merge(h2, h1);
    }

    if (Math.random() < 0.5) {
      h1.left = this.merge(h1.left, h2);
      h1.left.parent = h1;
    } else {
      h1.right = this.merge(h1.right, h2);
      h1.right.parent = h1;
    }
    return h1;
  }
}
