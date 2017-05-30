import { ArrayDeque } from "./ArrayDeque";
import { ArrayStack } from "./ArrayStack";
import { ConsecutiveArrayDeque } from "./ConsecutiveArrayDeque";
import { DLList } from "./DLList";
import { DualArrayDeque } from "./DualArrayDeque";
import { IList } from "./IList";
import { RootishArrayStack } from "./RootishArrayStack";
import { SEList } from "./SEList";
import { Treque } from "./Treque";

describe("List", () => {
  describe("ArrayStack", () => {
    it("test1", test1(ArrayStack));
    it("test2", test2(ArrayStack));
    it("test3", test3(ArrayStack));
    it("test4", test4(ArrayStack));
    it("edgeCase", edgeCase(ArrayStack));
    it("addAll", testAddAll(ArrayStack));
  });
  describe("ArrayDeque", () => {
    it("test1", test1(ArrayDeque));
    it("test2", test2(ArrayDeque));
    it("test3", test3(ArrayDeque));
    it("test4", test4(ArrayDeque));
    it("edgeCase", edgeCase(ArrayDeque));
    it("addAll", testAddAll(ArrayDeque));
  });
  describe("DualArrayDeque", () => {
    it("test1", test1(DualArrayDeque));
    it("test2", test2(DualArrayDeque));
    it("test3", test3(DualArrayDeque));
    it("test4", test4(DualArrayDeque));
    it("edgeCase", edgeCase(DualArrayDeque));
    it("addAll", testAddAll(DualArrayDeque));
  });
  describe("RootishArrayStack", () => {
    it("test1", test1(RootishArrayStack));
    it("test2", test2(RootishArrayStack));
    it("test3", test3(RootishArrayStack));
    it("test4", test4(RootishArrayStack));
    it("edgeCase", edgeCase(RootishArrayStack));
    it("addAll", testAddAll(RootishArrayStack));
  });
  describe("Treque", () => {
    it("test1", test1(Treque));
    it("test2", test2(Treque));
    it("test3", test3(Treque));
    it("test4", test4(Treque));
    it("edgeCase", edgeCase(Treque));
    it("addAll", testAddAll(Treque));
  });
  describe("ConsecutiveArrayDeque", () => {
    it("test1", test1(ConsecutiveArrayDeque));
    it("test2", test2(ConsecutiveArrayDeque));
    it("test3", test3(ConsecutiveArrayDeque));
    it("test4", test4(ConsecutiveArrayDeque));
    it("edgeCase", edgeCase(ConsecutiveArrayDeque));
    it("addAll", testAddAll(ConsecutiveArrayDeque));
  });
  describe("DLList", () => {
    it("test1", test1(DLList));
    it("test2", test2(DLList));
    it("test3", test3(DLList));
    it("test4", test4(DLList));
    it("edgeCase", edgeCase(DLList));
    it("addAll", testAddAll(DLList));
  });
  describe("SEList", () => {
    it("test1", test1(SEList));
    it("test2", test2(SEList));
    it("test3", test3(SEList));
    it("test4", test4(SEList));
    it("edgeCase", edgeCase(SEList));
    it("addAll", testAddAll(SEList));
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

function push<T>(list: IList<T>, ...els: T[]): void {
  els.forEach((el) => list.add(list.size(), el));
}

function assert<T>(list: IList<T>, ...els: T[]): void {
  expect(list.size()).toEqual(els.length, "Length should match");
  els.forEach((el, i) => expect(el).toEqual(list.get(i), "Item should match"));
}
