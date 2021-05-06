/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { MemoizedCell } from './cell';
import { useDispatch, useSelector } from 'react-redux';
import { selectAlgorithm, selectDimensions, selectMaze, selectSessionId, selectStatus } from '../../redux/store';
import { COLUMNS, DESKTOP, MOBILE, MOBILE_COL, MOBILE_ROW, Progress, ROWS } from '../../config/config';
import { animations, Cell, CellIndexParam, cellsUpdate } from './table-utils';
import { MyTheme, Theme } from '../../theme/theme';

const gridCss = (theme: Theme) =>
  css({
    width: 'calc(100% - 2vw)',
    height: 'calc(100% - 2vw)',
    borderLeft: `1px solid ${theme.grid}`,
    borderBottom: `1px solid ${theme.grid}`,
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

const InitialTableState = (start: number, end: number): Cell[] =>
  [...Array(ROWS * COLUMNS).keys()].map(val => (val === start ? Cell.START : val === end ? Cell.END : Cell.CLEAR));

export default function Table({ styles }: { styles: SerializedStyles }) {
  const { rows, columns, start, end } = useSelector(selectDimensions);
  const status = useSelector(selectStatus);
  const algorithmKey = useSelector(selectAlgorithm);
  const maze = useSelector(selectMaze);
  const mazeSet = React.useMemo(() => new Set(maze), [maze]);
  const sessionId = useSelector(selectSessionId);
  const initialState = InitialTableState(start, end);
  const [cells, setCells] = useState(initialState);
  const dispatch = useDispatch();
  const theme = useContext(MyTheme);

  const grid = gridCss(theme);

  useEffect(() => setCells(InitialTableState(start, end)), [start, end]);
  useEffect(() => setCells(initialState.map((el, index) => (mazeSet.has(index) ? Cell.WALL : el))), [mazeSet]);
  useEffect(() => setCells(initialState), [sessionId, columns, rows]);
  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    if (status === Progress.IN_PROGESS) timeoutIds = animations(cells, algorithmKey, rows, columns, setCells, dispatch);
    return () => timeoutIds.forEach(id => clearTimeout(id));
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
