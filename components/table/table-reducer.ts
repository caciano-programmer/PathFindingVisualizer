import { createAction, createReducer } from '@reduxjs/toolkit';

export const startAction = createAction<number>('start');
export const endAction = createAction<number>('end');
export const wallAction = createAction<number>('addWall');
export const weightAction = createAction<number>('removeWeight');

export type TableState = { start: number; end: number; walls: number[]; weights: number[] };

export const InitialTableState = (start: number, end: number): TableState => ({ start, end, walls: [], weights: [] });

export const tableReducer = (initialState: TableState) =>
  createReducer(initialState, builder =>
    builder
      .addCase(startAction, (state, action) => {
        state.start = action.payload;
      })
      .addCase(endAction, (state, action) => {
        state.end = action.payload;
      })
      .addCase(wallAction, ({ walls }, { payload }) => {
        if (walls.includes(payload)) walls.splice(walls.indexOf(payload), 1);
        else walls.push(payload);
      })
      .addCase(weightAction, ({ weights }, { payload }) => {
        if (weights.includes(payload)) weights.splice(weights.indexOf(payload), 1);
        else weights.push(payload);
      }),
  );
