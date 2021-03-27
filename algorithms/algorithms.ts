/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { AdjacencyList, Weights } from './utils';

// TODO implement BFS, DFS, bellman-ford, bidirectional
// TODO optional best-first-search, D* or D* lite, floyd-warshell, johnsons

type SinglePath = { length: number; path: number[] };
export type Path = Map<number, SinglePath> | SinglePath;
export type Explored = { paths: Path; visited: number[] };
type AstarNode = { key: number; movement: number; value: number; path: number[] };

export const dijkstra = (list: AdjacencyList, start: number, weights: Weights = new Map()): Explored => {
  const paths: Path = new Map();
  for (const key of list.keys()) paths.set(key, { length: Infinity, path: [] });
  paths.set(start, { length: 0, path: [start] });
  const visited: number[] = [];
  const fn = (current = start): Path => {
    visited.push(current);
    const neighbors = list.get(current)!;
    const currentPath = paths.get(current)!;
    for (const neighbor of neighbors) {
      const neighborPath = paths.get(neighbor)!;
      const weight = currentPath.length + (weights.get(neighbor)?.weight || 1);
      if (weight < neighborPath.length) paths.set(neighbor, { length: weight, path: [...currentPath.path, neighbor] });
    }
    for (const neighbor of neighbors) if (!visited.includes(neighbor)) fn(neighbor);
    return paths;
  };
  return { paths: fn(), visited };
};

export const Astar = (list: AdjacencyList, start: number, dest: number, row: number, weights?: Weights): Explored => {
  const startNode = { key: start, movement: 0, value: heuristic(start, dest, row), path: [start] };
  const open = new PriorityQueue(startNode);
  const closed: Map<number, AstarNode> = new Map();
  const fn = (): Path => {
    const node = open.deQueue()!;
    closed.set(node.key, node);
    if (node.key === dest) return { length: node.movement, path: node.path };
    for (const adjacent of list.get(node.key)!) {
      const weight = weights?.get(adjacent)?.weight || 1;
      const value = heuristic(adjacent, dest, row) + weight;
      const notInLists = !open.get(adjacent) && !closed.get(adjacent);
      const betterThanClosed = closed.get(adjacent) && value < closed.get(adjacent)!.value;
      const betterThanOpen = open.get(adjacent) && value < open.get(adjacent)!.value;
      if (notInLists || betterThanClosed || betterThanOpen)
        open.set({ key: adjacent, movement: node.movement + weight, value, path: [...node.path, adjacent] });
    }
    return fn();
  };
  return { paths: fn(), visited: open.explored() };
};

//=========================================Helper Functions=========================================

/*
    A* algorithm can use different types of heuristics, this is an implementation of manhattan-distance,
    a heuristic that gaurantees shortest path and works when you have travel in 4 directions(up,left,down,right)
 */
function heuristic(current: number, dest: number, row: number): number {
  const yDiff = Math.abs(Math.ceil(current / row) - Math.ceil(dest / row));
  const xCurrent = current % row === 0 ? row : current % row;
  const xDestination = dest % row === 0 ? row : dest % row;
  const xDiff = Math.abs(xCurrent - xDestination);
  return xDiff + yDiff;
}

/*  
  Priority Queue used for A* algorithm, useful optimization since 
  there is the need to constantly retrieving the node with smallest value
*/
class PriorityQueue {
  private Dictionary: Map<number, AstarNode> = new Map();
  private Queue: AstarNode[] = [];
  private Explored: number[] = [];
  constructor(startNode: AstarNode) {
    this.set(startNode);
  }
  deQueue(): AstarNode | undefined {
    const removed = this.Queue.shift();
    if (removed) this.Explored.push(removed.key);
    return removed;
  }
  get(key: number): AstarNode | undefined {
    return this.Dictionary.get(key);
  }
  explored(): number[] {
    return [...this.Explored, ...this.Queue.map(node => node.key)];
  }
  set(item: AstarNode): void {
    let middle = this.Queue.length === 0 ? 0 : Math.floor((this.Queue.length - 1) / 2);
    for (let start = 0, end = this.Queue.length - 1; end >= start; middle = Math.floor((end - start) / 2) + start) {
      if (middle === 0 || item.value === this.Queue[middle].value) break;
      else if (item.value < this.Queue[middle].value) end = middle - 1;
      else start = middle + 1;
    }
    this.Dictionary.set(item.key, item);
    if (this.Queue.length === 0) this.Queue.push(item);
    else {
      if (this.Queue[middle].value < item.value) middle++;
      this.Queue.splice(middle, 0, item);
    }
  }
}
