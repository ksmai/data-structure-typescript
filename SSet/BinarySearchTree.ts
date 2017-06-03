/* tslint:disable max-classes-per-file */
import { ISSet } from "./ISSet";

class Node<T> {
  public parent: Node<T>;
  public left: Node<T>;
  public right: Node<T>;
  public x: T;
  public preorder: number;
  public inorder: number;
  public postorder: number;

  constructor(x: T) {
    this.x = x;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

export class BinarySearchTree implements ISSet<number> {
  protected r: Node<number> = null;
  protected n: number = 0;

  public size(): number {
    return this.n;
  }

  public add(x: number): boolean {
    const p = this.findLast(x);
    return this.addChild(p, new Node<number>(x));
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
    return true;
  }

  public findEQ(x: number): number {
    let u = this.r;
    while (u !== null) {
      if (x < u.x) {
        u = u.left;
      } else if (x > u.x) {
        u = u.right;
      } else {
        return u.x;
      }
    }
    return null;
  }

  public find(x: number): number {
    let u = this.r;
    let closest: Node<number> = null;
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

  public size2(x: number): number {
    const u = this.findLast(x);
    if (u === null || u.x !== x) {
      return null;
    }
    return this.size2node(u);
  }

  public height2(x: number): number {
    const u = this.findLast(x);
    if (u === null || u.x !== x) {
      return null;
    }
    let h = 0;
    let w = u;
    let prev: Node<number> = null;
    let next: Node<number> = null;
    while (w !== u.parent) {
      if (prev === null || prev === w.parent) {
        if (w.left !== null) {
          next = w.left;
        } else if (w.right !== null) {
          next = w.right;
        } else {
          // height of a (sub)tree is the maximum depth of leaf nodes
          let d = 0;
          let p = w;
          while (p !== u) {
            d++;
            p = p.parent;
          }
          if (d > h) {
            h = d;
          }
          next = w.parent;
        }
      } else if (prev === w.left) {
        if (w.right !== null) {
          next = w.right;
        } else {
          next = w.parent;
        }
      } else {
        next = w.parent;
      }
      prev = w;
      w = next;
    }
    return h;
  }

  public isBalanced(
    u: Node<number> = this.r,
    o: { s: number } = { s: null },
  ): boolean {
    if (u === null) {
      o.s = 0;
      return true;
    }

    const oLeft: { s: number } = { s: null };
    const oRight: { s: number } = { s: null };
    const bal = this.isBalanced(u.left, oLeft) &&
      this.isBalanced(u.right, oRight);
    o.s = 1 + oLeft.s + oRight.s;
    return bal && Math.abs(oLeft.s - oRight.s) <= 1;
  }

  public preOrderNumber(): Node<number> {
    const traverse = (u = this.r) => {
      if (u !== null) {
        u.preorder = i++;
        traverse(u.left);
        traverse(u.right);
      }
    };

    let i = 0;
    traverse();
    return this.r;
  }

  public inOrderNumber(): Node<number> {
    const traverse = (u = this.r) => {
      if (u !== null) {
        traverse(u.left);
        u.inorder = i++;
        traverse(u.right);
      }
    };

    let i = 0;
    traverse();
    return this.r;
  }

  public postOrderNumber(): Node<number> {
    const traverse = (u = this.r) => {
      if (u !== null) {
        traverse(u.left);
        traverse(u.right);
        u.postorder = i++;
      }
    };

    let i = 0;
    traverse();
    return this.r;
  }

  public nextPreOrder(x: number): number {
    let u = this.findLast(x);
    if (u === null || u.x !== x) {
      return null;
    }
    if (u.left) {
      return u.left.x;
    } else if (u.right) {
      return u.right.x;
    } else {
      let p = u.parent;
      while (p !== null) {
        if (p.right !== null && p.right !== u) {
          return p.right.x;
        }
        u = p;
        p = p.parent;
      }
      return null;
    }
  }

  public nextInOrder(x: number): number {
    let u = this.findLast(x);
    if (u === null || u.x !== x) {
      return null;
    }
    if (u.right !== null) {
      u = u.right;
      while (u.left !== null) {
        u = u.left;
      }
      return u.x;
    } else {
      let p = u.parent;
      while (p !== null) {
        if (p.left === u) {
          return p.x;
        } else {
          u = p;
          p = p.parent;
        }
      }
      return null;
    }
  }

  public nextPostOrder(x: number): number {
    let u = this.findLast(x);
    if (u === null || u.x !== x) {
      return null;
    }
    const p = u.parent;
    while (p !== null) {
      if (p.right === u || p.right === null) {
        return p.x;
      } else {
        u = p.right;
        while (u.left !== null || u.right !== null) {
          u = u.left || u.right;
        }
        return u.x;
      }
    }
    return null;
  }

  public getLE(x: number): number[] {
    let u = this.findLast(x);
    if (u === null) {
      return [];
    }

    const nums = [];
    if (u.x <= x) {
      nums.push(u.x);
    }
    nums.push(...traverse(u.left));
    let p = u.parent;
    while (p !== null) {
      if (p.right === u) {
        nums.push(p.x);
        nums.push(...traverse(p.left));
      }
      u = p;
      p = p.parent;
    }
    return nums;

    function traverse(w: Node<number>, arr: number[] = []): number[] {
      if (w !== null) {
        arr.push(w.x);
        traverse(w.left, arr);
        traverse(w.right, arr);
      }
      return arr;
    }
  }

  protected findLast(x: number): Node<number> {
    let u = this.r;
    let prev: Node<number> = null;
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

  protected addChild(p: Node<number>, w: Node<number>): boolean {
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

  protected splice(u: Node<number>): void {
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

  protected size2node(u: Node<number>): number {
    let n = 0;
    let prev: Node<number> = null;
    let next: Node<number> = null;
    let w = u;
    while (w !== null && w !== u.parent) {
      if (prev === null || prev === w.parent) {
        n++;
        if (w.left !== null) {
          next = w.left;
        } else if (w.right !== null) {
          next = w.right;
        } else {
          next = w.parent;
        }
      } else if (prev === w.left) {
        if (w.right !== null) {
          next = w.right;
        } else {
          next = w.parent;
        }
      } else {
        next = w.parent;
      }
      prev = w;
      w = next;
    }
    return n;
  }
}
