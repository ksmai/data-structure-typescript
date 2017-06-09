import { ISort } from './ISort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';
import { heapSort } from './heapSort';

interface TestSuite {
  (fn: ISort<number>): () => void;
}

function numberComparator(a: number, b: number) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

const test1: TestSuite = (fn) => {
  return () => {
    const arr = [1, 7, 6, 5, 2, 3, 8, 4];
    const sorted = [1, 2, 3, 4, 5, 6, 7, 8];
    fn(arr, numberComparator);
    expect(arr).toEqual(sorted);
  };
};

const test2: TestSuite = (fn) => {
  return () => {
    const arr = '556611337722441274653'.split('').map(Number);
    const sorted = arr.slice().sort(numberComparator);
    fn(arr, numberComparator);
    expect(arr).toEqual(sorted);
  };
};

const test3: TestSuite = (fn) => {
  return () => {
    const arr = Array(168)
      .fill(0)
      .map((e, i) => Math.floor(Math.random() * 1000));
    const sorted = arr.slice().sort(numberComparator);
    fn(arr, numberComparator);
    expect(arr).toEqual(sorted);
  };
};

describe('SortingAlgorithm', () => {
  ((...fns: ISort<number>[]) => {
    fns.forEach((fn) => {
      describe((fn as any).name, () => {
        ((...tests) => {
          tests.forEach((test, i) => {
            it(`Test #${i}`, test(fn));
          });
        })(
          test1,
          test2,
          test3,
        );
      });
    });
  })(
    mergeSort,
    quickSort,
    heapSort,
  );
});
