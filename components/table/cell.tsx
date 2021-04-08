import { css } from '@emotion/react';
import { useDrag, useDrop } from 'react-dnd';
import Start from '../../public/start.svg';
import End from '../../public/end.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { DragItem, DragType } from '../../config/config';

const fullSize = css({ width: '100%', height: '100%' });
const icon = css({ ...fullSize });
const getCellCss = (visited: boolean) =>
  css({ borderRight: '1px solid black', borderTop: '1px solid black', backgroundColor: visited ? 'blue' : 'white' });

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
  weights: number[];
  setWeights: (weight: number, add: boolean) => void;
  occupied: (node: number, checkWalls?: boolean) => boolean;
};

export const Cell = (props: CellProps) => {
  const isOccupied = props.occupied(props.value);
  const isWall = props.walls.includes(props.value);
  const isWeighted = props.weights.includes(props.value);
  const isNode = props.value === props.start || props.value === props.end;
  const cellCss = getCellCss(isWall);

  const dragStart = useDrag({ type: DragType.START, item: { type: DragType.START } })[1];
  const dragEnd = useDrag({ type: DragType.END, item: { type: DragType.END } })[1];
  const drop = useDrop({
    accept: Object.values(DragType),
    drop({ type }: DragItem) {
      props.clickOff();
      if (type === DragType.START && !isOccupied) props.moveStart(props.value);
      if (type === DragType.END && !isOccupied) props.moveEnd(props.value);
      if (type === DragType.WEIGHT && !isOccupied) props.setWeights(props.value, true);
    },
  })[1];

  const visit = (clicked: boolean, mouseover = true) => {
    if (mouseover && clicked && !isOccupied) props.editWalls(props.value, !isWall);
    if (!mouseover && isWeighted) props.setWeights(props.value, false);
    if (!mouseover && !isNode && !isWeighted) props.editWalls(props.value, !isWall);
  };

  return (
    <div css={cellCss} ref={drop} onMouseLeave={() => visit(props.clicked)} onMouseDown={() => visit(true, false)}>
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
      {props.weights.includes(props.value) && (
        <div css={fullSize}>
          <KettlebellSvg css={icon} preserveAspectRatio="none" />
        </div>
      )}
    </div>
  );
};
