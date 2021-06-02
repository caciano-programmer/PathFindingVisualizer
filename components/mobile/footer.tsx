/* eslint-disable react-hooks/exhaustive-deps */

import { css, SerializedStyles } from '@emotion/react';
import ResetSvg from '../../public/icons/refresh.svg';
import KettlebellSvg from '../../public/icons/kettlebell.svg';
import { useDrag } from 'react-dnd';
import { resetState, selectAlgorithmDraggable, selectStatus, setStatus } from '../../redux/store';
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
const weightCss = (theme: Theme, draggable: boolean) =>
  css({ fill: draggable ? theme.main : theme.disabled.primary, height: '8.5vh', width: '8.5vh' });
const iconCss = (theme: Theme) => css({ fill: theme.main, height: '8.5vh', width: '8.5vh' });
const initialize = css({ flex: 1.5, height: '50%' });

export const Footer = ({ styles }: { styles: SerializedStyles }) => {
  const dragWeight = useDrag({ type: Cell.WEIGHT_LG, item: { type: Cell.WEIGHT_LG } })[1];
  const dispatch = useDispatch();
  const disabled = useSelector(selectStatus) === Progress.IN_PROGESS;
  const withWeight = useSelector(selectAlgorithmDraggable);
  const theme = useContext(MyTheme);
  const visualize = React.useCallback(() => dispatch(setStatus(Progress.IN_PROGESS)), []);

  const icon = iconCss(theme);
  const weight = weightCss(theme, withWeight);

  const dragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ movedType: Cell.WEIGHT_LG }));
  };

  return (
    <div css={[styles, container]}>
      <div
        css={[iconHolder, flexItem]}
        ref={withWeight ? dragWeight : null}
        draggable={withWeight}
        onDragStart={dragStart}
      >
        <KettlebellSvg css={weight} />
      </div>
      <Button styles={initialize} fontSize="4vh" input="Visualize" disabled={disabled} click={visualize} />
      <div css={[iconHolder, flexItem]} onClick={() => dispatch(resetState())}>
        <ResetSvg css={icon} />
      </div>
    </div>
  );
};
