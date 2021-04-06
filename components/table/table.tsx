import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DESKTOP, MOBILE, MOBILE_GRID_LIMIT } from '../../config/config';
import { Cell } from './cell';

const border = css({
  width: 'calc(100% - 2vw)',
  height: 'calc(100% - 2vw)',
  borderLeft: '1px solid black',
  borderBottom: '1px solid black',
  margin: '1vw',
});
const Grid = styled.div(
  { display: 'grid', width: '100%', height: '100%' },
  ({ rows, columns }: { rows: number; columns: number }) => ({
    [DESKTOP]: { gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` },
    [MOBILE]: {
      gridTemplateColumns: `repeat(${MOBILE_GRID_LIMIT}, 1fr)`,
      gridTemplateRows: `repeat(${MOBILE_GRID_LIMIT}, 1fr)`,
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
  const [start, moveStart] = useState(1);
  const [walls, setWalls] = useState([] as number[]);
  const [weights, setWeights] = useState({ small: [], large: [] });
  const [path, setPath] = useState([] as number[]);

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
    <DndProvider backend={HTML5Backend}>
      <div css={[border, styles]}>
        <Grid columns={columns} rows={rows}>
          {[...new Array(rows * columns)].map((_, index) => (
            <Cell
              key={index}
              clicked={clicked}
              value={index + 1}
              start={start}
              setStart={(start: number) => moveStart(start)}
              styles={index >= 100 ? desktop : undefined}
              editWalls={(number, add) => setWalls(previous => editArray(previous, number, add))}
            />
          ))}
        </Grid>
      </div>
    </DndProvider>
  );
};

function editArray(array: number[], number: number, add: boolean): number[] {
  const result = add ? [...array, number] : array.filter(element => element !== number);
  console.log(result);
  return result;
}
