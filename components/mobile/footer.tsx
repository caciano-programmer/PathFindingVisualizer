import { css, SerializedStyles } from '@emotion/react';
import { AlgorithmKey, algorithms } from '../../algorithms/algorithms';
import ResetSvg from '../../public/refresh.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { useDrag } from 'react-dnd';
import { Cell } from '../../config/config';
import { resetState, selectAlgorithm, setAlgorithm } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';

const container = css({ display: 'flex' });
const iconHolder = css({ flex: 1, minWidth: 0 });
const icon = css({ height: '100%', weight: '100%' });
const algorithm = css({ flex: 1 });
const initialize = css({ flex: 1 });

type FooterProps = {
  styles: SerializedStyles;
};

export const Footer = ({ styles }: FooterProps) => {
  const dragWeight = useDrag({ type: Cell.WEIGHT, item: { type: Cell.WEIGHT } })[1];
  const { key } = useSelector(selectAlgorithm);
  const dispatch = useDispatch();

  return (
    <div css={[styles, container]}>
      <div css={iconHolder} ref={dragWeight}>
        <KettlebellSvg css={icon} preserveAspectRatio="none" />
      </div>
      <select
        css={algorithm}
        value={key}
        onChange={event => dispatch(setAlgorithm(event.target.value as AlgorithmKey))}
      >
        {Object.entries(algorithms).map(([currentKey, { name }]) => (
          <option key={currentKey}>{name}</option>
        ))}
      </select>
      <button type="button" css={initialize}>
        Visualize!
      </button>
      <div css={iconHolder} onClick={() => dispatch(resetState())}>
        <ResetSvg css={icon} preserveAspectRatio="none" />
      </div>
    </div>
  );
};
