/* eslint-disable @typescript-eslint/no-empty-function */

import { AlgorithmKey } from '../algorithms/algorithms';
import { nanoid } from 'nanoid';

export const ROWS = 23;
export const COLUMNS = 51;
export const START = 566;
export const END = 606;
export const MOBILE_ROW = 17;
export const MOBILE_COL = 17;
export const M_START = 18;
export const M_END = 270;

export const DESKTOP = '@media(min-width: 1000px)';
export const MOBILE = '@media(max-width: 999px)';

export enum Progress {
  IDLE = 'idle',
  IN_PROGESS = 'in_progress',
  COMPLETED = 'completed',
}

export type Dimensions = { rows: number; columns: number; start: number; end: number };
export type State = {
  status: Progress;
  algorithm: AlgorithmKey;
  dimensions: Dimensions;
  maze: number[];
  sessionId: string;
  tutorial: boolean;
};

const sessionId = nanoid();
export const MobileDimension: Dimensions = { rows: MOBILE_ROW, columns: MOBILE_COL, start: M_START, end: M_END };
export const DesktopDimension: Dimensions = { rows: ROWS, columns: COLUMNS, start: START, end: END };
export const InitialState: State = {
  status: Progress.IDLE,
  algorithm: AlgorithmKey.aStar,
  dimensions: DesktopDimension,
  maze: [],
  sessionId,
  tutorial: false,
};

export const Small_Weight_Cost = 5;
export const Large_Weight_Cost = 13;

export type Option = { show: boolean; secondary: boolean };
export const closedOptions: Option = { show: false, secondary: false };
export const primaryOptions: Option = { show: true, secondary: false };
export const secondaryOptions: Option = { show: true, secondary: true };
