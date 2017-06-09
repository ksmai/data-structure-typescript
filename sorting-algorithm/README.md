# Sorting algorithms

## Comparison-based sorting

- sort by comparing two values `a` and `b` with `compare(a, b)`:
    - `< 0`, if `a` is less than `b`
    - `= 0`, if `a` is equal to `b`
    - `> 0`, if `a` is greater than `b`
- expected number of comparisons is at least `n log(n) - O(n)`

### mergeSort

1. split the input array `a` into two halves and recursively sort the subarrays
2. merge two sorted subarrays afterwards

- runs in `O(n log(n))` time
- performs at most `n log(n)` comparisons, the fewest among the three
- does not rely on randomization
- the auxillary array for merging can be expensive to allocate and can be a potential point of failure if memory is limited
- very useful when sorting linked list, where auxillary array is not needed

### quickSort

1. randomly choose a pivot `x` from the input array `a`
2. partition `a` into 3 sets
    1. set of elements less than `x`
    2. set of elements equal to `x`
    3. set of elements greater than `x`
3. recursively sort the first and third sets

- sorting is done in place (no copies of subarrays)
- performs at most `2n ln(n) + O(n)` comparisons
- randomized, running time not guaranteed

### heapSort

1. Convert input array into a BinaryHeap
2. Repeatedly extract the minimum value and swap it with the last value
3. Trickle the swapped last value down to get a valid heap again, repeat step 2
4. Reverse the resulting array

- also sort in place
- redefining the `compare(x, y)` function allows the heap sort algorithm to store elements directly in ascending order
- for building the heap from the input array, instead of repeatedly calling the BinaryHeap `add(x)` method in `O(n log(n)` time, we can use a "bottom-up algorithm" by trickling down, in order, the `(n/2 - 1)th`, ..., `0th` element and finish in `O(n)` time
- performs at most `2n log(n) + O(n)` time, the highest among the three

## Non-comparison based sorting

### countingSort

1. input array `a` consists of `n` integers, each in { 0, 1, ..., k - 1 }
2. use an auxillary array `c` of length `k` and count the occurrences of `i` in `c[i]`
3. compute a running sum of the counters such that `c[i]` becomes the number of elements less than or equal to `i`
4. finally scan `a` backwards and place its elements according to `c`

- runs in `O(n + k)` time
- sorting is *stable*, preserving the relative order of equal elements

### radixSort

1. split each w-bit integers into d-bit parts
2. sort the least significant `d` bits with `countingSort`, then the next significant `d` bits and so on

- performs a total of `w/d` passes of counting sort
- runs in `O((w/d)(n+2^d))` time
- assume elements are in the range `{0,...,n^c - 1}` and `d = ceil(log(n))`, it runs in `O(cn)` time
