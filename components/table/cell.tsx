/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { useDrag, useDrop } from 'react-dnd';
import Start from '../../public/start.svg';
import End from '../../public/end.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { Cell as CellType, cellColor, CellIndexParam, DragItem, DragItemList, isWeightType } from './table-utils';

const fullSize = css({ width: '100%', height: '100%' });
const icon = css({ ...fullSize });
const grabItem = (isDragItem: boolean) => css({ cursor: isDragItem ? 'grab' : 'default' });
const getCellCss = (type: CellType, animate: boolean) =>
  css({
    borderRight: '1px solid black',
    borderTop: '1px solid black',
    backgroundColor: `${cellColor(type)}`,
    transition: animate ? `background-color 1.5s` : '',
  });

type CellProps = {
  value: number;
  type: CellType;
  setCell: (index: CellIndexParam, type: CellType) => void;
  style?: SerializedStyles;
};

const Cell = ({ value, type, setCell, style }: CellProps) => {
  const { isWeight } = isWeightType(type);
  const cellCss = getCellCss(type, type !== CellType.CLEAR && type !== CellType.WALL);
  const grabCss = grabItem(isWeight || type === CellType.START || type === CellType.END);

  const dragItem = useDrag({ type, item: { type, value } })[1];

  const drop = useDrop({
    accept: DragItemList,
    drop: ({ type, value: previous }: DragItem) =>
      previous === undefined ? setCell(value, type) : setCell([previous, value], type),
    canDrop: () => type === CellType.CLEAR,
  })[1];

  const clickCell = () => {
    if (type === CellType.CLEAR) setCell(value, CellType.WALL);
    else if (!isWeight || type === CellType.WALL) setCell(value, CellType.CLEAR);
  };
  const visit = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.ctrlKey || event.shiftKey) {
      if (type === CellType.CLEAR) setCell(value, CellType.WALL);
      else if (type === CellType.WALL) setCell(value, CellType.CLEAR);
    }
  };
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const { isWeight, small } = isWeightType(type);
    const movedType = isWeight ? (small ? CellType.WEIGHT_SM : CellType.WEIGHT_LG) : type;
    const data = { movedVal: value, movedType };
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
  };
  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const dropContainer = (event: React.DragEvent<HTMLDivElement>) => {
    if (type !== CellType.CLEAR) return;
    event.preventDefault();
    const { movedVal, movedType } = JSON.parse(event.dataTransfer.getData('text/plain'));
    if (movedVal != undefined) setCell([movedVal, value], movedType);
    else setCell(value, movedType);
  };

  return (
    <div
      css={[cellCss, grabCss, style]}
      ref={drop}
      onMouseEnter={visit}
      onClick={clickCell}
      onDrop={dropContainer}
      onDragOver={allowDrop}
    >
      {DragItemList.includes(type) && (
        <div ref={dragItem} css={fullSize} draggable={true} onDragStart={onDragStart}>
          {type === CellType.START && <Start css={icon} preserveAspectRatio="none" />}
          {type === CellType.END && <End css={icon} preserveAspectRatio="none" />}
          {isWeight && <KettlebellSvg css={icon} preserveAspectRatio="none" />}
        </div>
      )}
    </div>
  );
};

export const MemoizedCell = React.memo(Cell);
