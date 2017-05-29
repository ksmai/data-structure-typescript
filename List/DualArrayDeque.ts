import { IList } from './IList';
import { ArrayStack } from './ArrayStack';

export class DualArrayDeque<T> implements IList<T> {
  protected front: ArrayStack<T> = new ArrayStack<T>();
  protected back: ArrayStack<T> = new ArrayStack<T>();

  public size(): number {
    return this.front.size() + this.back.size();
  }

  public get(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.size() - 1) {
      throw new Error("Array index out of bound!");
    }
    if (i < this.front.size()) {
      return this.front.get(this.front.size() - 1 - i);
    } else {
      return this.back.get(i - this.front.size());
    }
  }

  public set(i: number, x: T): T {
    i = Math.floor(i);
    if (i < 0 || i > this.size() - 1) {
      throw new Error("Array index out of bound!");
    }
    if (i < this.front.size()) {
      return this.front.set(this.front.size() - 1 - i, x);
    } else {
      return this.back.set(i - this.front.size(), x);
    }
  }

  public add(i: number, x: T): void {
    i = Math.floor(i);
    if (i < 0 || i > this.size()) {
      throw new Error("Array index out of bound!");
    }
    if (i < this.front.size()) {
      this.front.add(this.front.size() - i, x);
    } else {
      this.back.add(i - this.front.size(), x);
    }
    this.balance();
  }

  public remove(i: number): T {
    i = Math.floor(i);
    if (i < 0 || i > this.size() - 1) {
      throw new Error("Array index out of bound!");
    }
    let x: T;
    if (i < this.front.size()) {
      x = this.front.remove(this.front.size() - 1 - i);
    } else {
      x = this.back.remove(i - this.front.size());
    }
    this.balance();
    return x;
  }

  protected balance(): void {
    if (this.size() < 3) {
      return;
    }
    const newFront = new ArrayStack<T>();
    const newBack = new ArrayStack<T>();
    if (this.front.size() * 3 < this.back.size()) {
      const extras = this.size() / 2 - this.front.size();
      for (let j = extras - 1; j >= 0; j--) {
        newFront.add(newFront.size(), this.back.get(j));
      }
      for (let j = 0; j < this.front.size(); j++) {
        newFront.add(newFront.size(), this.front.get(j));
      }
      for (let j = 0; j < this.back.size() - extras; j++) {
        newBack.add(newBack.size(), this.back.get(extras + j));
      }
    } else if (this.back.size() * 3 < this.front.size()) {
      const extras = this.front.size() - this.size() / 2;
      for (let j = 0; j < extras; j++) {
        newBack.add(newBack.size(), this.front.get(extras - j - 1));
      }
      for (let j = 0; j < this.back.size(); j++) {
        newBack.add(newBack.size(), this.back.get(j));
      }
      for (let j = 0; j < this.front.size() - extras; j++) {
        newFront.add(newFront.size(), this.front.get(extras + j));
      }
    } else {
      return;
    }
    this.front = newFront;
    this.back = newBack;
  }
}
