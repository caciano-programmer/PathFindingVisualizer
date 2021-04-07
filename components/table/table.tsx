import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { Weight } from '../../config/config';
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
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
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
  const [weights, setWeights] = useState({ small: [], large: [] } as Weight);

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

  const weightsHandler = (weight: number, node: number) => {};
  const occupied = (node: number, checkWalls = true): boolean => {
    const inWalls = checkWalls && walls.includes(node);
    const inWeights = weights.small.includes(node) || weights.large.includes(node);
    return inWalls || inWeights || node === start || node === end;
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
            setWeights={(weight: number, node: number) => weightsHandler(weight, node)}
            occupied={(node: number, checkWalls?: boolean): boolean => occupied(node, checkWalls)}
          />
        ))}
      </Grid>
    </div>
  );
}

function editArray(array: number[], number: number, add: boolean): number[] {
  const result = add ? [...array, number] : array.filter(element => element !== number);
  return result;
}
