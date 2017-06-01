import { ChainedHashTable } from "./ChainedHashTable";
import { IUSet } from "./IUSet";
import { LinearHashTable } from "./LinearHashTable";

interface USetConstructor {
  new (): IUSet<number>;
}

type TestSuite = (ctor: USetConstructor) => () => void;

const fill = (uset: IUSet<number>, n = 1000) => {
  Array(n)
    .fill(null)
    .forEach((e, i) => expect(uset.add(i)).toBe(true));
};

const remove = (uset: IUSet<number>, n = 1000) => {
  Array(n)
    .fill(null)
    .forEach((e, i) => expect(uset.remove(i)).toBe(i));
};

const test1: TestSuite = (ctor) => {
  return () => {
    const uset = new ctor();
    fill(uset, 1000);
    expect(uset.add(1000)).toBe(true);
    expect(uset.add(2)).toBe(false);
    expect(uset.add(1000)).toBe(false);
  };
};

const test2: TestSuite = (ctor) => {
  return () => {
    const uset = new ctor();
    fill(uset, 10);
    expect(uset.find(0)).toBe(0);
    expect(uset.remove(0)).toBe(0);
    expect(uset.find(0)).toBe(null);
    expect(uset.remove(0)).toBe(null);
    expect(uset.add(0)).toBe(true);
  };
};

const test3: TestSuite = (ctor) => {
  return () => {
    const uset = new ctor();
    expect(uset.find(1)).toBe(null);
    expect(uset.add(1)).toBe(true);
    expect(uset.find(1)).toBe(1);
    expect(uset.find(2)).toBe(null);
  };
};

const test4: TestSuite = (ctor) => {
  return () => {
    const uset = new ctor();
    fill(uset, 10);
    remove(uset, 10);
    fill(uset, 100);
    remove(uset, 100);
    fill(uset, 1000);
    remove(uset, 1000);
    fill(uset, 10000);
    remove(uset, 10000);
    expect(uset.find(0)).toBe(null);
    expect(uset.add(0)).toBe(true);
    expect(uset.find(0)).toBe(0);
  };
};

describe("USet common tests", () => {
  ((...ctors: USetConstructor[]) => {
    ctors.forEach((ctor) => {
      describe(ctor.name, () => {
        ((...tests: TestSuite[]) => {
          tests.forEach((test) => {
            it(test.name, test(ctor));
          });
        })(
          test1,
          test2,
          test3,
          test4,
        );
      });
    });
  })(
    ChainedHashTable,
    LinearHashTable,
  );
});
