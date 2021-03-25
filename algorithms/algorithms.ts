/* eslint-disable @typescript-eslint/no-non-null-assertion */

// TODO implement dijkstra's, BFS, DFS, A*, bellman-ford, bidirectional
// TODO optional best-first-search, D*

type AdjacencyList = Map<number, number[]>;
type ShortestPaths = Map<number, { length: number; path: number[] }>;
export type Weights = Map<number, { weight: number }>;

// Given a node at index, returns a list of all adjacent nodes while avoiding edge case nodes
const getAdjacentNodes = (index: number, columnLength: number, nodeTotal: number): number[] => {
  const adjacentNodes: number[] = [];
  if (index - columnLength > 0) adjacentNodes.push(index - columnLength);
  if (index - 1 > 0 && (index - 1) % columnLength !== 0) adjacentNodes.push(index - 1);
  if (index + 1 <= nodeTotal && index % columnLength !== 0) adjacentNodes.push(index + 1);
  if (index + columnLength <= nodeTotal) adjacentNodes.push(index + columnLength);
  return adjacentNodes;
};

// build an adjacency list representation of a row x column sized graph
export const buildAdjacencyList = (rows: number, columns: number): AdjacencyList => {
  const nodeTotal = rows * columns;
  const list: AdjacencyList = new Map();
  for (let i = 1; i <= nodeTotal; i++) list.set(i, getAdjacentNodes(i, columns, nodeTotal));
  return list;
};

export const dijkstra = (adjacencyList: AdjacencyList, start: number, weights: Weights = new Map()): ShortestPaths => {
  const paths: ShortestPaths = new Map();
  for (let i = 1; i <= adjacencyList.size; i++) paths.set(i, { length: Infinity, path: [] });
  paths.set(start, { length: 0, path: [start] });

  const fn = (current = start, visited: number[] = []): ShortestPaths => {
    visited.push(current);
    const neighbors = adjacencyList.get(current)!;
    for (const neighbor of neighbors) {
      const currentPath = paths.get(current)!;
      const neighborPath = paths.get(neighbor)!;
      const weight = currentPath.length + (weights.get(neighbor)?.weight || 1);
      if (weight < neighborPath.length) paths.set(neighbor, { length: weight, path: [...currentPath.path, neighbor] });
    }
    for (const neighbor of neighbors) if (!visited.includes(neighbor)) fn(neighbor, visited);
    return paths;
  };

  return fn();
};

export function setWeights(weight: number, nodes: number[]): Weights {
  const weights: Weights = new Map();
  nodes.forEach(node => weights.set(node, { weight }));
  return weights;
}
