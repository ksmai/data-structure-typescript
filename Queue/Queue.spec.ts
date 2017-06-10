import { BinaryHeap } from "./BinaryHeap";
import { DaryHeap } from "./DaryHeap";
import { IQueue } from "./IQueue";
import { MeldableHeap } from "./MeldableHeap";

interface IQueueConstructor {
  new (): IQueue<number>;
}

type TestSuite = (ctor: IQueueConstructor) => () => void;

type TestData = number[];

type TestSuiteGenerator = (data: TestData) => TestSuite;

const priorityQueueTestGenerator: TestSuiteGenerator = (elems) => {
  return (ctor) => {
    return () => {
      const queue = new ctor();
      expect(queue.remove()).toBe(null);
      elems.forEach((e) => expect(queue.add(e)).toBe(true));
      elems
        .slice()
        .sort((a, b) => a < b ? -1 : 1)
        .forEach((e) => expect(queue.remove()).toBe(e));
      expect(queue.remove()).toBe(null);
    };
  };
};

const priorityTest1 = priorityQueueTestGenerator([4, 55, 93, 9, 8, 69, 32, 17, 26, 16, 19, 50]);
const priorityTest2 = priorityQueueTestGenerator(
  (Array(100) as number[]).fill(0).map(() => Math.random()),
);

describe("PriorityQueue commons", () => {
  ((...ctors: IQueueConstructor[]) => {
    ctors.forEach((ctor) => {
      describe((ctor as any).name, () => {
        ((...suites: TestSuite[]) => {
          suites.forEach((suite, i) => {
            it(`test${i}`, suite(ctor));
          });
        })(
          priorityTest1,
          priorityTest2,
        );
      });
    });
  })(
    BinaryHeap,
    MeldableHeap,
    DaryHeap,
  );
});

describe("BinaryHeap specifics", () => {
  it("remove(i)", () => {
    const q = new BinaryHeap();
    q.add(1);
    q.add(2);
    q.add(3);
    expect(q.removeIndex(1)).toBe(2);
    expect(q.removeIndex(1)).toBe(3);
  });
});
