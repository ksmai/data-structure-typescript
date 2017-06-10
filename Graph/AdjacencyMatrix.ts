import { IGraph } from "./IGraph";

export class AdjacencyMatrix implements IGraph {
  protected a: boolean[][];

  constructor(n: number) {
    this.a = [];
    for (let i = 0; i < n; i++) {
      this.a[i] = Array(n).fill(false);
    }
  }

  public addEdge(i: number, j: number): void {
    this.a[i][j] = true;
  }

  public removeEdge(i: number, j: number): void {
    this.a[i][j] = false;
  }

  public hasEdge(i: number, j: number): boolean {
    return this.a[i][j];
  }

  public outEdges(i: number): number[] {
    const edges = [];
    for (let j = 0; j < this.a[i].length; j++) {
      if (this.a[i][j]) {
        edges.push(j);
      }
    }
    return edges;
  }

  public inEdges(i: number): number[] {
    const edges = [];
    for (let j = 0; j < this.a.length; j++) {
      if (this.a[j][i]) {
        edges.push(j);
      }
    }
    return edges;
  }

  public sink(): number {
    let i = 0;
    let j = 0;
    while (i < this.a.length && j < this.a.length) {
      if (this.a[i][j]) {
        i++;
      } else {
        j++;
      }
    }
    if (i >= this.a.length) {
      return null;
    }
    return !(this.a[i] as any).includes(true) ? i : null;
  }
}
