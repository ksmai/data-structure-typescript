import { ISSet } from "./ISSet";
import { SkiplistSSet } from "./SkiplistSSet";
import { SkiplistWithFinger } from './SkiplistWithFinger';

type Testsuite<T> = (ctor: { new (): ISSet<T> }) => () => void;

const test1: Testsuite<number> = (ctor) => {
  return () => {
    const sset = new ctor();
    [1, 2, 3, 4, 5, 6].forEach((x) => expect(sset.add(x)).toBe(true));
    expect(sset.remove(4)).toBe(true);
    expect(sset.find(4)).toBe(5);
    expect(sset.size()).toBe(5);
  };
};

const test2: Testsuite<number> = (ctor) => {
  return () => {
    const sset = new ctor();
    [6, 5, 4, 3, 2, 1].forEach((x) => expect(sset.add(x)).toBe(true));
    expect(sset.remove(4)).toBe(true);
    expect(sset.find(4)).toBe(5);
    expect(sset.size()).toBe(5);
  };
};

const test3: Testsuite<number> = (ctor) => {
  return () => {
    const sset = new ctor();
    [6, 5, 4, 3, 2, 1].forEach((x) => expect(sset.add(x)).toBe(true));
    expect(sset.add(1)).toBe(false);
    expect(sset.find(1)).toBe(1);
    expect(sset.remove(1)).toBe(true);
    expect(sset.remove(1)).toBe(false);
    expect(sset.find(1)).toBe(2);
    expect(sset.size()).toBe(5);
  };
};

const test4: Testsuite<number> = (ctor) => {
  return () => {
    const sset = new ctor();
    [6, 5, 4, 3, 2, 1].forEach((x) => expect(sset.add(x)).toBe(true));
    expect(sset.find(1)).toBe(1);
    expect(sset.find(5)).toBe(5);
    expect(sset.find(10)).toBe(null);
    expect(sset.find(2.7)).toBe(3);
    expect(sset.find(-1)).toBe(1);
  };
};

((...ctors: Array<{ new (): ISSet<any> }>) => {
  describe("SSet common tests", () => {
    ctors.forEach((ctor) => {
      describe(ctor.name, () => {
        it("test 1", test1(ctor));
        it("test 2", test2(ctor));
        it("test 3", test3(ctor));
        it("test 4", test4(ctor));
      });
    });
  });
})(
  SkiplistSSet,
  SkiplistWithFinger,
);
