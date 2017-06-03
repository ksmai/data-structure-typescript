# SSet
A `SSet` represents a set of sorted elements. It supports the following operations:

| Operation   | Description                                  |
| ----------- | -------------------------------------------- |
| `size()`    | return size of set                           |
| `add(x)`    | add `x` to the set, if it does not exist     |
| `remove(x)` | remove `x` from the set, if it exists        |
| `find(x)`   | find the first element `y` such that `y >= x` |

## SkiplistSSet

- implement `SSet` with a `Skiplist` structure in which nodes have randomized heights
- all operations `add(x)`, `remove(x)`, `find(x)` take `O(log n)` times

## BinarySearchTree (unbalanced)

- for every node `u` in the tree, every node `w` in the left subtree has `w.x < u.x` and every node `v` in the right subtree has `v.x > u.x`
- because it is unbalanced, in the worst case a `BinarySearchTree` become a `LinkedList`, and all operations take `O(n)` times
