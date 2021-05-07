import { css, SerializedStyles } from '@emotion/react';
import ResetSvg from '../../public/refresh.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { useDrag } from 'react-dnd';
import { resetState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { Cell } from '../table/table-utils';
import { StartButton } from '../shared/startButton';
import { useContext } from 'react';
import { MyTheme, Theme } from '../../theme/theme';

const container = css({ display: 'flex', flexDirection: 'row', alignItems: 'center' });
const flexItem = css({ textAlign: 'center' });
const iconHolder = css({ flex: 1 });
const iconCss = (theme: Theme) => css({ height: '10vh', width: '10vh', fill: theme.main });
const initialize = css({ flex: 1.5, height: '50%' });

export const Footer = ({ styles }: { styles: SerializedStyles }) => {
  const dragWeight = useDrag({ type: Cell.WEIGHT_SM, item: { type: Cell.WEIGHT_SM } })[1];
  const dispatch = useDispatch();
  const theme = useContext(MyTheme);
  const icon = iconCss(theme);

  const dragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ movedType: Cell.WEIGHT_SM }));
  };

  return (
    <div css={[styles, container]}>
      <div css={[iconHolder, flexItem]} ref={dragWeight} draggable={true} onDragStart={dragStart}>
        <KettlebellSvg css={icon} />
      </div>
      <StartButton styles={initialize} fontSize="4vh" />
      <div css={[iconHolder, flexItem]} onClick={() => dispatch(resetState())}>
        <ResetSvg css={icon} />
      </div>
    </div>
  );
};
