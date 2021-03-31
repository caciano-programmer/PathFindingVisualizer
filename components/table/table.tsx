import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import { Cell } from './cell';
import { DESKTOP, MOBILE, MOBILE_GRID_LIMIT } from '../../config/config';

const Grid = styled.div(
  { height: '100%', width: '100%', display: 'grid', border: '1px solid black' },
  ({ rows, columns }: { rows: number; columns: number }) => ({
    [DESKTOP]: { gridTemplateColumns: `repeat(${columns}, auto)`, gridTemplateRows: `repeat(${rows}, auto)` },
    [MOBILE]: {
      gridTemplateColumns: `repeat(${MOBILE_GRID_LIMIT}, auto)`,
      gridTemplateRows: `repeat(${MOBILE_GRID_LIMIT}, auto)`,
    },
  }),
);
const desktop = css({ [MOBILE]: { display: 'none' } });

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
      {[...new Array(rows * columns)].map((_, index) => {
        if (index < 100) return <Cell key={index} clicked={clicked} value={index + 1} />;
        else return <Cell key={index} clicked={clicked} value={index + 1} styles={desktop} />;
      })}
    </Grid>
  );
};
