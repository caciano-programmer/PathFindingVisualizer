import { AlgorithmKey } from '../algorithms/algorithms';

export const ROWS = 15;
export const COLUMNS = 40;
export const MOBILE_GRID_LIMIT = 13;
export const START = 285;
export const END = 315;
export const M_START = 1;
export const M_END = 169;

export const DESKTOP = '@media(min-width: 1000px)';
export const MOBILE = '@media(max-width: 999px)';

export enum Progress {
  IDLE = 'idle',
  IN_PROGESS = 'in_progress',
  COMPLETED = 'completed',
}

export type State = { status: Progress; algorithm: AlgorithmKey };

export const InitialState: State = { status: Progress.IDLE, algorithm: AlgorithmKey.bfs };

export enum DragType {
  START = 'start',
  END = 'end',
  WEIGHT = 'weight',
}
export type DragItem = { type: DragType };
