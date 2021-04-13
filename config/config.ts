import { AlgorithmKey } from '../algorithms/algorithms';
import { nanoid } from 'nanoid';

export const ROWS = 17;
export const COLUMNS = 43;
export const START = 44;
export const END = 686;
export const MOBILE_GRID_LIMIT = 15;
export const M_START = 17;
export const M_END = 209;

export const DESKTOP = '@media(min-width: 1000px)';
export const MOBILE = '@media(max-width: 999px)';

export enum Progress {
  IDLE = 'idle',
  IN_PROGESS = 'in_progress',
  COMPLETED = 'completed',
}

export type Dimensions = { rows: number; columns: number };
export type State = {
  status: Progress;
  algorithm: AlgorithmKey;
  dimensions: Dimensions;
  maze: number[];
  sessionId: string;
};

const sessionId = nanoid();
export const InitialState: State = {
  status: Progress.IDLE,
  algorithm: AlgorithmKey.aStar,
  dimensions: { rows: MOBILE_GRID_LIMIT, columns: MOBILE_GRID_LIMIT },
  maze: [],
  sessionId,
};

export enum Cell {
  CLEAR = 'clear',
  START = 'start',
  END = 'end',
  WALL = 'wall',
  WEIGHT = 'weight',
  PATH = 'path',
}

type DragType = Cell.START | Cell.END | Cell.WEIGHT;
export type DragItem = { type: DragType; value?: number };
export type CellIndexParam = number | [number, number];
