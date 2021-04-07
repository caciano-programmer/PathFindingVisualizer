import { useState } from 'react';
import { css } from '@emotion/react';
import { useDrag, useDrop } from 'react-dnd';
import Start from '../../public/start.svg';
import End from '../../public/end.svg';
import { Weight } from '../../config/config';

const fullSize = css({ width: '100%', height: '100%' });
const icon = css({ ...fullSize });
const getCellCss = (visited: boolean) =>
  css({ borderRight: '1px solid black', borderTop: '1px solid black', backgroundColor: visited ? 'blue' : 'white' });

enum MoveType {
  START = 'start',
  END = 'end',
}

type CellProps = {
  clicked: boolean;
  clickOff: () => void;
  value: number;
  start: number;
  moveStart: (start: number) => void;
  end: number;
  moveEnd: (end: number) => void;
  walls: number[];
  editWalls: (wall: number, add: boolean) => void;
  weights: Weight;
  setWeights: (weight: number, node: number) => void;
  occupied: (node: number, checkWalls?: boolean) => boolean;
};

export const Cell = (props: CellProps) => {
  const [visited, setVisited] = useState(false);
  const [{ isDraggingStart }, dragStart] = useDrag({
    type: MoveType.START,
    item: { val: props.value },
    collect: monitor => ({ isDraggingStart: !!monitor.isDragging() }),
    end: props.clickOff,
  });
  const [{ isDraggingEnd }, dragEnd] = useDrag({
    type: MoveType.END,
    item: { val: props.value },
    collect: monitor => ({ isDraggingEnd: !!monitor.isDragging() }),
    end: props.clickOff,
  });
  const [_, drop] = useDrop({
    accept: Object.values(MoveType),
    drop({ val }: { val: number }) {
      const isOccupied = props.occupied(props.value);
      if (val === props.start && !isOccupied) props.moveStart(props.value);
      if (val === props.end && !isOccupied) props.moveEnd(props.value);
    },
  });

  const visit = (clicked = true) => {
    const isOccupied = props.occupied(props.value, false);
    if (clicked && !isDraggingStart && !isDraggingEnd && !isOccupied) {
      props.editWalls(props.value, !visited);
      setVisited(!visited);
    }
  };

  const cellCss = getCellCss(visited);

  return (
    <div css={cellCss} ref={drop} onMouseOver={() => visit(props.clicked)} onMouseDown={() => visit()}>
      {props.value === props.start && (
        <div ref={dragStart} css={fullSize}>
          <Start css={icon} preserveAspectRatio="none" />
        </div>
      )}
      {props.value === props.end && (
        <div ref={dragEnd} css={fullSize}>
          <End css={icon} preserveAspectRatio="none" />
        </div>
      )}
    </div>
  );
};
