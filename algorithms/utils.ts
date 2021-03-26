export type AdjacencyList = Map<number, number[]>;
export type Weights = Map<number, { weight: number }>;
export type Walls = Map<number, number>;

// Given a node at index, returns a list of all adjacent nodes while avoiding edge case and walled nodes
const getAdjacentNodes = (index: number, columnLength: number, nodeTotal: number, walls: Walls): number[] => {
  const adjacentNodes: number[] = [];
  const above = index - columnLength;
  const left = index - 1;
  const right = index + 1;
  const below = index + columnLength;
  if (!walls.has(above) && above > 0) adjacentNodes.push(above);
  if (!walls.has(left) && left > 0 && left % columnLength !== 0) adjacentNodes.push(left);
  if (!walls.has(right) && right <= nodeTotal && index % columnLength !== 0) adjacentNodes.push(right);
  if (!walls.has(below) && below <= nodeTotal) adjacentNodes.push(below);
  return adjacentNodes;
};

// build an adjacency list representation of a row x column sized graph
export const buildAdjacencyList = (rows: number, columns: number, walls: Walls = new Map()): AdjacencyList => {
  const nodeTotal = rows * columns;
  const list: AdjacencyList = new Map();
  for (let i = 1; i <= nodeTotal; i++) if (!walls.has(i)) list.set(i, getAdjacentNodes(i, columns, nodeTotal, walls));
  return list;
};

export function setWeights(weight: number, nodes: number[]): Weights {
  const weights: Weights = new Map();
  nodes.forEach(node => weights.set(node, { weight }));
  return weights;
}
