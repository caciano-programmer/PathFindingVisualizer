/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { AdjacencyList, Weights } from './utils';

type SinglePath = { length: number; path: number[] };
export type Path = Map<number, SinglePath> | SinglePath;
export type Explored = { paths: Path; visited: number[] };
type AstarNode = { key: number; movement: number; value: number; path: number[] };

export const algorithms = {
  aStar: { name: 'A*' as const, fn: aStar },
  dijkstra: { name: "Dijkstra's" as const, fn: dijkstra },
  bfs: { name: 'Breadth First Search' as const, fn: breadthFirstSearch },
  bellmanFord: { name: 'Bellman-Ford' as const, fn: bellmanFord },
  dfs: { name: 'Depth First Search' as const, fn: depthFirstSearch },
};
export enum AlgorithmKey {
  aStar = 'aStar',
  dijkstra = 'dijkstra',
  bfs = 'bfs',
  bellmanFord = 'bellmanFord',
  dfs = 'dfs',
}

function dijkstra(list: AdjacencyList, start: number, weights: Weights = new Map()): Explored {
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
      const weight = currentPath.length + (weights.get(neighbor)?.weight ?? 1);
      if (weight < neighborPath.length) paths.set(neighbor, { length: weight, path: [...currentPath.path, neighbor] });
    }
    for (const neighbor of neighbors) if (!visited.includes(neighbor)) fn(neighbor);
    return paths;
  };

  return { paths: fn(), visited };
}

function aStar(list: AdjacencyList, start: number, dest: number, row: number, weights?: Weights): Explored {
  const startNode = { key: start, movement: 0, value: heuristic(start, dest, row), path: [start] };
  const open = new AstarPriorityQueue(startNode);
  const closed: Map<number, AstarNode> = new Map();

  const fn = (): Path => {
    const node = open.deQueue()!;
    closed.set(node.key, node);
    if (node.key === dest) return { length: node.movement, path: node.path };
    for (const adjacent of list.get(node.key)!) {
      const weight = weights?.get(adjacent)?.weight ?? 1;
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
}

function bellmanFord(list: AdjacencyList, start: number, weights?: Weights): Explored {
  const paths: Path = new Map();
  const visitedOrder: Set<number> = new Set();
  for (const vertice of list.keys()) paths.set(vertice, { length: Infinity, path: [] });
  paths.set(start, { length: 0, path: [start] });

  for (let times = list.size - 1, updatesMade = true; times > 0; times--, updatesMade = false) {
    const open: ListSet<number> = new ListSet(start);
    for (let vertices = list.size; vertices > 0; vertices--) {
      const current = open.shift()!;
      visitedOrder.add(current);
      for (const edge of list.get(current)!) {
        open.push(edge);
        const cost = paths.get(current)!.length + (weights?.get(edge)?.weight ?? 1);
        if (cost < paths.get(edge)!.length) {
          updatesMade = true;
          paths.set(edge, { length: cost, path: [...paths.get(current)!.path, edge] });
        }
      }
    }
    if (!updatesMade) break;
  }

  return { paths, visited: [...visitedOrder] };
}

function depthFirstSearch(list: AdjacencyList, start: number, destination: number): Explored {
  const paths: Path = new Map();
  const visited: Set<number> = new Set([start]);
  paths.set(start, { length: 0, path: [start] });

  const fn = (current: number): void => {
    const currentPath = paths.get(current)!.path;
    if (current === destination) return;
    for (const neighbor of list.get(current)!.filter(node => !visited.has(node))) {
      paths.set(neighbor, { length: currentPath.length, path: [...currentPath, neighbor] });
      visited.add(neighbor);
      fn(neighbor);
    }
  };
  fn(start);

  return { paths: paths.get(destination)!, visited: [...visited] };
}

function breadthFirstSearch(list: AdjacencyList, start: number, destination: number): Explored {
  const paths: Path = new Map();
  const visited: Set<number> = new Set([start]);
  paths.set(start, { length: 0, path: [start] });

  const fn = (layer: number[] = [start]): SinglePath => {
    const children: number[] = [];
    for (const parent of layer)
      for (const child of list.get(parent)!.filter(node => !visited.has(node))) {
        visited.add(child);
        const parentNode = paths.get(parent)!;
        paths.set(child, { length: parentNode.length + 1, path: [...parentNode.path, child] });
        if (child === destination) return paths.get(child)!;
        children.push(child);
      }
    return fn(children);
  };

  return { paths: fn(), visited: [...visited] };
}

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
  Priority Queue used for A* algorithm, useful optimization since there is the need to constantly retrieve 
  the node with smallest value(heuristic + movement cost), not neccessary but greatly improves performance
*/
class AstarPriorityQueue {
  private Dictionary: Map<number, AstarNode> = new Map();
  private Queue: AstarNode[] = [];
  private Explored: Set<number> = new Set();
  constructor(startNode: AstarNode) {
    this.set(startNode);
  }
  deQueue(): AstarNode | undefined {
    const removed = this.Queue.shift();
    if (removed) this.Explored.add(removed.key);
    return removed;
  }
  get(key: number): AstarNode | undefined {
    return this.Dictionary.get(key);
  }
  explored(): number[] {
    return [...this.Explored, ...this.Queue.map(node => node.key)];
  }
  set(item: AstarNode): void {
    this.Dictionary.set(item.key, item);
    this.Explored.add(item.key);
    if (this.Queue.length === 0) this.Queue.push(item);
    else {
      let middle = this.Queue.length === 0 ? 0 : Math.floor((this.Queue.length - 1) / 2);
      for (let start = 0, end = this.Queue.length - 1; end >= start; middle = Math.floor((end - start) / 2) + start) {
        if (middle === 0 || item.value === this.Queue[middle].value) break;
        else if (item.value < this.Queue[middle].value) end = middle - 1;
        else start = middle + 1;
      }
      if (this.Queue[middle].value < item.value) middle++;
      this.Queue.splice(middle, 0, item);
    }
  }
}

// Extends javascript Set to be able to pop unique elements from a separate list, while not affecting current set
class ListSet<Type> extends Set {
  private list: Type[] = [];
  constructor(items?: Type | Type[]) {
    super();
    if (items && Array.isArray(items)) for (const item of items) this.push(item);
    else if (items) this.push(items);
  }
  push(item: Type): ListSet<Type> {
    const prevSize = this.size;
    this.add(item);
    if (this.size > prevSize) this.list.push(item);
    return this;
  }
  shift(): Type | undefined {
    return this.list.shift();
  }
}
