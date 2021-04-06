import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlgorithmKey, algorithms } from '../algorithms/algorithms';
import { InitialState, Progress, State } from '../config/config';

const statusSlice = createSlice({
  name: 'status',
  initialState: InitialState.status,
  reducers: {
    setStatusIdle: () => Progress.IDLE,
    setStatusProgress: () => Progress.IN_PROGESS,
    setStatusComplete: () => Progress.COMPLETED,
  },
});

const algorithmSlice = createSlice({
  name: 'algorithm',
  initialState: InitialState.algorithm,
  reducers: {
    setAlgorithm: (_, action: PayloadAction<AlgorithmKey>) => action.payload,
  },
});

export const { setStatusIdle, setStatusComplete, setStatusProgress } = statusSlice.actions;
export const { setAlgorithm } = algorithmSlice.actions;

export const selectStatus = (state: State) => state;
export const selectAlgorithm = (state: State) => ({ key: state.algorithm, algorithm: algorithms[state.algorithm] });

export const store = configureStore({
  reducer: { status: statusSlice.reducer, algorithm: algorithmSlice.reducer },
  preloadedState: InitialState,
});
