import { IComparator } from './IComparator';

function swap(a: any[], i: number, j: number) {
  const tmp = a[i];
  a[i] = a[j];
  a[j] = tmp;
}

function trickleDown<T>(a: T[], c: IComparator<T>, i: number, n: number) {
  do {
    let j = -1;
    const l = 2 * i + 1;
    const r = l + 1;
    if (r < n && c(a[r], a[i]) < 0) {
      if (c(a[l], a[r]) < 0) {
        j = l;
      } else {
        j = r;
      }
    } else if (l < n && c(a[l], a[i]) < 0) {
      j = l;
    }
    if (j >= 0) {
      swap(a, i, j);
    }
    i = j;
  } while (i >= 0);
}

export function heapSort<T>(a: T[], c: IComparator<T>) {
  // build the heap in O(n) time
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
    trickleDown<T>(a, c, i, a.length);
  }

  let n = a.length;
  while (n > 1) {
    swap(a, 0, --n);
    trickleDown<T>(a, c, 0, n);
  }

  a.reverse();
}
