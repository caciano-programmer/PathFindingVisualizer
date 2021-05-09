import { Dispatch, SetStateAction } from 'react';
import { AlgorithmKey, algorithms, Explored } from '../../algorithms/algorithms';
import { buildAdjacencyList } from '../../algorithms/utils';
import { COLUMNS, Large_Weight_Cost, Progress, ROWS, Small_Weight_Cost } from '../../config/config';
import { setStatus } from '../../redux/store';
import { Theme } from '../../theme/theme';

export enum Cell {
  CLEAR = 'clear',
  START = 'start',
  END = 'end',
  START_SEARCHED = 'startSearched',
  END_SEARCHED = 'endSearched',
  START_PATH = 'startPath',
  END_PATH = 'endPath',
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
  Cell.START_SEARCHED,
  Cell.END_SEARCHED,
  Cell.START_PATH,
  Cell.END_PATH,
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
    const { searched, path } = isDragType(copy[index[0]]);
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
    case Cell.START_PATH:
    case Cell.END_PATH:
    case Cell.WEIGHT_P_LG:
    case Cell.WEIGHT_P_SM:
    case Cell.PATH:
      return theme.path;
    case Cell.WALL:
      return theme.grid;
    case Cell.WEIGHT_S_LG:
    case Cell.WEIGHT_S_SM:
    case Cell.START_SEARCHED:
    case Cell.END_SEARCHED:
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

type StartPoint = { isPoint: boolean; start: boolean; end: boolean; searched: boolean; path: boolean };
type WeightType = { isWeight: boolean; small: boolean; large: boolean; searched: boolean; path: boolean };
export function isDragType(inputCell: Cell): WeightType & StartPoint & { baseType: Cell } {
  const { isWeight, small, large, searched: wS, path: wP } = isWeightType(inputCell);
  const { isPoint, start, end, searched: sS, path: sP } = isStartPoint(inputCell);
  const baseType = isWeight ? (small ? Cell.WEIGHT_SM : Cell.WEIGHT_LG) : start ? Cell.START : Cell.END;
  return { isPoint, isWeight, small, large, start, end, searched: sS || wS, path: sP || wP, baseType };
}

export function removeWeights(cells: Cell[]) {
  return cells.map(cell => {
    const { isWeight, searched, path } = isDragType(cell);
    if (isWeight) return searched ? Cell.SEARCHED : path ? Cell.PATH : Cell.CLEAR;
    return cell;
  });
}

// returns the index of start, end, and every location of a weight, every location of walls
function getPoints(cells: Cell[]) {
  const weights = new Map<number, typeof Small_Weight_Cost | typeof Large_Weight_Cost>();
  const walls = new Set<number>();
  let startPoint, endPoint;

  for (let index = 0; index < cells.length; index++) {
    const { small, large, start, end } = isDragType(cells[index]);
    if (start) startPoint = index;
    else if (end) endPoint = index;
    else if (small) weights.set(index, Small_Weight_Cost);
    else if (large) weights.set(index, Large_Weight_Cost);
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
  const timeouts: NodeJS.Timeout[] = [];
  const { searchTime, pathTime } = getSearchAnimationLength(visited.length, path.length);
  const cleared = clear(cells);

  const updateCell = (node: number, type: Cell, first = false) =>
    setCells(state => {
      const copy = first ? cleared : [...state];
      const { isWeight, small, isPoint, start } = isDragType(copy[node]);
      if (type === Cell.SEARCHED) {
        if (isPoint) copy[node] = start ? Cell.START_SEARCHED : Cell.END_SEARCHED;
        else if (isWeight) copy[node] = small ? Cell.WEIGHT_S_SM : Cell.WEIGHT_S_LG;
        else copy[node] = Cell.SEARCHED;
      }
      if (type === Cell.PATH) {
        if (isPoint) copy[node] = start ? Cell.START_PATH : Cell.END_PATH;
        else if (isWeight) copy[node] = small ? Cell.WEIGHT_P_SM : Cell.WEIGHT_P_LG;
        else copy[node] = Cell.PATH;
      }
      return copy;
    });

  const visitedAnimations: Promise<void> = new Promise(resolve => {
    for (let index = 0; index < visited.length; index++) {
      const timeout = setTimeout(() => {
        updateCell(visited[index], Cell.SEARCHED, index === 0);
        if (index === visited.length - 1) resolve();
      }, index * searchTime);
      timeouts.push(timeout);
    }
  });

  visitedAnimations.then(() => {
    if (path.length === 0) dispatch(setStatus(Progress.COMPLETED));
    for (let index = 0; index < path.length; index++) {
      const timeout = setTimeout(() => {
        updateCell(path[index], Cell.PATH);
        if (index === path.length - 1) dispatch(setStatus(Progress.COMPLETED));
      }, index * pathTime);
      timeouts.push(timeout);
    }
  });

  return timeouts;
}

function getSearchAnimationLength(searchLength: number, pathLength: number): { searchTime: number; pathTime: number } {
  const MaxLength = ROWS * COLUMNS;
  let searchTime = 100;
  let pathTime = 125;
  if (pathLength > MaxLength * 0.3) pathTime = 50;
  else if (searchLength > MaxLength * 0.75) searchTime = 25;
  else if (searchLength > MaxLength * 0.5) searchTime = 40;
  else if (searchLength > MaxLength * 0.25) searchTime = 60;
  else if (searchLength > MaxLength * 0.1) searchTime = 80;
  return { searchTime, pathTime };
}

function clear(cells: Cell[]): Cell[] {
  return cells.map(cell => {
    if (cell === Cell.PATH || cell === Cell.SEARCHED) return Cell.CLEAR;
    const { searched, path, small, large, start, end } = isDragType(cell);
    if (!(searched || path)) return cell;
    else if (small) return Cell.WEIGHT_SM;
    else if (large) return Cell.WEIGHT_LG;
    else if (start) return Cell.START;
    else if (end) return Cell.END;
    return cell;
  });
}

function isWeightType(cell: Cell): WeightType {
  const large = cell === Cell.WEIGHT_LG || cell === Cell.WEIGHT_S_LG || cell === Cell.WEIGHT_P_LG;
  const small = cell === Cell.WEIGHT_SM || cell === Cell.WEIGHT_S_SM || cell === Cell.WEIGHT_P_SM;
  const isWeight = small || large;
  const searched = cell === Cell.WEIGHT_S_LG || cell === Cell.WEIGHT_S_SM;
  const path = cell === Cell.WEIGHT_P_SM || cell === Cell.WEIGHT_P_LG;
  return { isWeight, small, large, searched, path };
}

function isStartPoint(cell: Cell): StartPoint {
  const start = cell === Cell.START || cell === Cell.START_SEARCHED || cell === Cell.START_PATH;
  const end = cell === Cell.END || cell === Cell.END_SEARCHED || cell === Cell.END_PATH;
  const isPoint = start || end;
  const searched = cell === Cell.START_SEARCHED || cell === Cell.END_SEARCHED;
  const path = cell === Cell.START_PATH || cell === Cell.END_PATH;
  return { isPoint, start, end, searched, path };
}
