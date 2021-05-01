import { END, START } from '../config/config';

export type AdjacencyList = Map<number, number[]>;
type Walls = Set<number>;

// This maze generation function uses a modified version of recursive division algorithm
export const randomMaze = (rows: number, cols: number): number[] => {
  const walls = new Set<number>();
  const openings = new Set<number>();
  const horizontalEdges: number[] = [Math.floor(cols / 2)];
  const verticalEdges: number[] = [];

  const random = (arrayLength: number) => Math.floor(Math.random() * arrayLength);
  initializeBorders(rows, cols, walls);

  // builds a column or row of walls and chooses a random cell as the opening, stops when reaches a wall or start/end point
  const buildWall = (beginning: number, jump: number) => {
    if (!isFree(beginning, jump, walls, openings, cols)) return;
    (function fn(current = beginning, count = 1) {
      walls.add(current);
      const next = current + jump;
      if (walls.has(next)) {
        const randomNum = random(count);
        const randomCell = beginning + randomNum * jump;
        walls.delete(randomCell);
        openings.add(randomCell);
        addEdges(randomCell, randomNum, jump, count, horizontalEdges, verticalEdges);
        return;
      }
      fn(next, count + 1);
    })();
  };

  // random chooses orientation, i.e vertical/horizontal wall, and builds walls until not possible to do so
  while (verticalEdges.length > 0 || horizontalEdges.length > 0) {
    const randomBit = random(2);
    const jump = (randomBit === 0 && verticalEdges.length > 0) || horizontalEdges.length === 0 ? 1 : cols;
    const type = jump === 1 ? verticalEdges : horizontalEdges;
    const edge = type.pop() as number;
    buildWall(edge + jump, jump);
    buildWall(edge - jump, -jump);
  }

  return [...walls.values()];
};

// Given a node at index, returns a list of all adjacent nodes while avoiding edge case and walled nodes
const getAdjacentNodes = (index: number, colLength: number, nodeTotal: number, walls: Walls): number[] => {
  const adjacentNodes: number[] = [];
  const above = index - colLength;
  const left = index - 1;
  const right = index + 1;
  const below = index + colLength;
  if (!walls.has(above) && above >= 0) adjacentNodes.push(above);
  if (!walls.has(left) && left > 0 && index % colLength !== 0) adjacentNodes.push(left);
  if (!walls.has(right) && right <= nodeTotal && right % colLength !== 0) adjacentNodes.push(right);
  if (!walls.has(below) && below < nodeTotal) adjacentNodes.push(below);
  return adjacentNodes;
};

// build an adjacency list representation of a row x column sized graph
export const buildAdjacencyList = (rows: number, columns: number, walls: Walls = new Set()): AdjacencyList => {
  const nodeTotal = rows * columns;
  const list: AdjacencyList = new Map();
  for (let i = 0; i < nodeTotal; i++) if (!walls.has(i)) list.set(i, getAdjacentNodes(i, columns, nodeTotal, walls));
  return list;
};

// add all border cells as walls
function initializeBorders(rows: number, cols: number, walls: Set<number>) {
  const topOrBottomBorder = (cell: number) => cell < cols || cell >= (rows - 1) * cols;
  const sideBorder = (cell: number) => cell % cols === cols - 1 || cell % cols === 0;

  for (let row = 0; row < rows; row++)
    for (let cell = row * cols; cell < (row + 1) * cols; cell++)
      if (topOrBottomBorder(cell) || sideBorder(cell)) walls.add(cell);
}

// returns wether a row or column can be added, i.e. adding wall does not block a path or add a wall next to a previous one
function isFree(beginning: number, jump: number, walls: Set<number>, openings: Set<number>, cols: number) {
  if (beginning < 0) return false;
  const perpendicular = Math.abs(jump) > 1 ? 1 : cols;
  let count = 0;
  for (let i = beginning; !walls.has(i); i += jump, count++) {
    const isStartPoint = i === START || i === END;
    if (walls.has(i + perpendicular) || walls.has(i - perpendicular) || openings.has(i) || isStartPoint) return false;
  }
  return count > 2;
}

/**
 * given an opening adds edges if possible around the opening, edges form the base of new walls
 * @param opening opening created in wall
 * @param selected represents the placing of opening relative to all walls added in current row or column
 * @param jump number of spaces required to reach sibling, i.e. 1 for horizontal wall and column length for vertical walls
 * @param count total number of walls added for in current column or row
 */
function addEdges(
  opening: number,
  selected: number,
  jump: number,
  count: number,
  horizontal: number[],
  vertical: number[],
) {
  const type = Math.abs(jump) <= 1 ? horizontal : vertical;
  if (selected > 1) type.push(opening - jump);
  if (count - selected > 2) type.push(opening + jump);
}
