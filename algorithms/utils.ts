export type AdjacencyList = Map<number, number[]>;
export type Weights = Map<number, { weight: number }>;
export type Walls = Map<number, number>;

export const randomMaze = (rowLength: number, colLength: number): number[] => {
  const permanent = new Set<number>();
  const vertices = new Set<number>();
  const visited = new Set<number>([colLength + 1]);
  const closed = new Set<number>();

  //set all border elements to permanent walls and every other cell to closed walls
  for (let row = 0; row < rowLength; row++)
    for (let cell = row * colLength; cell < (row + 1) * colLength; cell++) {
      const topOrBottomBorder = cell < colLength || cell >= (rowLength - 1) * colLength;
      const sideBorder = cell % colLength === colLength - 1 || cell % colLength === 0;
      if (topOrBottomBorder || sideBorder) permanent.add(cell);
      else if (cell % 2 !== 0) closed.add(cell);
      else vertices.add(cell);
    }

  modifiedPrims();

  return [...permanent.values(), ...closed.values()];
};

// Given a node at index, returns a list of all adjacent nodes while avoiding edge case and walled nodes
const getAdjacentNodes = (index: number, colLength: number, nodeTotal: number, walls: Walls): number[] => {
  const adjacentNodes: number[] = [];
  const above = index - colLength;
  const left = index - 1;
  const right = index + 1;
  const below = index + colLength;
  if (!walls.has(above) && above > 0) adjacentNodes.push(above);
  if (!walls.has(left) && left > 0 && left % colLength !== 0) adjacentNodes.push(left);
  if (!walls.has(right) && right <= nodeTotal && index % colLength !== 0) adjacentNodes.push(right);
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

// mofified version of prims algorithm, selects edges at random

class RandomSet<T> extends Set {
  private data: T[] = [];
  constructor(data: T[]) {
    super();
    this.data = data;
  }
  getRandom() {}
}

function modifiedPrims() {}
