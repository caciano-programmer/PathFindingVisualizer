import { createAction, createReducer } from '@reduxjs/toolkit';

export const resetCell = createAction('clear');
export const toggleStart = createAction('toggle-start');
export const toggleEnd = createAction('toggle-end');
export const toggleWall = createAction('toggle-isWall');
export const toggleWeight = createAction('toggle-isWeight');

type cellState = { isStart: boolean; isEnd: boolean; isWall: boolean; isWeight: boolean };

export const initialCell = (value: number, start: number, end: number): cellState => ({
  isStart: value === start,
  isEnd: value === end,
  isWall: false,
  isWeight: false,
});

export const cellReducer = (initialState: cellState) =>
  createReducer(initialState, builder =>
    builder
      .addCase(toggleStart, state => ({ ...state, isStart: !state.isStart }))
      .addCase(toggleEnd, state => ({ ...state, isEnd: !state.isEnd }))
      .addCase(toggleWeight, state => ({ ...state, isWeight: !state.isWeight }))
      .addCase(toggleWall, state => ({ ...state, isWall: !state.isWall }))
      .addCase(resetCell, () => initialState),
  );
