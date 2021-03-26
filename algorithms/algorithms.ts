/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { AdjacencyList, Weights } from './utils';

// TODO implement dijkstra's, BFS, DFS, A*, bellman-ford, bidirectional
// TODO optional best-first-search, D*

export type Paths = Map<number, { length: number; path: number[] }>;
export type Explored = { paths: Paths; visited: number[] };
type Node = { position: number; value: number; path: number[] };

export const dijkstra = (adjacencyList: AdjacencyList, start: number, weights: Weights = new Map()): Explored => {
  const paths: Paths = new Map();
  for (const key of adjacencyList.keys()) paths.set(key, { length: Infinity, path: [] });
  paths.set(start, { length: 0, path: [start] });
  const visited: number[] = [];

  const fn = (current = start): Paths => {
    visited.push(current);
    const neighbors = adjacencyList.get(current)!;
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

export const Astar = (
  adjacencyList: AdjacencyList,
  start: number,
  destination: number,
  rowLength: number,
  weights: Weights = new Map(),
): Explored => {
  const paths: Paths = new Map();
  const closed: Map<number, Node> = new Map();
  const open: Map<number, Node> = new Map();

  return { paths, visited: [...open.keys()] };
};

// A* algorithm can use different types of heuristics, this is an implementation of manhattan-distance
function heuristic(current: number, destination: number, rowLength: number): number {
  const yDiff = Math.abs(Math.ceil(current / rowLength) - Math.ceil(destination / rowLength));
  const xCurrent = current % rowLength === 0 ? rowLength : current % rowLength;
  const xDestination = destination % rowLength === 0 ? rowLength : destination % rowLength;
  const xDiff = Math.abs(xCurrent - xDestination);
  return xDiff + yDiff;
}
