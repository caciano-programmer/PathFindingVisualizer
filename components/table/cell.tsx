/* eslint-disable react-hooks/exhaustive-deps */

import React, { Dispatch, useEffect, useReducer } from 'react';
import { css } from '@emotion/react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import Start from '../../public/start.svg';
import End from '../../public/end.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { DragItem, DragType } from '../../config/config';
import { startAction, endAction, wallAction, weightAction, TableState } from './table-reducer';
import { useSelector } from 'react-redux';
import { selectSessionId } from '../../redux/store';
import { cellReducer, clear, initialCellState, toggleEnd, toggleWeight, toggleWall, toggleStart } from './cell-reducer';

const fullSize = css({ width: '100%', height: '100%' });
const icon = css({ ...fullSize });
const getCellCss = (visited: boolean) =>
  css({ borderRight: '1px solid black', borderTop: '1px solid black', backgroundColor: visited ? 'blue' : 'white' });

type CellProps = { value: number; dispatch: Dispatch<any>; start: number; end: number };

const Cell = ({ value, dispatch, start, end }: CellProps) => {
  const initialState = initialCellState(value, start, end);
  const reducer = cellReducer(initialState);
  const [{ isStart, isEnd, isWall, isWeight }, cellDispatch] = useReducer(reducer, initialState);
  const sessionId = useSelector(selectSessionId);
  const free = !isStart && !isEnd && !isWall && !isWeight;
  const cellCss = getCellCss(isWall);

  useEffect(() => {
    if (!free) cellDispatch(clear);
  }, [sessionId]);

  const dispatchStart = () => {
    dispatch(startAction(value));
    cellDispatch(toggleStart());
  };
  const dispatchEnd = () => {
    dispatch(endAction(value));
    cellDispatch(toggleEnd());
  };
  const dispatchWeight = () => {
    dispatch(weightAction(value));
    cellDispatch(toggleWeight());
  };
  const dispatchWall = () => {
    dispatch(wallAction(value));
    cellDispatch(toggleWall());
  };

  const dragged = (item: { type: DragType }, monitor: DragSourceMonitor) => {
    if (item.type === DragType.START && monitor.didDrop()) cellDispatch(toggleStart());
    else if (item.type === DragType.END && monitor.didDrop()) cellDispatch(toggleEnd());
  };
  const dragStart = useDrag({ type: DragType.START, item: { type: DragType.START }, end: dragged })[1];
  const dragEnd = useDrag({ type: DragType.END, item: { type: DragType.END }, end: dragged })[1];
  const drop = useDrop({
    accept: Object.values(DragType),
    drop({ type }: DragItem) {
      if (type === DragType.START) dispatchStart();
      if (type === DragType.END) dispatchEnd();
      if (type === DragType.WEIGHT) dispatchWeight();
    },
    canDrop: () => free,
  })[1];

  const clickCell = () => {
    if (isWeight) dispatchWeight();
    if (isWall || free) dispatchWall();
  };
  const visit = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.ctrlKey || event.shiftKey) && (free || isWall)) dispatchWall();
  };

  return (
    <div css={cellCss} ref={drop} onMouseEnter={visit} onClick={clickCell}>
      {isStart && (
        <div ref={dragStart} css={fullSize}>
          <Start css={icon} preserveAspectRatio="none" />
        </div>
      )}
      {isEnd && (
        <div ref={dragEnd} css={fullSize}>
          <End css={icon} preserveAspectRatio="none" />
        </div>
      )}
      {isWeight && (
        <div css={fullSize}>
          <KettlebellSvg css={icon} preserveAspectRatio="none" />
        </div>
      )}
    </div>
  );
};

export const MemoizedCell = React.memo(Cell);
