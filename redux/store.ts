import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { AlgorithmKey, algorithms } from '../algorithms/algorithms';
import { InitialState, Progress, State } from '../config/config';

const clearSlice = createSlice({
  name: 'clear',
  initialState: InitialState.sessionId,
  reducers: { resetState: () => nanoid() },
});
const statusSlice = createSlice({
  name: 'status',
  initialState: InitialState.status,
  reducers: {
    setStatusIdle: () => Progress.IDLE,
    setStatusProgress: () => Progress.IN_PROGESS,
    setStatusComplete: () => Progress.COMPLETED,
  },
  extraReducers: builder => builder.addCase(clearSlice.actions.resetState, () => InitialState.status),
});
const algorithmSlice = createSlice({
  name: 'algorithm',
  initialState: InitialState.algorithm,
  reducers: { setAlgorithm: (_, action: PayloadAction<AlgorithmKey>) => action.payload },
  extraReducers: builder => builder.addCase(clearSlice.actions.resetState, () => InitialState.algorithm),
});

export const { setStatusIdle, setStatusComplete, setStatusProgress } = statusSlice.actions;
export const { setAlgorithm } = algorithmSlice.actions;
export const { resetState } = clearSlice.actions;

export const selectStatus = ({ status }: State) => status;
export const selectAlgorithm = (state: State) => ({ key: state.algorithm, algorithm: algorithms[state.algorithm] });
export const selectSessionId = ({ sessionId }: State) => sessionId;

export const store = configureStore({
  reducer: { status: statusSlice.reducer, algorithm: algorithmSlice.reducer, sessionId: clearSlice.reducer },
  preloadedState: InitialState,
});
