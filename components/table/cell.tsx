import { useState } from 'react';
import { css, SerializedStyles } from '@emotion/react';
import Start from '../../public/start.svg';
import { useDrag, useDrop } from 'react-dnd';

const icon = css({ width: '100%', height: '100%' });
const getCellCss = (visited: boolean) =>
  css({ borderRight: '1px solid black', borderTop: '1px solid black', backgroundColor: visited ? 'blue' : 'white' });

type CellProps = {
  clicked: boolean;
  value: number;
  start: number;
  setStart: (start: number) => void;
  styles?: SerializedStyles;
  editWalls: (wall: number, add: boolean) => void;
};

export const Cell = ({ clicked, value, styles, start, setStart, editWalls }: CellProps) => {
  const [visited, setVisited] = useState(false);
  const cellCss = getCellCss(visited);
  const [{ isDraggingStart }, dragStart] = useDrag({
    type: 'start',
    item: value,
    collect: monitor => ({ isDraggingStart: !!monitor.isDragging() }),
  });
  const [{ isDraggingEnd }, dragEnd] = useDrag({
    type: 'end',
    item: value,
    collect: monitor => ({ isDraggingEnd: !!monitor.isDragging() }),
  });
  const [dropCollected, drop] = useDrop({ accept: ['start', 'end'], drop: () => setStart(value) });

  const visit = (clicked = true) => {
    if (clicked && !isDraggingStart && !isDraggingEnd) {
      editWalls(value, !visited);
      setVisited(!visited);
    }
  };

  return (
    <div css={[cellCss, styles]} ref={drop} onMouseOver={() => visit(clicked)} onMouseDown={() => visit()}>
      {value === start && (
        <div ref={dragStart} style={{ width: '100%', height: '100%' }}>
          <Start css={icon} />
        </div>
      )}
    </div>
  );
};
