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

## Red black tree

- simulate 2-4 tree as a binary tree so that max height is `O(log n)`
- `add(x)`, `remove(x)`, `find(x)` run *in the worst case* in `O(log n)` time, better than SkiplistSSet, Treap, Scapegoat tree with either expected or amortized `O(log n)` time
- amortized time spent in maintaining the RedBlackTree properties below is `O(1)`
    1. **black-height** All root-to-leaf path has the same number of black nodes
    2. **no-red-edge** A red node cannot have any red children
    3. **left-leaning** For any node `u`, if `u.left` is black, `u.right` is also black (this is not an essential property of red black tree but can simplify its implementation)

## AVL Tree

- At each node `u`, the heights of `u.left` and `u.right` differ by at most one
- smaller height than red black tree
- simpler to implement

### SSet for integers

- for storing `w`-bit integers, it is possible to have a `SSet` faster than `O(log n)`

#### BinaryTrie

- encode `w-bit` integers in a binary tree
- all leaves have depth `w`
- the path for integer `x` turns left at level `i` if the `i`-th most significant bit of `x` is 0, and turns right if it is 1
- the leaves form a doubly linked list
- each node contains an additional `jump` pointer that points to:
    - largest leaf in its subtree, if right child is missing
    - smallest leaf in its subtree, if left child is missing
- supports `add(x)`, `remove(x)`, `find(x)` in `O(w)` time, which is not impressive since `log n <= w`
- space usage is `O(nw)`

#### XFastTrie

- store all nodes at level `i` in a `BinaryTrie` in the hash table `t[i]`, resulting in `w + 1` hash tables
- perform binary search to locate the node `u` which is the end of the search path for `x`
- speed up `find(x)` to `O(log w)` expected time per operation
- cost of `add(x)`, `remove(x)`, and memory usage remains the same

#### YFastTrie

- store each element in a `XFastTrie` with probably `1/w`
- each element `xi` in the `XFastTrie` is associated with a `Treap` `ti` that stores all values in the range `[x(i-1) + 1, xi]`
- each `Treap` store `O(w)` elements, so every operation of a `YFastTrie` runs in `O(log w)` expected time per operation
- space used is `O(n + w)`, because the value `2^w - 1` is always stored in the `XFastTrie` for simplifying implementation

### Data structure in external memory searching

- when a data structure is too large to be stored in internal memory completely, some *external memory* has to be used
- external memory has much slower access time than internal memory, and must be accessed in *blocks* of `B` words
- in *external memory model* (as opposed to *word-RAM model*), transferring a block between internal and external memory takes *constant* time, while computations in internal memory are *free*

#### B-trees

- generalization of binary trees and 2-4 trees (B = 2)
- efficient in *external memory model* (`B` is chosen so that each node fits in an external memory block)
- all leaves have the same depth
- any non-root internal node has at least `B` children and at most `2B` children
- root node can have between `2` and `2B` children
- implies that height of a `B-tree` with `l` leaves is `log l` (base `B`)
- each internal node with `k` children stores `k - 1` sorted keys
- every leaf node can have between `B - 1` and `2B - 1` keys
- for any internal node `u`, `u.keys[i]` is larger than every key stored in the subtree rooted at `u.children[i]` but smaller than every key stored in the subtree rooted at `u.children[i + 1]`,
- in external memory model, `add(x)`, `remove(x)`, `find(x)` take `O(logB(n))` time
- in word-RAM model, `add(x)`, `remove(x)`, `find(x)` take `O(log2(n) + B)` time
