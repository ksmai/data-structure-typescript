# USet
represents an unordered set of elements with the following operations:

| Operation         | Description                                |
| ----------------- | ------------------------------------------ |
| `size(): number`  | return number of elements in the set, `n`  |
| `add(x): boolean` | add `x` to the set, if not already present |
| `remove(x): T`    | remove `x` from the set, if it exists      |
| `find(x): T`      | return `y` from the set such that `y = x`  |

## Hash table
### ChainedHashTable

- stores an array `t` of lists (chains) of items
- `n <= t.length` so the average number of elements in any list is less than or equal to 1
- use multiplicative hashing to spread elements evenly
    - `hash(x) = ((z * x) mod 2^w) div 2^(w - d), where z is random odd integer in {1, ..., 2^w - 1} and size of hash table is 2^d`
- supports `add(x)`, `remove(x)`, `find(x)` in `O(1)` expected time per operation

### LinearHashTable

- open addressing with linear probing
- stores elements directly in an array `t`, so that each array location stores at most one value
- tries to store new element `x` at `t[hash(x)]`, and if it is already occupied, try the next location `t[(hash(x) + 1) % t.length]`, ... until there is an empty slot
- deletion sets elements to `DEL` rather than `NULL` so that we can safely stop searching once `NULL` is reached
- maintains `q = # of non-NULL values < t.length / 2` and `n > t.length / 8`
- supports `add(x)`, `remove(x)`, `find(x)` in `O(1)` expected time per operation
- uses tabulation hashing to spread elements independently and uniformly over the array
    - stores an array of random numbers indexed by the hash code of elements
    - divides the hash code into `r` `w / r`-bit integers to save space

#### Hash code
Hash code of non-integer elements should behave as follow:

- if 2 elements are not equal, their hash codes should be equal
- if 2 elements are not equal, the probability of equal hash code should be very small

##### primitive (<= w bits)
- just transform the binary representation into integer

##### primitive (> w bits)
- use one of the methods for objects

##### objects (fixed number of parts)
- use multiplicate hashing by `2w`-bit precision arithmetic
- require independent random numbers which are not quite possible with pseudo-random number generators

##### other objects
- use "polynomial over prime field"
