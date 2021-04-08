import { AlgorithmKey } from '../algorithms/algorithms';

export const ROWS = 8;
export const COLUMNS = 18;
export const MOBILE_GRID_LIMIT = 9;

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
