/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext } from 'react';
import { css, SerializedStyles, keyframes } from '@emotion/react';
import { useDrag, useDrop } from 'react-dnd';
import Start from '../../public/start.svg';
import End from '../../public/end.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { Cell as CellType, cellColor, CellIndexParam, DragItem, DragItemList, isDragType } from './table-utils';
import { MyTheme, Theme } from '../../theme/theme';
import { DESKTOP, MOBILE } from '../../config/config';

const fullSize = css({ width: '100%', height: '100%' });
const glowAnimation = ({ animation: { path } }: Theme) =>
  keyframes({
    '0%': { borderRadius: '50%', filter: `drop-shadow(0 0 0 ${path})`, boxShadow: `0 0 1px 1px ${path}` },
    '75%': { filter: `drop-shadow(0 0 max(5vw, 4vh) ${path})`, boxShadow: `0 0 15px 1px ${path}` },
    '100%': { filter: `drop-shadow(0 0 max(1vw, 1vh) ${path})`, borderRadius: '50%', boxShadow: `0 0 0 0 ${path}` },
  });
const searchedAnimation = ({ animation }: Theme) =>
  keyframes({
    '0%': { width: '25%', height: '25%', backgroundColor: animation.startColor, borderRadius: '25%' },
    '30%': { width: '50%', height: '50%', borderRadius: '50%' },
    '60%': { width: '75%', height: '75%', backgroundColor: animation.midColor, borderRadius: '75%' },
    '100%': { width: '100%', height: '100%', backgroundColor: animation.finalColor },
  });
const searchedCss = (theme: Theme) => {
  const animation = searchedAnimation(theme);
  return css({ animation: `${animation} 1s` });
};
const startPointCss = (theme: Theme, path: boolean) => {
  const animation = glowAnimation(theme);
  return css({ fill: path ? theme.animation.path : theme.secondary, animation: path ? `${animation} 2s` : '' });
};
const grabItem = (isDragItem: boolean) => css({ cursor: isDragItem ? 'grab' : 'default' });
const getCellCss = (type: CellType, theme: Theme, animate: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: `1px solid ${theme.grid}`,
    borderTop: `1px solid ${theme.grid}`,
    backgroundColor: `${cellColor(type, theme)}`,
    transition: type !== CellType.SEARCHED && animate ? `background-color 1s` : '',
  });
const weight = (isSmall: boolean, theme: Theme) =>
  css({ [DESKTOP]: { fill: isSmall ? theme.smallWeight : theme.largeWeight }, [MOBILE]: { fill: theme.main } });

type CellProps = {
  value: number;
  type: CellType;
  setCell: (index: CellIndexParam, type: CellType) => void;
  style?: SerializedStyles;
};

const Cell = ({ value, type, setCell, style }: CellProps) => {
  const { isWeight, small, start, end } = isDragType(type);
  const theme = useContext(MyTheme);

  const cellCss = getCellCss(type, theme, type !== CellType.CLEAR && type !== CellType.WALL);
  const grabCss = grabItem(isWeight || type === CellType.START || type === CellType.END);
  const weightCss = weight(small, theme);
  const startPoint = startPointCss(theme, type === CellType.START_PATH || type === CellType.END_PATH);
  const searched = searchedCss(theme);

  const dragItem = useDrag({ type, item: { type, value } })[1];
  const drop = useDrop({
    accept: DragItemList,
    drop: ({ type, value: previous }: DragItem) => {
      const { baseType } = isDragType(type);
      return previous === undefined ? setCell(value, type) : setCell([previous, value], baseType);
    },
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
    const { baseType } = isDragType(type);
    const data = { movedVal: value, movedType: baseType };
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
          {start && <Start css={[fullSize, startPoint]} preserveAspectRatio="none" />}
          {end && <End css={[fullSize, startPoint]} preserveAspectRatio="none" />}
          {isWeight && <KettlebellSvg css={[fullSize, weightCss]} preserveAspectRatio="none" />}
        </div>
      )}
      {type === CellType.SEARCHED && <div css={searched} />}
    </div>
  );
};

export const MemoizedCell = React.memo(Cell);
