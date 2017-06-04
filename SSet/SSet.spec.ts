import { BinarySearchTree } from "./BinarySearchTree";
import { ISSet } from "./ISSet";
import { SkiplistSSet } from "./SkiplistSSet";
import { SkiplistWithFinger } from "./SkiplistWithFinger";
import { Treap } from "./Treap";

type Testsuite<T> = (ctor: { new (): ISSet<T> }) => () => void;

const test1: Testsuite<number> = (ctor) => {
  return () => {
    const sset = new ctor();
    [1, 2, 3, 4, 5, 6].forEach((x) => expect(sset.add(x)).toBe(true));
    expect(sset.remove(4)).toBe(true);
    expect(sset.find(4)).toBe(5);
    expect(sset.size()).toBe(5);
  };
};

const test2: Testsuite<number> = (ctor) => {
  return () => {
    const sset = new ctor();
    [6, 5, 4, 3, 2, 1].forEach((x) => expect(sset.add(x)).toBe(true));
    expect(sset.remove(4)).toBe(true);
    expect(sset.find(4)).toBe(5);
    expect(sset.size()).toBe(5);
  };
};

const test3: Testsuite<number> = (ctor) => {
  return () => {
    const sset = new ctor();
    [6, 5, 4, 3, 2, 1].forEach((x) => expect(sset.add(x)).toBe(true));
    expect(sset.add(1)).toBe(false);
    expect(sset.find(1)).toBe(1);
    expect(sset.remove(1)).toBe(true);
    expect(sset.remove(1)).toBe(false);
    expect(sset.find(1)).toBe(2);
    expect(sset.size()).toBe(5);
  };
};

const test4: Testsuite<number> = (ctor) => {
  return () => {
    const sset = new ctor();
    [6, 5, 4, 3, 2, 1].forEach((x) => expect(sset.add(x)).toBe(true));
    expect(sset.find(1)).toBe(1);
    expect(sset.find(5)).toBe(5);
    expect(sset.find(10)).toBe(null);
    expect(sset.find(2.7)).toBe(3);
    expect(sset.find(-1)).toBe(1);
  };
};

((...ctors: Array<{ new (): ISSet<any> }>) => {
  describe("SSet common tests", () => {
    ctors.forEach((ctor) => {
      describe(ctor.name, () => {
        it("test 1", test1(ctor));
        it("test 2", test2(ctor));
        it("test 3", test3(ctor));
        it("test 4", test4(ctor));
      });
    });
  });
})(
  SkiplistSSet,
  SkiplistWithFinger,
  BinarySearchTree,
  Treap,
);

describe("BinarySearchTree specifics", () => {
  let tree: BinarySearchTree;

  beforeEach(() => {
    tree = new BinarySearchTree();
    [7, 3, 11, 1, 5, 9, 13, 4, 6, 8, 12, 14].forEach((num) => {
      expect(tree.add(num)).toBe(true);
    });
  });

  it("size2", () => {
    expect(tree.size2(7)).toBe(tree.size());
    expect(tree.size2(11)).toBe(6);
    expect(tree.size2(8)).toBe(1);
    expect(tree.size2(9)).toBe(2);
  });

  it("height2", () => {
    expect(tree.height2(7)).toBe(3);
    expect(tree.height2(11)).toBe(2);
    expect(tree.height2(8)).toBe(0);
    expect(tree.height2(9)).toBe(1);
  });

  it("isBalanced", () => {
    expect(tree.isBalanced()).toBe(false);
    tree.remove(4);
    expect(tree.isBalanced()).toBe(false);
    tree.remove(13);
    expect(tree.isBalanced()).toBe(true);
  });

  it("preOrderNumber", () => {
    const root = tree.preOrderNumber();
    expect(root.preorder).toBe(0);
    expect(root.left.preorder).toBe(1);
    expect(root.left.right.right.preorder).toBe(5);
    expect(root.right.left.preorder).toBe(7);
  });

  it("inOrderNumber", () => {
    const root = tree.inOrderNumber();
    expect(root.inorder).toBe(5);
    expect(root.left.inorder).toBe(1);
    expect(root.left.right.right.inorder).toBe(4);
    expect(root.right.left.inorder).toBe(7);
  });

  it("postOrderNumber", () => {
    const root = tree.postOrderNumber();
    expect(root.postorder).toBe(11);
    expect(root.left.postorder).toBe(4);
    expect(root.left.right.right.postorder).toBe(2);
    expect(root.right.left.postorder).toBe(6);
  });

  it("nextPreOrder", () => {
    expect(tree.nextPreOrder(7)).toBe(3);
    tree.remove(4);
    expect(tree.nextPreOrder(5)).toBe(6);
    expect(tree.nextPreOrder(8)).toBe(13);
    expect(tree.nextPreOrder(14)).toBe(null);
  });

  it("nextInOrder", () => {
    expect(tree.nextInOrder(3)).toBe(4);
    expect(tree.nextInOrder(9)).toBe(11);
    expect(tree.nextInOrder(6)).toBe(7);
    expect(tree.nextInOrder(14)).toBe(null);
  });

  it("nextPostOrder", () => {
    expect(tree.nextPostOrder(1)).toBe(4);
    expect(tree.nextPostOrder(5)).toBe(3);
    expect(tree.nextPostOrder(8)).toBe(9);
    expect(tree.nextPostOrder(7)).toBe(null);
  });

  it("getLE", () => {
    expect(tree.getLE(3)).toEqual(jasmine.arrayContaining([1, 3]) as any);
    expect(tree.getLE(3.5)).toEqual(jasmine.arrayContaining([1, 3]) as any);
    expect(tree.getLE(4.5))
      .toEqual(jasmine.arrayContaining([1, 3, 4]) as any);
    expect(tree.getLE(4))
      .toEqual(jasmine.arrayContaining([1, 3, 4]) as any);
    expect(tree.getLE(9))
      .toEqual(jasmine.arrayContaining([1, 3, 4, 5, 6, 7, 8, 9]) as any);
    expect(tree.getLE(1)).toEqual(jasmine.arrayContaining([1]) as any);
  });
});
