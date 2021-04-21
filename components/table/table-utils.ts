import { Dispatch, SetStateAction } from 'react';
import { Progress } from '../../config/config';
import { setStatus } from '../../redux/store';

export enum Cell {
  CLEAR = 'clear',
  START = 'start',
  END = 'end',
  WALL = 'wall',
  WEIGHT = 'weight',
  PATH = 'path',
  SEARCHED = 'searched',
}

type DragType = Cell.START | Cell.END | Cell.WEIGHT;
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

// returns the index of start, end, and every locaation of a weights, every location of walls
export function getPoints(cells: Cell[]) {
  const weights = new Set<number>();
  const walls = new Set<number>();
  let startPoint, endPoint;
  for (let index = 0; index < cells.length; index++) {
    if (cells[index] === Cell.START) startPoint = index;
    else if (cells[index] === Cell.END) endPoint = index;
    else if (cells[index] === Cell.WEIGHT) weights.add(index);
    else if (cells[index] === Cell.WALL) walls.add(index);
  }
  if (startPoint === undefined) throw new Error('start fail');
  return { startPoint: startPoint as number, endPoint: endPoint as number, weights, walls };
}

// clears any existing path, and updates cell state on interval basis
export function setPathAnimations(
  cells: Cell[],
  path: number[],
  visited: number[],
  setCells: Dispatch<SetStateAction<Cell[]>>,
  dispatch: Dispatch<any>,
) {
  const cleared: Cell[] = cells.map(cell => (cell === Cell.PATH || cell === Cell.SEARCHED ? Cell.CLEAR : cell));
  const timeouts: NodeJS.Timeout[] = [];
  const start = cells.indexOf(Cell.START);
  const end = cells.indexOf(Cell.END);

  const updateCell = (node: number, type: Cell, first = false) =>
    setCells(state => {
      const copy = first ? cleared : [...state];
      if (node !== start && node !== end) copy[node] = type;
      return copy;
    });

  const visitedAnimations: Promise<void> = new Promise(resolve => {
    for (let index = 0; index < visited.length; index++) {
      const timeout = setTimeout(() => {
        updateCell(visited[index], Cell.SEARCHED, index === 0);
        if (index === visited.length - 1) resolve();
      }, index * 30);
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

export function cellColor(cell: Cell) {
  switch (cell) {
    case Cell.PATH:
      return 'green';
    case Cell.WALL:
      return 'blue';
    case Cell.SEARCHED:
      return 'orange';
    default:
      return 'white';
  }
}
