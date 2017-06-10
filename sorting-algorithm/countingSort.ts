export function countingSort(a: number[], k: number) {
  const c = Array(k).fill(0);
  const b = a.slice();
  for (let i = 0; i < b.length; i++) {
    c[b[i]]++;
  }
  for (let i = 0; i < k - 1; i++) {
    c[i + 1] += c[i];
  }
  for (let i = b.length - 1; i >= 0; i--) {
    a[--c[b[i]]] = b[i];
  }
}
