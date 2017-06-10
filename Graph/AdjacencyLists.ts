import { IGraph } from "./IGraph";

const white = 0;
const grey = 1;
const black = 2;

export class AdjacencyLists implements IGraph {
  protected adj: number[][];

  constructor(n: number) {
    this.adj = [];
    for (let i = 0; i < n; i++) {
      this.adj[i] = [];
    }
  }

  public addEdge(i: number, j: number): void {
    this.adj[i].push(j);
  }

  public removeEdge(i: number, j: number): void {
    for (let k = 0; k < this.adj[i].length; k++) {
      if (this.adj[i][k] === j) {
        this.adj[i].splice(k, 1);
        return;
      }
    }
  }

  public hasEdge(i: number, j: number): boolean {
    return (this.adj[i] as any).includes(j);
  }

  public outEdges(i: number): number[] {
    return this.adj[i];
  }

  public inEdges(i: number): number[] {
    const edges = [];
    for (let j = 0; j < this.adj.length; j++) {
      if ((this.adj[j] as any).includes(i)) {
        edges.push(j);
      }
    }
    return edges;
  }

  public bfs(r: number): number[] {
    const seen = Array(this.adj.length).fill(false);
    const q: number[] = [];
    const o: number[] = [];
    q.push(r);
    o.push(r);
    seen[r] = true;
    while (q.length > 0) {
      const i = q.shift();
      for (const j of this.adj[i]) {
        if (!seen[j]) {
          q.push(j);
          o.push(j);
          seen[j] = true;
        }
      }
    }
    return o;
  }

  public dfs(r: number, c: number[] = null): number[] {
    if (!c) {
      c = Array(this.adj.length).fill(white);
    }
    c[r] = grey;
    const o = [r];
    for (const j of this.adj[r]) {
      if (c[j] === white) {
        o.push(...this.dfs(j, c));
      }
    }
    c[r] = black;
    return o;
  }

  public dfs2(r: number): number[] {
    const c = Array(this.adj.length).fill(white);
    const s: number[] = [];
    const o: number[] = [];
    s.push(r);
    while (s.length > 0) {
      const i = s.pop();
      if (c[i] === white) {
        c[i] = grey;
        o.push(i);
        // same order as dfs() by reversing
        const children = this.adj[i].slice().reverse();
        s.push(...children);
      } else {
        c[i] = black;
      }
    }
    return o;
  }
}
