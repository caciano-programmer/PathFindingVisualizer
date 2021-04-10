import React from 'react';
import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { useReducer } from 'react';
import { MemoizedCell } from './cell';
import { InitialTableState, tableReducer } from './table-reducer';

const border = css({
  width: 'calc(100% - 2vw)',
  height: 'calc(100% - 2vw)',
  borderLeft: '1px solid black',
  borderBottom: '1px solid black',
  margin: '1vw',
  overflow: 'hidden',
});
const Grid = styled.div(
  { display: 'grid', width: '100%', height: '100%' },
  ({ rows, columns }: { rows: number; columns: number }) => ({
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  }),
);

type TableProp = {
  columns: number;
  rows: number;
  start: number;
  end: number;
  styles: SerializedStyles;
};

export default function Table({ columns, rows, start, end, styles }: TableProp) {
  const initialState = React.useMemo(() => InitialTableState(start, end), [start, end]);
  const reducer = tableReducer(initialState);
  const [tableData, dispatch] = useReducer(reducer, initialState);

  return (
    <div css={[border, styles]}>
      <Grid rows={rows} columns={columns}>
        {[...new Array(rows * columns)].map((_, index) => (
          <MemoizedCell
            key={index}
            value={index + 1}
            dispatch={dispatch}
            start={initialState.start}
            end={initialState.end}
          />
        ))}
      </Grid>
    </div>
  );
}
