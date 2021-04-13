import { configureStore, createAction, createReducer } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { AlgorithmKey, algorithms } from '../algorithms/algorithms';
import { randomMaze } from '../algorithms/utils';
import { Dimensions, InitialState, Progress, State } from '../config/config';

export const setStatus = createAction<Progress>('set-status');
export const setAlgorithm = createAction<AlgorithmKey>('set-algorithm');
export const setMaze = createAction('set-maze');
export const setDimension = createAction<Dimensions>('set-dimension');
export const resetState = createAction('clear');

const reducer = createReducer(InitialState, builder =>
  builder
    .addCase(setStatus, (state, { payload }) => ({ ...state, status: payload }))
    .addCase(setAlgorithm, (state, { payload }) => ({ ...state, algorithm: payload }))
    .addCase(setMaze, state => ({ ...state, maze: randomMaze(state.dimensions.rows, state.dimensions.columns) }))
    .addCase(setDimension, (state, { payload }) => ({ ...state, dimensions: payload }))
    .addCase(resetState, ({ dimensions }) => ({ ...InitialState, sessionId: nanoid(), maze: [], dimensions })),
);

export const selectStatus = ({ status }: State) => status;
export const selectAlgorithm = ({ algorithm }: State) => ({ key: algorithm, algorithm: algorithms[algorithm] });
export const selectSessionId = ({ sessionId }: State) => sessionId;
export const selectMaze = ({ maze }: State) => maze;
export const selectDimensions = ({ dimensions }: State) => dimensions;

export const store = configureStore({ reducer, preloadedState: InitialState });
