import { Node, SkiplistSSet } from "./SkiplistSSet";

export class SkiplistWithFinger<T> extends SkiplistSSet<T> {
  protected finger: Array<Node<T>>;

  constructor() {
    super();
    this.finger = null;
  }

  public add(x: T): boolean {
    this.finger = null;
    return super.add(x);
  }

  public remove(x: T): boolean {
    this.finger = null;
    return super.remove(x);
  }

  protected findPredNode(x: T): Node<T> {
    let r = this.h;
    let u: Node<T>;
    if (this.finger && (this.finger[r].x === null || this.finger[r].x < x)) {
      u = this.finger[r];
      while (r > 0 && u.next[r] !== null && u.next[r].x <= x && this.finger[r - 1].x < x) {
        r--;
        u = this.finger[r];
      }
    } else {
      u = this.sentinel;
    }
    while (r >= 0) {
      while (u.next[r] !== null && u.next[r].x < x) {
        u = u.next[r];
      }
      if (!this.finger) {
        this.finger = [];
      }
      this.finger[r] = u;
      r--;
    }
    return u;
  }
}
