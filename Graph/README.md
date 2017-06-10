# Graph

## Definition

- a graph `G` is the pair `(V, E)` where `V` is the set of *vertices* and `E` is the set of *edges*
- an edge `(i, j)` is an ordered pair of vertices *directed* from *i* (source) to *j* (target)
- a path in `G` is a sequence of vertices `v0,...,vk` such that for every `i` in `{1,...k}`, the edge `(vi-1, vi)` is in `E`
    - this path is a cycle if, additionally, `(vk, v0)` is in `E`
- a path or cycle is simple if all vertices are unique
- `vj` is *reachable* from `vi` if there exists a path from `vi` to `vj`

## Application

- Computer networks
- Street maps
- Timetable conflict graphs
- any other pairwise relationships within a set

## Typical operations

| `addEdge(i, j)`    | add the edge `(i, j)` to `E`                      |
| `removeEdge(i, j)` | remove the edge `(i, j)` from `E`                 |
| `hasEdge(i, j)`    | check if edge `(i, j)` is in `E`                  |
| `outEdges(i)`      | returns a list of all `j` such that `(i, j) in E` |
| `inEdges(i)`       | returns a list of all `j` such that `(j, i) in E` |

## Representation

### AdjacencyMatrix

- represents an `n`-vertex graph by a `n x n` matrix `a` such that
    - `a[i][j] = true` if `(i, j) in E`
    - `a[i][j] = false` otherwise
- `addEdge(i, j)`, `removeEdge(i, j)`, `hasEdge(i, j)` run in constant time
- `inEdges(i)`, `outEdges(i)` run in `O(n)` time
- memory usage is `O(n^2)`, acceptable when the graph is *dense* (`m` close to `n^2`)
- allow algebric operations on matrix `a` to efficiently compute some properties of `G`, for example
    - `a^2 [i][j]` counts the number of paths from `i` to `j` that have exactly length of 2

### AdjacencyLists

- represents `G` as an array of lists `adj` such that `a[i]` contains a list of all vertices adjacent to vertix `i`
- `addEdge(i, j)` takes `O(1)` time
- `removeEdge(i, j)` and `hasEdge(i, j)` run in `O(deg(i))` time
- `outEdges(i)` takes constant time
- `inEdges(i)` takes `O(n + m)` time, where `m` is the number of edges
- space usage is `O(n + m)`
- `inEdges(i)`'s performance can be improved by storing another adjacency list

## Traversal
*Assume AdjacencyLists is being used in this section*

### Breadth-first search

- start and visit some vertex `i`, then neighbours of `i`, then neighbours of neighbours of `i`, and so on
- visit all nodes in increasing order of distance from `i`
- can be used to compute shortest path from `i` to other vertices
- run in `O(n' + m')`, where `n'` is the number of nodes reachable from the starting node and `m'` is the number of edges with these nodes as source

### Depth-first search

- similar to traversing binary tree (fully explores one subtree first)
- can be used for cycle detection
- run in `O(n' + m')`, where `n'` is the number of nodes reachable from the starting node and `m'` is the number of edges with these nodes as source
