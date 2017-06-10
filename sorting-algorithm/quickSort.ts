import { IComparator } from "./IComparator";

function swap(a: any[], i: number, j: number) {
  const tmp = a[i];
  a[i] = a[j];
  a[j] = tmp;
}

export function quickSort<T>(
  a: T[],
  c: IComparator<T>,
  i = 0,
  n = a.length,
) {
  if (n <= 1) {
    return;
  }
  const x = a[i + Math.floor(Math.random() * n)];
  let p = i - 1;
  let q = i + n;
  let j = i;
  while (j < q) {
    const comp = c(a[j], x);
    if (comp < 0) {
      swap(a, j++, ++p);
    } else if (comp > 0) {
      swap(a, j, --q);
    } else {
      j++;
    }
  }
  quickSort(a, c, i, p - i + 1);
  quickSort(a, c, q, i + n - q);
}
