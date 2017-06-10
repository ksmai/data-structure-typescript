import { IComparator } from "./IComparator";

function merge<T>(a: T[], c: IComparator<T>, a1: T[], a2: T[]) {
  let i1 = 0;
  let i2 = 0;
  for (let i = 0; i < a.length; i++) {
    if (i1 === a1.length) {
      a[i] = a2[i2++];
    } else if (i2 === a2.length) {
      a[i] = a1[i1++];
    } else if (c(a1[i1], a2[i2]) < 0) {
      a[i] = a1[i1++];
    } else {
      a[i] = a2[i2++];
    }
  }
}

export function mergeSort<T>(a: T[], c: IComparator<T>) {
  if (a.length <= 1) {
    return;
  }
  const m = Math.floor(a.length / 2);
  const a1 = a.slice(0, m);
  const a2 = a.slice(m);
  mergeSort<T>(a1, c);
  mergeSort<T>(a2, c);
  merge(a, c, a1, a2);
}
