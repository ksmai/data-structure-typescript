# Queue
A queue is a collection of elements to which we can add new elements and remove the next element. The Queue's *queueing discipline* (e.g. FIFO, LIFO, priority) decides which element to be removed.

| `add(x)` | add `x` to the `Queue` |
| `remove()` | remove the next (previously added) value from the Queue and return it |

## Priority Queue
Always remove the smallest element from the Queue

### BinaryHeap

- Store a binary tree in an array, in breadth-first ordering
- For a node at index `i`
    - `left(i) = 2 * i + 1`
    - `right(i) = 2 * i + 2`
    - `parent(i) = (i - 1) / 2`
- Any node is not smaller than its parent, so the root contains the smallest element in the heap
- Since it is a complete binary tree, `h <= log(n)` and every operation runs in `O(log n)`
- Very fast implementation for heapsort

## DaryHeap

- generalization of `BinaryHeap` where each node has at most `d` children

### MeldableHeap

- Store elements in a binary tree of arbitrary shape
- All operations are based on the `merge(h1, h2)` operation that takes `O(log n)` expected time
- Support combining heaps efficiently
