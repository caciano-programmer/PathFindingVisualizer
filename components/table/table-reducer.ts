import { createAction, createReducer } from '@reduxjs/toolkit';

export const startAction = createAction<number>('start');
export const endAction = createAction<number>('end');
export const wallAction = createAction<number>('addWall');
export const weightAction = createAction<number>('removeWeight');
export const resetTable = createAction('resetTable');

export type TableState = { startNode: number; endNode: number; walls: number[]; weights: number[] };

export const InitialTableState = (startNode: number, endNode: number): TableState => ({
  startNode,
  endNode,
  walls: [],
  weights: [],
});

export const tableReducer = (initialState: TableState) =>
  createReducer(initialState, builder =>
    builder
      .addCase(startAction, (state, { payload }) => {
        state.startNode = payload;
      })
      .addCase(endAction, (state, { payload }) => {
        state.endNode = payload;
      })
      .addCase(wallAction, ({ walls }, { payload }) => {
        if (walls.includes(payload)) walls.splice(walls.indexOf(payload), 1);
        else walls.push(payload);
      })
      .addCase(weightAction, ({ weights }, { payload }) => {
        if (weights.includes(payload)) weights.splice(weights.indexOf(payload), 1);
        else weights.push(payload);
      })
      .addCase(resetTable, () => initialState),
  );
