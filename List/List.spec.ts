import { ArrayDeque } from "./ArrayDeque";
import { ArrayStack } from "./ArrayStack";
import { ConsecutiveArrayDeque } from "./ConsecutiveArrayDeque";
import { DLList } from "./DLList";
import { DualArrayDeque } from "./DualArrayDeque";
import { IList } from "./IList";
import { RootishArrayStack } from "./RootishArrayStack";
import { SEList } from "./SEList";
import { SkiplistList } from "./SkiplistList";
import { SLList } from "./SLList";
import { Treque } from "./Treque";

((...Lists: Array<IListConstructor<any>>) => {
  describe("Common List tests", () => {
    Lists.forEach((List) => {
      describe(List.name, () => {
        it("test1", test1(List));
        it("test2", test2(List));
        it("test3", test3(List));
        it("test4", test4(List));
        it("edgeCase", edgeCase(List));
        it("addAll", testAddAll(List));
      });
    });
  });
})(
  ArrayStack,
  ArrayDeque,
  DualArrayDeque,
  RootishArrayStack,
  Treque,
  ConsecutiveArrayDeque,
  DLList,
  SEList,
  SLList,
  SkiplistList,
);

describe("Specifics", () => {
  describe("DLList", () => {
    it("isPalindrome", isPalindromeDLList(DLList));
    it("rotate", rotateDLList(DLList));
    it("truncate", truncateDLList(DLList));
    it("absorb", absorbDLList(DLList));
    it("deal", dealDLList(DLList));
    it("reverse", reverseDLList(DLList));
  });
  describe("SLList", () => {
    it("SLList specifics", testSLList(SLList));
  });
});

interface IListConstructor<T> {
  new (): IList<T>;
}

function test1(ctor: IListConstructor<string>) {
  return () => {
    const list = new ctor();
    push(list, "b", "r", "e", "d");
    list.add(2, "e");
    list.add(5, "r");
    list.add(5, "e");
    list.remove(4);
    list.remove(4);
    list.remove(4);
    list.set(2, "i");
    assert(list, "b", "r", "i", "e");
  };
}

function test2(ctor: IListConstructor<string>) {
  return () => {
    const list = new ctor();
    push(list, "a", "b", "c", "d", "e", "f", "g", "h");
    list.remove(2);
    list.add(4, "x");
    list.add(3, "y");
    list.add(4, "z");
    assert(list, "a", "b", "d", "y", "z", "e", "x", "f", "g", "h");
  };
}

function test3(ctor: IListConstructor<string>) {
  return () => {
    const list = new ctor();
    push(list, "a", "b", "c", "d");
    list.add(3, "x");
    list.add(4, "y");
    list.remove(0);
    assert(list, "b", "c", "x", "y", "d");
  };
}

function test4(ctor: IListConstructor<string>) {
  return () => {
    const list = new ctor();
    push(list, "a", "b", "c", "d", "e", "f", "g", "h");
    list.add(2, "x");
    list.remove(1);
    list.remove(7);
    list.remove(6);
    assert(list, "a", "x", "c", "d", "e", "f");
  };
}

function edgeCase(ctor: IListConstructor<string>) {
  return () => {
    const list = new ctor();
    push(list, "a", "b", "c", "d", "e", "f", "g", "h");
    Array(8)
      .fill(null)
      .map((e: any, i: number) => i)
      .reverse()
      .forEach((i) => list.remove(i));
    assert(list);
  };
}

function testAddAll(ctor: IListConstructor<number>) {
  return () => {
    const list = new ctor();
    push(list, 0, 1, 2, 7, 8, 9);
    list.addAll(3, 3, 4, 5, 6);
    assert(list, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
  };
}

function testSLList(ctor: { new (): SLList<number> }) {
  return () => {
    const list = new ctor();
    list.addAll(0, 1, 2, 3, 4, 5);
    expect(list.secondLast().x).toEqual(4);
    list.reverse();
    expect(list.secondLast().x).toEqual(2);
    assert(list, 5, 4, 3, 2, 1);
  };
}

function isPalindromeDLList(ctor: { new (): DLList<number> }) {
  return () => {
    const list = new ctor();
    list.addAll(0, 0, 1, 2, 1, 0);
    expect(list.isPalindrome()).toBe(true);
    list.remove(0);
    list.remove(0);
    expect(list.isPalindrome()).toBe(false);
    list.addAll(0, 0, 1, 2);
    expect(list.isPalindrome()).toBe(true);
  };
}

function rotateDLList(ctor: { new (): DLList<number> }) {
  return () => {
    const list = new ctor();
    list.addAll(0, 0, 1, 2, 3, 4);
    list.rotate(2);
    assert(list, 3, 4, 0, 1, 2);
    list.rotate(3);
    assert(list, 0, 1, 2, 3, 4);
  };
}

function truncateDLList(ctor: { new (): DLList<number> }) {
  return () => {
    const list = new ctor();
    list.addAll(0, 0, 1, 2, 3, 4);
    const l2 = list.truncate(4);
    assert(list, 0, 1, 2, 3);
    assert(l2, 4);
    const l3 = list.truncate(1);
    assert(list, 0);
    assert(l3, 1, 2, 3);
  };
}

function absorbDLList(ctor: { new (): DLList<number> }) {
  return () => {
    const l1 = new ctor();
    const l2 = new ctor();
    push(l1, 1, 2, 3);
    push(l2, 4, 5, 6);
    l1.absorb(l2);
    assert(l1, 1, 2, 3, 4, 5, 6);
    assert(l2);
  };
}

function dealDLList(ctor: { new (): DLList<number> }) {
  return () => {
    const l1 = new ctor();
    push(l1, 1, 2, 3, 4, 5, 6);
    const l2 = l1.deal();
    assert(l1, 1, 3, 5);
    assert(l2, 2, 4, 6);
  };
}

function reverseDLList(ctor: { new (): DLList<number> }) {
  return () => {
    const list = new ctor();
    push(list, 1, 2, 3, 4, 5);
    list.reverse();
    assert(list, 5, 4, 3, 2, 1);
  };
}

function push<T>(list: IList<T>, ...els: T[]): void {
  els.forEach((el) => list.add(list.size(), el));
}

function assert<T>(list: IList<T>, ...els: T[]): void {
  expect(list.size()).toEqual(els.length, "Length should match");
  els.forEach((el, i) => expect(el).toEqual(list.get(i), "Item should match"));
}
