/* eslint-disable react-hooks/exhaustive-deps */

import { css, SerializedStyles } from '@emotion/react';
import ResetSvg from '../../public/icons/refresh.svg';
import KettlebellSvg from '../../public/icons/kettlebell.svg';
import { useDrag } from 'react-dnd';
import { resetState, selectStatus, setStatus } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Cell } from '../table/table-utils';
import { Button } from '../shared/startButton';
import { useContext } from 'react';
import { MyTheme, Theme } from '../../theme/theme';
import { Progress } from '../../config/config';
import React from 'react';

const container = css({ display: 'flex', flexDirection: 'row', alignItems: 'center' });
const flexItem = css({ textAlign: 'center' });
const iconHolder = css({ flex: 1 });
const iconCss = (theme: Theme) => css({ height: '10vh', width: '10vh', fill: theme.main });
const initialize = css({ flex: 1.5, height: '50%' });

export const Footer = ({ styles }: { styles: SerializedStyles }) => {
  const dragWeight = useDrag({ type: Cell.WEIGHT_SM, item: { type: Cell.WEIGHT_SM } })[1];
  const dispatch = useDispatch();
  const disabled = useSelector(selectStatus) === Progress.IN_PROGESS;
  const theme = useContext(MyTheme);
  const visualize = React.useCallback(() => dispatch(setStatus(Progress.IN_PROGESS)), []);
  const icon = iconCss(theme);

  const dragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ movedType: Cell.WEIGHT_SM }));
  };

  return (
    <div css={[styles, container]}>
      <div css={[iconHolder, flexItem]} ref={dragWeight} draggable={true} onDragStart={dragStart}>
        <KettlebellSvg css={icon} />
      </div>
      <Button styles={initialize} fontSize="4vh" input="Visualize" disabled={disabled} click={visualize} />
      <div css={[iconHolder, flexItem]} onClick={() => dispatch(resetState())}>
        <ResetSvg css={icon} />
      </div>
    </div>
  );
};
