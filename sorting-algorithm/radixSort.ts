const w = 32;

/* tslint:disable no-bitwise */
export function radixSort(a: number[], d: number) {
  for(let p = 0; p < w / d; p++) {
    const b = a.slice();
    const c = Array(1 << d).fill(0);
    for (let i = 0; i < b.length; i++) {
      c[(b[i] >>> (p * d)) & ((1 << d) - 1)]++;
    }
    for (let i = 0; i < (1 << d) - 1; i++) {
      c[i + 1] += c[i];
    }
    for (let i = b.length - 1; i >= 0; i--) {
      a[--c[(b[i] >>> (p * d)) & ((1 << d) - 1)]] = b[i];
    }
  }
}
