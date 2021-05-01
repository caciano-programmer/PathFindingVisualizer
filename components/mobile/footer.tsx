import { css, SerializedStyles } from '@emotion/react';
import { AlgorithmKey, algorithms } from '../../algorithms/algorithms';
import ResetSvg from '../../public/refresh.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { useDrag } from 'react-dnd';
import { Progress } from '../../config/config';
import { resetState, selectAlgorithm, setAlgorithm, setStatus } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Cell } from '../table/table-utils';

const container = css({ display: 'flex' });
const iconHolder = css({ flex: 1, minWidth: 0 });
const icon = css({ height: '100%', weight: '100%' });
const algorithm = css({ flex: 1 });
const initialize = css({ flex: 1 });

type FooterProps = {
  styles: SerializedStyles;
};

export const Footer = ({ styles }: FooterProps) => {
  const dragWeight = useDrag({ type: Cell.WEIGHT_SM, item: { type: Cell.WEIGHT_SM } })[1];
  const key = useSelector(selectAlgorithm);
  const dispatch = useDispatch();

  const dragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ movedType: Cell.WEIGHT_SM }));
  };

  return (
    <div css={[styles, container]}>
      <div css={iconHolder} ref={dragWeight} draggable={true} onDragStart={dragStart}>
        <KettlebellSvg css={icon} preserveAspectRatio="none" />
      </div>
      <select
        css={algorithm}
        value={key}
        onChange={event => dispatch(setAlgorithm(event.target.value as AlgorithmKey))}
      >
        {Object.entries(algorithms).map(([currentKey, { name }]) => (
          <option key={currentKey} value={currentKey} disabled={key === currentKey}>
            {name}
          </option>
        ))}
      </select>
      <button type="button" css={initialize} onClick={() => dispatch(setStatus(Progress.IN_PROGESS))}>
        Visualize!
      </button>
      <div css={iconHolder} onClick={() => dispatch(resetState())}>
        <ResetSvg css={icon} preserveAspectRatio="none" />
      </div>
    </div>
  );
};
