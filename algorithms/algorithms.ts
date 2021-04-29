/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { AdjacencyList, Weights } from './utils';

type SinglePath = { length: number; path: number[] };
export type Path = Map<number, SinglePath>;
export type Explored = { paths: Path; visited: number[] };
type dijkstrasNode = { key: number; cost: number };
type AstarNode = { key: number; movement: number; value: number; cost: number; path: number[] };

const Weight_Cost = 5;

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

function dijkstra(list: AdjacencyList, start: number, weights: Weights = new Set()): Explored {
  const paths: Path = new Map();
  const visited = new Set<number>();
  for (const key of list.keys())
    key === start ? paths.set(start, { length: 0, path: [start] }) : paths.set(key, { length: Infinity, path: [] });
  const initialUnvisited: dijkstrasNode[] = [...paths].map(([key, { length }]) => ({ key, cost: length }));
  const unvisited = new PriorityQueue<dijkstrasNode>(initialUnvisited);

  const fn = (current = start): Path => {
    visited.add(current);
    const neighbors = list.get(current)!;
    const currentPath = paths.get(current)!;
    for (const neighbor of neighbors) {
      const neighborPath = paths.get(neighbor)!;
      const length = currentPath.length + (weights.has(neighbor) ? Weight_Cost : 1);
      if (length < neighborPath.length) {
        paths.set(neighbor, { length, path: [...currentPath.path, neighbor] });
        unvisited.set({ key: neighbor, cost: length });
      }
    }
    if (unvisited.size() > 0) fn(unvisited.deQueue()!.key);

    return paths;
  };

  return { paths: fn(), visited: [...visited] };
}

function aStar(list: AdjacencyList, start: number, dest: number, col: number, weights: Weights): Explored {
  const startNode: AstarNode = {
    key: start,
    movement: 0,
    value: heuristic(start, dest, col),
    cost: heuristic(start, dest, col),
    path: [start],
  };
  const open = new PriorityQueue<AstarNode>(startNode);
  const closed: Map<number, AstarNode> = new Map();

  const fn = (): SinglePath => {
    if (open.size() === 0) return { path: [], length: 0 };
    const node = open.deQueue()!;
    closed.set(node.key, node);
    if (node.key === dest) return { length: node.movement, path: node.path };
    for (const adjacent of list.get(node.key)!.filter(val => !closed.has(val))) {
      const value = heuristic(adjacent, dest, col);
      const movement = node.movement + (weights?.has(adjacent) ? Weight_Cost : 1);
      const cost = movement + value;
      const betterInOpen = open.has(adjacent) && open.get(adjacent)!.cost <= cost;
      if (!betterInOpen) open.set({ key: adjacent, movement, value, cost, path: [...node.path, adjacent] });
    }
    return fn();
  };

  return { paths: new Map([[dest, fn()]]), visited: open.explored() };
}

function bellmanFord(list: AdjacencyList, start: number, weights?: Weights): Explored {
  const paths: Path = new Map();
  const visitedOrder: Set<number> = new Set();
  for (const vertice of list.keys()) paths.set(vertice, { length: Infinity, path: [] });
  paths.set(start, { length: 0, path: [start] });

  for (let times = list.size - 1, updatesMade = true; times > 0; times--, updatesMade = false) {
    const open: ListSet<number> = new ListSet(start);
    for (let vertices = list.size; vertices > 0; vertices--) {
      const current = open.shift();
      if (current !== undefined) {
        visitedOrder.add(current);
        for (const edge of list.get(current)!) {
          open.push(edge);
          const cost = paths.get(current)!.length + (weights?.has(edge) ? Weight_Cost : 1);
          if (cost < paths.get(edge)!.length) {
            updatesMade = true;
            paths.set(edge, { length: cost, path: [...paths.get(current)!.path, edge] });
          }
        }
      }
    }
    if (!updatesMade) break;
  }

  return { paths, visited: [...visitedOrder] };
}

function depthFirstSearch(list: AdjacencyList, start: number, destination: number): Explored {
  const paths: Path = new Map();
  const visited = new Set([start]);

  const path = (function fn(current: number, path = [start]): number[] {
    if (current === destination) return path;
    const siblings = list.get(current)?.filter(node => !visited.has(node));
    if (siblings && siblings?.length > 0) {
      const next = siblings[0];
      visited.add(next);
      return fn(next, [...path, next]);
    }
    path.pop();
    if (path.length === 0) return [];
    return fn(path[path.length - 1], path);
  })(start);

  paths.set(destination, { path, length: path.length });
  return { paths, visited: [...visited] };
}

function breadthFirstSearch(list: AdjacencyList, start: number, destination: number): Explored {
  const paths: Path = new Map();
  const visited: Set<number> = new Set([start]);
  paths.set(start, { length: 0, path: [start] });

  const fn = (layer: number[] = [start]): SinglePath => {
    const children: number[] = [];
    if (layer.length === 0) return { path: [], length: 0 };
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

  return { paths: new Map([[destination, fn()]]), visited: [...visited] };
}

//=========================================Helper Functions=========================================

/*
    A* algorithm can use different types of heuristics, this is an implementation of manhattan-distance,
    a heuristic that gaurantees shortest path and works when you can move in 4 directions,
 */
function heuristic(current: number, dest: number, column: number): number {
  const yCurrent = Math.floor(current / column);
  const yDestination = Math.floor(dest / column);
  const yDiff = Math.abs(yDestination - yCurrent);
  const xCurrent = current % column;
  const xDestination = dest % column;
  const xDiff = Math.abs(xDestination - xCurrent);
  return xDiff + yDiff;
}

/*  
  Priority Queue used for A* and Dijkstra's algorithm, not neccessary in both cases, but a very useful optimization
  since there is the constant need to select the node with smallest cost
*/
class PriorityQueue<T extends { key: number; cost: number }> {
  private Dictionary: Map<number, T> = new Map();
  private Queue: T[] = [];
  private Explored: Set<number> = new Set();

  constructor(initial: T | T[]) {
    if (!Array.isArray(initial)) this.set(initial);
    else for (const node of initial) this.set(node);
  }

  size(): number {
    return this.Queue.length;
  }
  deQueue(): T | undefined {
    const removed = this.Queue.shift();
    if (removed) this.Dictionary.delete(removed.key);
    return removed;
  }
  has(key: number): boolean {
    return this.Dictionary.has(key);
  }
  get(key: number): T | undefined {
    return this.Dictionary.get(key);
  }
  explored(): number[] {
    return [...this.Explored];
  }
  set(item: T): void {
    this.Dictionary.set(item.key, item);
    this.Explored.add(item.key);
    if (this.Queue.length === 0) this.Queue.push(item);
    else {
      let middle = Math.floor((this.Queue.length - 1) / 2);
      for (let start = 0, end = this.Queue.length - 1; end >= start; middle = Math.floor((end - start) / 2) + start) {
        if (middle === 0 || item.cost === this.Queue[middle].cost) break;
        else if (item.cost < this.Queue[middle].cost) end = middle - 1;
        else start = middle + 1;
      }
      if (this.Queue[middle].cost < item.cost) middle++;
      this.Queue.splice(middle, 0, item);
    }
  }
}

// A set but with ability to constantly remove first item without affecting original set
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
