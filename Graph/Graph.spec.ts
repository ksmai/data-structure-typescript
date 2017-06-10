import { AdjacencyLists } from "./AdjacencyLists";
import { AdjacencyMatrix } from "./AdjacencyMatrix";
import { IGraph } from "./IGraph";

interface IGraphConstuctor {
  new (n: number): IGraph;
}

describe("Graph", () => {
  ((...Graphs: IGraphConstuctor[]) => {
    Graphs.forEach((Graph) => {
      it("test1", () => {
        const graph = createGraph1(Graph);
        expect(graph.hasEdge(2, 5)).toBe(false);
        expect(graph.hasEdge(5, 2)).toBe(true);
        graph.removeEdge(5, 2);
        expect(graph.hasEdge(5, 2)).toBe(false);

        expect(graph.hasEdge(3, 6)).toBe(false);
        graph.addEdge(3, 6);
        expect(graph.hasEdge(3, 6)).toBe(true);
      });

      it("test2", () => {
        const g = createGraph2(Graph);
        expect(g.hasEdge(0, 2)).toBe(true);
        expect(g.hasEdge(2, 0)).toBe(true);

        g.removeEdge(0, 2);
        g.removeEdge(0, 2);
        expect(g.hasEdge(0, 2)).toBe(false);
        expect(g.hasEdge(2, 0)).toBe(true);

        g.removeEdge(2, 0);
        g.removeEdge(2, 0);
        expect(g.hasEdge(0, 2)).toBe(false);
        expect(g.hasEdge(2, 0)).toBe(false);

        g.addEdge(2, 0);
        g.addEdge(2, 0);
        expect(g.hasEdge(0, 2)).toBe(false);
        expect(g.hasEdge(2, 0)).toBe(true);
      });

      it("test3", () => {
        const g = createGraph2(Graph);
        expect(g.inEdges(6)).toEqual([1, 5, 7]);
        expect(g.outEdges(0)).toEqual([2, 3, 5]);
      });

      it("test4", () => {
        const g = createGraph1(Graph);
        expect(g.inEdges(5)).toEqual([1, 4, 6, 9]);
        expect(g.outEdges(5)).toEqual([1, 2, 4, 6, 9]);
        expect(g.inEdges(9)).toEqual([5, 8, 10]);
        expect(g.outEdges(9)).toEqual([5, 8, 10]);
        g.removeEdge(5, 9);
        expect(g.inEdges(5)).toEqual([1, 4, 6, 9]);
        expect(g.outEdges(5)).toEqual([1, 2, 4, 6]);
        expect(g.inEdges(9)).toEqual([8, 10]);
        expect(g.outEdges(9)).toEqual([5, 8, 10]);

        expect(g.inEdges(3)).toEqual([2, 7]);
        expect(g.outEdges(3)).toEqual([2, 7]);
        g.addEdge(3, 5);
        expect(g.inEdges(3)).toEqual([2, 7]);
        expect(g.outEdges(3)).toContain(5);
        expect(g.inEdges(5)).toEqual([1, 3, 4, 6, 9]);
        expect(g.outEdges(5)).toEqual([1, 2, 4, 6]);
      });
    });
  })(
    AdjacencyMatrix,
    AdjacencyLists,
  );
});

describe("Breadth-first search", () => {
  it("graph1", () => {
    const g = createGraph1(AdjacencyLists);
    expect(g.bfs(0)).toEqual([0, 1, 4, 2, 5, 6, 8, 3, 9, 7, 10, 11]);
    expect(g.bfs(5)).toEqual([5, 1, 2, 4, 6, 9, 0, 3, 8, 7, 10, 11]);
  });

  it("graph2", () => {
    const g = createGraph2(AdjacencyLists);
    expect(g.bfs(0)).toEqual([0, 2, 3, 5, 4, 7, 1, 8, 6, 9]);
    expect(g.bfs(7)).toEqual([7, 2, 6, 8, 0, 4, 1, 5, 3, 9]);
  });
});

describe("Depth-first search", () => {
  it("graph1", () => {
    const g = createGraph1(AdjacencyLists);
    expect(g.dfs(0)).toEqual([0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11]);
    expect(g.dfs(5)).toEqual([5, 1, 0, 4, 8, 9, 10, 6, 2, 3, 7, 11]);
    for (let i = 0; i < 12; i++) {
      expect(g.dfs(i)).toEqual(g.dfs2(i));
    }
  });

  it("graph2", () => {
    const g = createGraph2(AdjacencyLists);
    expect(g.dfs(0)).toEqual([0, 2, 4, 1, 3, 8, 7, 6, 5, 9]);
    expect(g.dfs(3)).toEqual([3, 0, 2, 4, 1, 6, 5, 9, 8, 7]);
    for (let i = 0; i < 10; i++) {
      expect(g.dfs(i)).toEqual(g.dfs2(i));
    }
  });
});

describe("sink", () => {
  it("should return null if no sink", () => {
    const g = createGraph1(AdjacencyMatrix) as AdjacencyMatrix;
    expect(g.sink()).toBe(null);
  });

  it("should return the sink", () => {
    const g = new AdjacencyMatrix(3);
    g.addEdge(0, 2);
    g.addEdge(1, 2);
    expect(g.sink()).toBe(2);
  });
});

function createGraph1(ctor: IGraphConstuctor): IGraph {
  const graph = new ctor(12);
  addAllEdges(graph, 0, 1, 4);
  addAllEdges(graph, 1, 0, 2, 5, 6);
  addAllEdges(graph, 2, 1, 3, 6);
  addAllEdges(graph, 3, 2, 7);
  addAllEdges(graph, 4, 0, 5, 8);
  addAllEdges(graph, 5, 1, 2, 4, 6, 9);
  addAllEdges(graph, 6, 2, 5, 7, 10);
  addAllEdges(graph, 7, 3, 6, 11);
  addAllEdges(graph, 8, 4, 9);
  addAllEdges(graph, 9, 5, 8, 10);
  addAllEdges(graph, 10, 6, 9, 11);
  addAllEdges(graph, 11, 7, 10);
  return graph;
}

function createGraph2(ctor: IGraphConstuctor): IGraph {
  const graph = new ctor(10);
  addAllEdges(graph, 0, 2, 3, 5);
  addAllEdges(graph, 1, 3, 4, 6);
  addAllEdges(graph, 2, 0, 4, 7);
  addAllEdges(graph, 3, 0, 1, 8);
  addAllEdges(graph, 4, 1, 2, 9);
  addAllEdges(graph, 5, 0, 6, 9);
  addAllEdges(graph, 6, 1, 5, 7);
  addAllEdges(graph, 7, 2, 6, 8);
  addAllEdges(graph, 8, 3, 7, 9);
  addAllEdges(graph, 9, 4, 5, 8);
  return graph;
}

function addAllEdges(g: IGraph, src: number, ...targets: number[]): void {
  targets.forEach((target) => g.addEdge(src, target));
}
