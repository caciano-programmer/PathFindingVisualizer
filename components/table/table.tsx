import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { Cell } from './cell';

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
  styles: SerializedStyles;
};

export default function Table({ columns, rows, styles }: TableProp) {
  const [clicked, setClicked] = useState(false);
  const [start, moveStart] = useState(1);
  const [end, moveEnd] = useState(81);
  const [walls, setWalls] = useState([] as number[]);
  const [weights, setWeights] = useState([] as number[]);

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

  const occupied = (node: number, checkWalls = true): boolean => {
    return (checkWalls && walls.includes(node)) || weights.includes(node) || node === start || node === end;
  };

  return (
    <div css={[border, styles]}>
      <Grid rows={rows} columns={columns}>
        {[...new Array(rows * columns)].map((_, index) => (
          <Cell
            key={index}
            clicked={clicked}
            clickOff={() => setClicked(false)}
            value={index + 1}
            start={start}
            moveStart={(node: number) => moveStart(node)}
            end={end}
            moveEnd={(node: number) => moveEnd(node)}
            walls={walls}
            editWalls={(number, add) => setWalls(previous => editArray(previous, number, add))}
            weights={weights}
            setWeights={(number, add) => setWeights(previous => editArray(previous, number, add))}
            occupied={(node: number, checkWalls?: boolean): boolean => occupied(node, checkWalls)}
          />
        ))}
      </Grid>
    </div>
  );
}

function editArray(array: number[], number: number, add: boolean): number[] {
  return add ? [...array, number] : array.filter(element => element !== number);
}
