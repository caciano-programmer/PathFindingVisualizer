import { AlgorithmKey } from '../algorithms/algorithms';
import { nanoid } from 'nanoid';

export const ROWS = 13;
export const COLUMNS = 30;
export const MOBILE_GRID_LIMIT = 13;
export const START = 185;
export const END = 205;
export const M_START = 1;
export const M_END = 169;

export const DESKTOP = '@media(min-width: 1000px)';
export const MOBILE = '@media(max-width: 999px)';

export enum Progress {
  IDLE = 'idle',
  IN_PROGESS = 'in_progress',
  COMPLETED = 'completed',
}

export type State = { status: Progress; algorithm: AlgorithmKey; sessionId: string };

const initialID = nanoid();
export const InitialState: State = { status: Progress.IDLE, algorithm: AlgorithmKey.aStar, sessionId: initialID };

export enum DragType {
  START = 'start',
  END = 'end',
  WEIGHT = 'weight',
}
export type DragItem = { type: DragType };
