/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { MemoizedCell } from './cell';
import { useSelector } from 'react-redux';
import { selectDimensions, selectMaze, selectSessionId } from '../../redux/store';
import { Cell, CellIndexParam } from '../../config/config';

const border = css({
  width: 'calc(100% - 2vw)',
  height: 'calc(100% - 2vw)',
  borderLeft: '1px solid black',
  borderBottom: '1px solid black',
  margin: '1vw',
  overflow: 'hidden',
});
const Grid = React.memo(
  styled.div(
    { display: 'grid', width: '100%', height: '100%' },
    ({ rows, columns }: { rows: number; columns: number }) => ({
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    }),
  ),
);

const InitialTableState = (start: number, end: number, totalLength: number): Cell[] =>
  [...Array(totalLength).keys()].map(val => (val === start ? Cell.START : val === end ? Cell.END : Cell.CLEAR));

export default function Table({ styles }: { styles: SerializedStyles }) {
  const { rows, columns, start, end } = useSelector(selectDimensions);
  const maze = useSelector(selectMaze);
  const mazeSet = React.useMemo(() => new Set(maze), [maze]);
  const sessionId = useSelector(selectSessionId);
  const initialState = InitialTableState(start, end, rows * columns);
  const [cells, setCells] = useState(initialState);

  useEffect(() => setCells([...initialState]), [sessionId]);
  useEffect(() => setCells(initialState.map((el, index) => (mazeSet.has(index) ? Cell.WALL : el))), [mazeSet]);

  const fn = useCallback((index: CellIndexParam, type: Cell) => setCells(prev => cellsUpdate(prev, index, type)), []);

  return (
    <div css={[border, styles]}>
      <Grid rows={rows} columns={columns}>
        {[...new Array(rows * columns)].map((_, index) => (
          <MemoizedCell key={index} value={index} type={cells[index]} setCell={fn} />
        ))}
      </Grid>
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
