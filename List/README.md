# List

A `List` represents a linear sequence of values and supports the following operations:

1. `size()`: return the length of the list
2. `get(i)`: return the `i`-th value
3. `set(i, x)`: set the `i`-th value to equal `x`
4. `add(i, x)`: add `x` at position `i`, displacing all the values that follow
5. `remove(i)`: remove the `i`-th value, displacing all the values that follow

Note that these operations are sufficient to implement a `Deque`, and therefore `Stack` and `FIFO Queue`:

|-------------|-------|----------|------------------|
|Deque        |Stack  |Queue     |List              |
|=============|=======|==========|==================|
|addFirst(x)  |       |          |add(0, x)         |
|removeFirst()|       |dequeue() |remove(0)         |
|addLast(x)   |push(x)|enqueue(x)|add(size(), x)    |
|removeLast() |pop()  |          |remove(size() - 1)|
|-------------|-------|----------|------------------|

## Array-based list

### ArrayStack

Stores the i-th list item in a[i]. It can efficiently operates as a stack with `add(n, x)` and `remove(n - 1)`, hence the name.

|---------|------------|-----------------------------|
|Operation|Cost        |Remark                       |
|=========|============|=============================|
|get(i)   |O(1)        |Constant time access of array|
|set(i, x)|O(1)        |Constant time access of array|
|add(i, x)|O(n - i + 1)|Shifting array               |
|remove(i)|O(n - i)    |Shifting array               |
|---------|------------|-----------------------------|

Note that the backing array `a` needs to be resized to be double the number of items `n` in the list, when the list is full while adding, or when the list is less than 1/3 full while removing. However, it can be shown that starting from an empty ArrayStack, a sequence of m >= 1 operations of add/remove spend O(m) time in resizing array. So the amortized cost of resizing remains constant for each operation.

An `ArrayStack` can be further optimized by replacing for loops in copying array elements with efficient memory block copying functions like `memcpy(d,s,n)` in C or `System.arraycopy(s,i,d,j,n)` in Java.

### ArrayDeque
Use a circular array for efficient addition and removal at both ends of the list. When adding or removing elements, it shifts the end with less elements to reduce the number of copying operations.

|---------|--------------------|-----------------------------|
|Operation|Cost                |Remark                       |
|=========|====================|=============================|
|get(i)   |O(1)                |Constant time access of array|
|set(i, x)|O(1)                |Constant time access of array|
|add(i, x)|O(1 + min{i, n - 1})|Shifting the shorter side    |
|remove(i)|O(1 + min{i, n - 1})|Shifting the shorter side    |
|---------|--------------------|-----------------------------|

### DualArrayDeque
Uses two ArrayStacks to implement ArrayDeque with the same performance bounds.

### RootishArrayStack
A space-efficient ArrayStack. Previous data structures can have at most 2/3 of the backing array wasted, while RootishArrayStack wastes only O(sqrt(n)) array slots. It stores items in blocks, where the b-th blocks hold (b + 1) elements and there can be at most one block that is completely empty at any given time.