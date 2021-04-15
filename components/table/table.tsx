/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { MemoizedCell } from './cell';
import { useSelector } from 'react-redux';
import { selectDimensions, selectMaze, selectSessionId } from '../../redux/store';
import { Cell, CellIndexParam, COLUMNS, DESKTOP, MOBILE, MOBILE_COL, MOBILE_ROW, ROWS } from '../../config/config';

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
  const { start, end } = useSelector(selectDimensions);
  const maze = useSelector(selectMaze);
  const mazeSet = React.useMemo(() => new Set(maze), [maze]);
  const sessionId = useSelector(selectSessionId);
  const initialState = InitialTableState(start, end, ROWS * COLUMNS);
  const [cells, setCells] = useState(initialState);

  useEffect(() => setCells(initialState.map((el, index) => (mazeSet.has(index) ? Cell.WALL : el))), [mazeSet]);
  useEffect(() => setCells(initialState), [start, end, sessionId]);

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
