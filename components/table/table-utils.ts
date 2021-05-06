import { Dispatch, SetStateAction } from 'react';
import { AlgorithmKey, algorithms, Explored } from '../../algorithms/algorithms';
import { buildAdjacencyList } from '../../algorithms/utils';
import { Large_Weight_Cost, Progress, Small_Weight_Cost } from '../../config/config';
import { setStatus } from '../../redux/store';
import { Theme } from '../../theme/theme';

export enum Cell {
  CLEAR = 'clear',
  START = 'start',
  END = 'end',
  WALL = 'wall',
  WEIGHT_SM = 'weightSmall',
  WEIGHT_LG = 'weightLarge',
  WEIGHT_S_SM = 'weightSmallSearched',
  WEIGHT_S_LG = 'weightLargeSearched',
  WEIGHT_P_SM = 'weightPathSmall',
  WEIGHT_P_LG = 'weightPathLarge',
  SEARCHED = 'searched',
  PATH = 'path',
}

const draggableCells = [
  Cell.END,
  Cell.START,
  Cell.WEIGHT_SM,
  Cell.WEIGHT_LG,
  Cell.WEIGHT_S_LG,
  Cell.WEIGHT_S_SM,
  Cell.WEIGHT_P_LG,
  Cell.WEIGHT_P_SM,
] as const;

export const DragItemList: Cell[] = [...draggableCells];
export type DragItem = { type: typeof draggableCells[number]; value?: number };
export type CellIndexParam = number | [number, number];

// updates individual cell and replaces old cell if index has 2 values
export function cellsUpdate(array: Cell[], index: CellIndexParam, value: Cell) {
  const copy = [...array];
  if (Array.isArray(index)) {
    const { searched, path } = isWeightType(copy[index[0]]);
    const original = searched ? Cell.SEARCHED : path ? Cell.PATH : Cell.CLEAR;
    copy[index[0]] = original;
    copy[index[1]] = value;
  } else {
    copy[index] = value;
  }
  return copy;
}

export function cellColor(cell: Cell, theme: Theme) {
  switch (cell) {
    case Cell.WEIGHT_P_LG:
    case Cell.WEIGHT_P_SM:
    case Cell.PATH:
      return theme.path;
    case Cell.WALL:
      return theme.grid;
    case Cell.WEIGHT_S_LG:
    case Cell.WEIGHT_S_SM:
    case Cell.SEARCHED:
      return theme.searched;
    default:
      return 'inherit';
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

// returns the index of start, end, and every location of a weight, every location of walls
function getPoints(cells: Cell[]) {
  const weights = new Map<number, typeof Small_Weight_Cost | typeof Large_Weight_Cost>();
  const walls = new Set<number>();
  let startPoint, endPoint;

  for (let index = 0; index < cells.length; index++) {
    const { isWeight, small, large } = isWeightType(cells[index]);
    if (cells[index] === Cell.START) startPoint = index;
    else if (cells[index] === Cell.END) endPoint = index;
    else if (isWeight && small) weights.set(index, Small_Weight_Cost);
    else if (isWeight && large) weights.set(index, Large_Weight_Cost);
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
  const cleared: Cell[] = cells.map(cell => {
    const { isWeight, searched, path, small, large } = isWeightType(cell);
    if (cell === Cell.PATH || cell === Cell.SEARCHED) return Cell.CLEAR;
    else if (isWeight && (searched || path) && small) return Cell.WEIGHT_SM;
    else if (isWeight && (searched || path) && large) return Cell.WEIGHT_LG;
    return cell;
  });
  const timeouts: NodeJS.Timeout[] = [];
  const start = cells.indexOf(Cell.START);
  const end = cells.indexOf(Cell.END);

  const updateCell = (node: number, type: Cell, first = false) =>
    setCells(state => {
      const copy = first ? cleared : [...state];
      if (node !== start && node !== end) {
        const { isWeight, small } = isWeightType(copy[node]);
        if (type === Cell.SEARCHED)
          copy[node] = isWeight ? (small ? Cell.WEIGHT_S_SM : Cell.WEIGHT_S_LG) : Cell.SEARCHED;
        else copy[node] = isWeight ? (small ? Cell.WEIGHT_P_SM : Cell.WEIGHT_P_LG) : Cell.PATH;
      }
      return copy;
    });

  const visitedAnimations: Promise<void> = new Promise(resolve => {
    for (let index = 0; index < visited.length; index++) {
      const timeout = setTimeout(() => {
        updateCell(visited[index], Cell.SEARCHED, index === 0);
        if (index === visited.length - 1) resolve();
      }, index * 25);
      timeouts.push(timeout);
    }
  });

  visitedAnimations.then(() => {
    if (path.length === 0) dispatch(setStatus(Progress.COMPLETED));
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

type WeightType = { isWeight: boolean; small: boolean; large: boolean; searched: boolean; path: boolean; cell: Cell };
export function isWeightType(cell: Cell): WeightType {
  const isWeight =
    cell === Cell.WEIGHT_SM ||
    cell === Cell.WEIGHT_LG ||
    cell === Cell.WEIGHT_S_SM ||
    cell === Cell.WEIGHT_S_LG ||
    cell === Cell.WEIGHT_P_SM ||
    cell === Cell.WEIGHT_P_LG;

  const small = cell === Cell.WEIGHT_SM || cell === Cell.WEIGHT_S_SM || cell === Cell.WEIGHT_P_SM;
  const large = isWeight && !small;
  const searched = cell === Cell.WEIGHT_S_LG || cell === Cell.WEIGHT_S_SM;
  const path = cell === Cell.WEIGHT_P_SM || cell === Cell.WEIGHT_P_LG;

  return { isWeight, small, large, searched, path, cell };
}
