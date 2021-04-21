import { AlgorithmKey } from '../algorithms/algorithms';
import { nanoid } from 'nanoid';

export const ROWS = 17;
export const COLUMNS = 43;
export const START = 348;
export const END = 381;
export const MOBILE_ROW = 13;
export const MOBILE_COL = 15;
export const M_START = 16;
export const M_END = 178;

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
export const MobileDimension: Dimensions = { rows: MOBILE_ROW, columns: MOBILE_COL };
export const DesktopDimension: Dimensions = { rows: ROWS, columns: COLUMNS };
export const InitialState: State = {
  status: Progress.IDLE,
  algorithm: AlgorithmKey.aStar,
  dimensions: MobileDimension,
  maze: [],
  sessionId,
};
