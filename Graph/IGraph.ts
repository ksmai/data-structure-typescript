export interface IGraph {
  addEdge(i: number, j: number): void;
  removeEdge(i: number, j: number): void;
  hasEdge(i: number, j: number): boolean;
  inEdges(i: number): number[];
  outEdges(i: number): number[];
  bfs?(r: number): number[];
  dfs?(r: number): number[];
  dfs2?(r: number): number[];
}
