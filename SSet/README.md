# SSet
A `SSet` represents a set of sorted elements. It supports the following operations:

| Operation   | Description                                  |
| ----------- | -------------------------------------------- |
| `size()`    | return size of set                           |
| `add(x)`    | add `x` to the set, if it does not exist     |
| `remove(x)` | remove `x` from the set, if it exists        |
| `find(x)`   | find the first element `y` such that `y >= x`|

## SkiplistSSet

- implement `SSet` with a `Skiplist` structure in which nodes have randomized heights
- all operations `add(x)`, `remove(x)`, `find(x)` take `O(log n)` times

## BinarySearchTree (unbalanced)

- for every node `u` in the tree, every node `w` in the left subtree has `w.x < u.x` and every node `v` in the right subtree has `v.x > u.x`
- because it is unbalanced, in the worst case a `BinarySearchTree` become a `LinkedList`, and all operations take `O(n)` times

## Treap

- makes use of the fact that, if sequence of `add(x)` operations are randomized (as in `RandomizedBinarySearchTree`), the expected length of search path for any `x` is `O(log n)`
- `RandomizedBinarySearchTree` is not dynamic in that it must be constructed ahead of time in `O(n log n)` time
- `Treap` obtains the same expected search path length by assigning a random `priority` field to each node and maintaining the heap property in addition to the binary search tree property, hence its name (**Tre**e + H**eap**)
- expected time costs of `add(x)`, `remove(x)`, `find(x)` are all `O(log n)`
- `Treap` is faster than `SkiplistSSet` in practice, even though their asymptotic costs are the same

## Scapegoat tree

- when the tree is not balanced, find a "scapegoat" node `u` and rebuild the entire subtree rooted at `u` into a perfectly balanced tree
- the amortized costs of `find(x)`, `add(x)`, `remove(x)` are `O(log n)`
- it is still slower than all other `SSet` implementations including `Treap` and `SkiplistSSet`, but could be the right choice in certain situations, e.g. when some data in a node cannot be updated in constant time during a rotation operation, but can be updated in the rebuild operation
