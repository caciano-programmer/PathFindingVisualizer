/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { MemoizedCell } from './cell';
import { useDispatch, useSelector } from 'react-redux';
import { selectAlgorithm, selectDimensions, selectMaze, selectSessionId, selectStatus } from '../../redux/store';
import { COLUMNS, DESKTOP, MOBILE, MOBILE_COL, MOBILE_ROW, Progress, ROWS } from '../../config/config';
import { algorithms, Explored } from '../../algorithms/algorithms';
import { Cell, CellIndexParam, cellsUpdate, getPoints, setPathAnimations } from './table-utils';
import { buildAdjacencyList } from '../../algorithms/utils';

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

const InitialTableState = (rows: number, columns: number, points: StartPoints): Cell[] =>
  [...Array(rows * columns).keys()].map(val =>
    val === points?.start ? Cell.START : val === points?.end ? Cell.END : Cell.CLEAR,
  );

type StartPoints = { start: number; end: number } | undefined;
type TableProps = { styles: SerializedStyles; startPoints: StartPoints };

export default function Table({ styles, startPoints }: TableProps) {
  const { rows, columns } = useSelector(selectDimensions);
  const status = useSelector(selectStatus);
  const algorithmKey = useSelector(selectAlgorithm);
  const maze = useSelector(selectMaze);
  const mazeSet = React.useMemo(() => new Set(maze), [maze]);
  const sessionId = useSelector(selectSessionId);
  const initialState = InitialTableState(rows, columns, startPoints);
  const [cells, setCells] = useState(initialState);
  const dispatch = useDispatch();

  useEffect(() => setCells(initialState.map((el, index) => (mazeSet.has(index) ? Cell.WALL : el))), [mazeSet]);
  useEffect(() => setCells(initialState), [sessionId, columns, rows, algorithmKey]);
  useEffect(() => {
    if (startPoints === undefined) return;
    if (status === Progress.IN_PROGESS) {
      const { startPoint, endPoint, weights, walls } = getPoints(cells);
      let explored: Explored = { paths: new Map(), visited: [startPoint] };
      const algorithm = algorithms[algorithmKey];
      const list = buildAdjacencyList(rows, columns, walls);
      const { aStar, dfs, dijkstra, bellmanFord, bfs } = algorithms;
      let timeoutIds: NodeJS.Timeout[] = [];

      if (algorithm === bellmanFord || algorithm === dijkstra) explored = algorithm.fn(list, startPoint);
      else if (algorithm === aStar) explored = algorithm.fn(list, startPoint, endPoint, columns, weights);
      else if (algorithm === bfs || algorithm === dfs) explored = algorithm.fn(list, startPoint, endPoint);
      console.log(explored);
      const path = explored.paths.get(endPoint);
      if (path?.path) timeoutIds = setPathAnimations(cells, path.path, explored.visited, setCells, dispatch);

      return () => timeoutIds.forEach(id => clearTimeout(id));
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
