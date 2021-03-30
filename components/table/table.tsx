import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { SerializedStyles } from '@emotion/utils';
import { Cell } from './cell';

const Grid = styled.div(
  { height: '100%', width: '100%', display: 'grid', border: '1px solid black' },
  ({ rows, columns }: { rows: number; columns: number }) => ({
    gridTemplateColumns: `repeat(${columns}, auto)`,
    gridTemplateRows: `repeat(${rows}, auto)`,
  }),
);

type TableProp = {
  columns: number;
  rows: number;
  styles: SerializedStyles;
};

export const Table = ({ columns, rows, styles }: TableProp) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const listenerDown = () => setClicked(true);
    const listenerUp = () => setClicked(false);
    window.addEventListener('mousedown', listenerDown);
    window.addEventListener('mouseup', listenerUp);
    return () => {
      window.removeEventListener('mousedown', listenerDown);
      window.removeEventListener('mouseup', listenerUp);
    };
  }, []);

  return (
    <Grid columns={columns} rows={rows} css={styles}>
      {[...new Array(rows * columns)].map((_, index) => (
        <Cell key={index} clicked={clicked} value={index + 1} />
      ))}
    </Grid>
  );
};
