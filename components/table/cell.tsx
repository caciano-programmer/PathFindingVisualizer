/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';
import { css } from '@emotion/react';
import { useDrag, useDrop } from 'react-dnd';
import Start from '../../public/start.svg';
import End from '../../public/end.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { Cell as CellType, CellIndexParam, DragItem } from '../../config/config';

const fullSize = css({ width: '100%', height: '100%' });
const icon = css({ ...fullSize });
const grabItem = (isDragItem: boolean) => css({ cursor: isDragItem ? 'grab' : 'default' });
const getCellCss = (visited: boolean) =>
  css({ borderRight: '1px solid black', borderTop: '1px solid black', backgroundColor: visited ? 'blue' : 'white' });

type CellProps = { value: number; type: CellType; setCell: (index: CellIndexParam, type: CellType) => void };

const Cell = ({ value, type, setCell }: CellProps) => {
  const cellCss = getCellCss(type === CellType.WALL);
  const grabCss = grabItem([CellType.START, CellType.END, CellType.WEIGHT].includes(type));

  const dragStart = useDrag({ type: CellType.START, item: { type: CellType.START, value } })[1];
  const dragEnd = useDrag({ type: CellType.END, item: { type: CellType.END, value } })[1];
  const dragWeight = useDrag({ type: CellType.WEIGHT, item: { type: CellType.WEIGHT, value } })[1];
  const drop = useDrop({
    accept: [CellType.START, CellType.END, CellType.WEIGHT],
    drop: ({ type, value: previous }: DragItem) =>
      previous === undefined ? setCell(value, type) : setCell([previous, value], type),
    canDrop: () => type === CellType.CLEAR,
  })[1];

  const clickCell = () => {
    if (type === CellType.CLEAR) setCell(value, CellType.WALL);
    else if (type === CellType.WEIGHT || type === CellType.WALL) setCell(value, CellType.CLEAR);
  };
  const visit = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.ctrlKey || event.shiftKey) {
      if (type === CellType.CLEAR) setCell(value, CellType.WALL);
      else if (type === CellType.WALL) setCell(value, CellType.CLEAR);
    }
  };

  return (
    <div css={[cellCss, grabCss]} ref={drop} onMouseEnter={visit} onClick={clickCell}>
      {type === CellType.START && (
        <div ref={dragStart} css={fullSize}>
          <Start css={icon} preserveAspectRatio="none" />
        </div>
      )}
      {type === CellType.END && (
        <div ref={dragEnd} css={fullSize}>
          <End css={icon} preserveAspectRatio="none" />
        </div>
      )}
      {type === CellType.WEIGHT && (
        <div css={[fullSize]} ref={dragWeight}>
          <KettlebellSvg css={icon} preserveAspectRatio="none" />
        </div>
      )}
    </div>
  );
};

export const MemoizedCell = React.memo(Cell);
