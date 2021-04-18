/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { MemoizedCell } from './cell';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAlgorithm,
  selectDimensions,
  selectMaze,
  selectSessionId,
  selectStatus,
  setStatus,
} from '../../redux/store';
import {
  Cell,
  CellIndexParam,
  COLUMNS,
  DESKTOP,
  MOBILE,
  MOBILE_COL,
  MOBILE_ROW,
  Progress,
  ROWS,
} from '../../config/config';
import { buildAdjacencyList } from '../../algorithms/utils';
import { algorithms, Explored } from '../../algorithms/algorithms';

const grid = css({
  width: 'calc(100% - 2vw)',
  height: 'calc(100% - 2vw)',
  borderLeft: '1px solid black',
  borderBottom: '1px solid black',
  margin: '1vw',
  overflow: 'hidden',
  display: 'grid',
  [DESKTOP]: {
    gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
  },
  [MOBILE]: {
    gridTemplateRows: `repeat(${MOBILE_ROW}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${MOBILE_COL}, minmax(0, 1fr))`,
  },
});
const mobile = css({ [MOBILE]: { display: 'none' } });

const InitialTableState = (start: number, end: number, totalLength: number): Cell[] =>
  [...Array(totalLength).keys()].map(val => (val === start ? Cell.START : val === end ? Cell.END : Cell.CLEAR));

export default function Table({ styles }: { styles: SerializedStyles }) {
  const { start, end, rows, columns } = useSelector(selectDimensions);
  const status = useSelector(selectStatus);
  const algorithmKey = useSelector(selectAlgorithm);
  const maze = useSelector(selectMaze);
  const mazeSet = React.useMemo(() => new Set(maze), [maze]);
  const sessionId = useSelector(selectSessionId);
  const initialState = InitialTableState(start, end, ROWS * COLUMNS);
  const [cells, setCells] = useState(initialState);
  const dispatch = useDispatch();

  useEffect(() => setCells(initialState.map((el, index) => (mazeSet.has(index) ? Cell.WALL : el))), [mazeSet]);
  useEffect(() => setCells(initialState), [start, end, sessionId]);
  useEffect(() => {
    if (status === Progress.IN_PROGESS) {
      const { startPoint, endPoint, weights } = getPoints(cells);
      let explored: Explored = { paths: new Map(), visited: [startPoint] };
      const algorithm = algorithms[algorithmKey];
      const list = adjacencyList(cells, rows, columns);
      const { aStar, dfs, dijkstra, bellmanFord, bfs } = algorithms;

      if (algorithm === bellmanFord || algorithm === dijkstra) explored = algorithm.fn(list, startPoint);
      else if (algorithm === aStar) explored = algorithm.fn(list, startPoint, endPoint, rows, columns, weights);
      else if (algorithm === bfs || algorithm === dfs) explored = algorithm.fn(list, startPoint, endPoint);

      const path = explored.paths.get(endPoint);
      if (path?.path) setCells(state => setPath(state, path.path, start, end));
      dispatch(setStatus(Progress.IDLE));
    }
  }, [status]);

  const fn = useCallback((index: CellIndexParam, type: Cell) => setCells(prev => cellsUpdate(prev, index, type)), []);

  return (
    <div css={[grid, styles]}>
      {[...new Array(ROWS * COLUMNS)].map((_, index) => {
        const style = index >= MOBILE_ROW * MOBILE_COL ? mobile : undefined;
        return <MemoizedCell key={index} value={index} type={cells[index]} setCell={fn} style={style} />;
      })}
    </div>
  );
}

function cellsUpdate(array: Cell[], index: CellIndexParam, value: Cell) {
  const copy = [...array];
  if (Array.isArray(index)) {
    copy[index[0]] = Cell.CLEAR;
    copy[index[1]] = value;
  } else {
    copy[index] = value;
  }
  return copy;
}

function getPoints(cells: Cell[]) {
  const weights = new Set<number>();
  let startPoint, endPoint;
  for (let index = 0; index < cells.length; index++) {
    if (cells[index] === Cell.START) startPoint = index;
    else if (cells[index] === Cell.END) endPoint = index;
    else if (cells[index] === Cell.WEIGHT) weights.add(index);
  }
  if (startPoint === undefined) throw new Error('start fail');
  return { startPoint: startPoint as number, endPoint: endPoint as number, weights };
}

function getWalls(cells: Cell[]): Set<number> {
  const set = new Set<number>();
  for (let index = 0; index < cells.length; index++) {
    if (cells[index] === Cell.WALL) set.add(index);
  }
  return set;
}

function adjacencyList(cellList: Cell[], rows: number, columns: number) {
  return buildAdjacencyList(rows, columns, getWalls(cellList));
}

function setPath(cells: Cell[], path: number[], start: number, end: number): Cell[] {
  const copy = [...cells];
  for (const node of path) if (node !== start && node !== end) copy[node] = Cell.PATH;
  return copy;
}
