import { Dispatch, SetStateAction } from 'react';
import { AlgorithmKey, algorithms, Explored } from '../../algorithms/algorithms';
import { buildAdjacencyList } from '../../algorithms/utils';
import { Progress } from '../../config/config';
import { setStatus } from '../../redux/store';

export enum Cell {
  CLEAR = 'clear',
  START = 'start',
  END = 'end',
  WALL = 'wall',
  WEIGHT = 'weight',
  WEIGHT_SEARCHED = 'weightSearched',
  WEIGHT_PATH = 'weightPath',
  SEARCHED = 'searched',
  PATH = 'path',
}

type DragType = Cell.START | Cell.END | Cell.WEIGHT | Cell.WEIGHT_SEARCHED;
export type DragItem = { type: DragType; value?: number };
export type CellIndexParam = number | [number, number];

// updates individual cell and replaces old cell if index has 2 values
export function cellsUpdate(array: Cell[], index: CellIndexParam, value: Cell) {
  const copy = [...array];
  if (Array.isArray(index)) {
    copy[index[0]] = Cell.CLEAR;
    copy[index[1]] = value;
  } else {
    copy[index] = value;
  }
  return copy;
}

// TODO delete after theme created
export function cellColor(cell: Cell) {
  switch (cell) {
    case Cell.WEIGHT_PATH:
    case Cell.PATH:
      return 'green';
    case Cell.WALL:
      return 'blue';
    case Cell.WEIGHT_SEARCHED:
    case Cell.SEARCHED:
      return 'orange';
    default:
      return 'white';
  }
}

// given a list of cells and an algorithm starts the animation process updating the cells as the animation progresses
export function animations(
  cells: Cell[],
  algorithmKey: AlgorithmKey,
  rows: number,
  columns: number,
  setCells: Dispatch<SetStateAction<Cell[]>>,
  dispatch: Dispatch<any>,
): NodeJS.Timeout[] {
  const { startPoint, endPoint, weights, walls } = getPoints(cells);
  let explored: Explored = { paths: new Map(), visited: [startPoint] };
  const algorithm = algorithms[algorithmKey];
  const list = buildAdjacencyList(rows, columns, walls);
  const { aStar, dfs, dijkstra, bellmanFord, bfs } = algorithms;
  let timeoutIds: NodeJS.Timeout[] = [];

  if (algorithm === bellmanFord || algorithm === dijkstra) explored = algorithm.fn(list, startPoint, weights);
  else if (algorithm === aStar) explored = algorithm.fn(list, startPoint, endPoint, columns, weights);
  else if (algorithm === bfs || algorithm === dfs) explored = algorithm.fn(list, startPoint, endPoint);
  const path = explored.paths.get(endPoint);
  if (path?.path) timeoutIds = setPathAnimations(cells, path.path, explored.visited, setCells, dispatch);

  return timeoutIds;
}

// returns the index of start, end, and every locaation of a weights, every location of walls
function getPoints(cells: Cell[]) {
  const weights = new Set<number>();
  const walls = new Set<number>();
  let startPoint, endPoint;
  const isWeight = (type: Cell) => type === Cell.WEIGHT || type === Cell.WEIGHT_PATH || type === Cell.WEIGHT_SEARCHED;

  for (let index = 0; index < cells.length; index++) {
    if (cells[index] === Cell.START) startPoint = index;
    else if (cells[index] === Cell.END) endPoint = index;
    else if (isWeight(cells[index])) weights.add(index);
    else if (cells[index] === Cell.WALL) walls.add(index);
  }

  if (startPoint === undefined || endPoint === undefined) throw new Error('start fail');
  return { startPoint: startPoint as number, endPoint: endPoint as number, weights, walls };
}

// clears any existing path, and updates cell state on interval basis
function setPathAnimations(
  cells: Cell[],
  path: number[],
  visited: number[],
  setCells: Dispatch<SetStateAction<Cell[]>>,
  dispatch: Dispatch<any>,
) {
  // const cleared: Cell[] = cells.map(cell => (cell === Cell.PATH || cell === Cell.SEARCHED ? Cell.CLEAR : cell));
  const cleared: Cell[] = cells.map(cell => {
    if (cell === Cell.PATH || cell === Cell.SEARCHED) return Cell.CLEAR;
    if (cell === Cell.WEIGHT_PATH || cell === Cell.WEIGHT_SEARCHED) return Cell.WEIGHT;
    return cell;
  });
  const timeouts: NodeJS.Timeout[] = [];
  const start = cells.indexOf(Cell.START);
  const end = cells.indexOf(Cell.END);

  const updateCell = (node: number, type: Cell, first = false) =>
    setCells(state => {
      const copy = first ? cleared : [...state];
      if (node !== start && node !== end) {
        if (type === Cell.SEARCHED) copy[node] = copy[node] === Cell.WEIGHT ? Cell.WEIGHT_SEARCHED : Cell.SEARCHED;
        else copy[node] = copy[node] === Cell.WEIGHT_SEARCHED ? Cell.WEIGHT_PATH : Cell.PATH;
      }
      return copy;
    });

  const visitedAnimations: Promise<void> = new Promise(resolve => {
    for (let index = 0; index < visited.length; index++) {
      const timeout = setTimeout(() => {
        updateCell(visited[index], Cell.SEARCHED, index === 0);
        if (index === visited.length - 1) resolve();
      }, index * 15);
      timeouts.push(timeout);
    }
  });

  visitedAnimations.then(() => {
    for (let index = 0; index < path.length; index++) {
      const timeout = setTimeout(() => {
        updateCell(path[index], Cell.PATH);
        if (index === path.length - 1) dispatch(setStatus(Progress.COMPLETED));
      }, index * 100);
      timeouts.push(timeout);
    }
  });

  return timeouts;
}
