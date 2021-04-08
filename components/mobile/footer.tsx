import { css, SerializedStyles } from '@emotion/react';
import { algorithms } from '../../algorithms/algorithms';
import ResetSvg from '../../public/refresh.svg';
import KettlebellSvg from '../../public/kettlebell.svg';
import { useDrag } from 'react-dnd';
import { DragType } from '../../config/config';

const container = css({ display: 'flex' });
const iconHolder = css({ flex: 1 });
const icon = css({ height: '100%', weight: '100%', minHeight: 0, minWidth: 0 });
const algorithm = css({ flex: 1 });
const initialize = css({ flex: 1 });

type FooterProps = {
  styles: SerializedStyles;
};

export const Footer = ({ styles }: FooterProps) => {
  const dragWeight = useDrag({ type: DragType.WEIGHT, item: { type: DragType.WEIGHT } })[1];
  return (
    <div css={[styles, container]}>
      <div css={iconHolder} ref={dragWeight}>
        <KettlebellSvg css={icon} preserveAspectRatio="none" />
      </div>
      <select css={algorithm}>
        {Object.keys(algorithms).map(algo => (
          <option key={algo}>{algo}</option>
        ))}
      </select>
      <button type="button" css={initialize}>
        Visualize!
      </button>
      <div css={iconHolder}>
        <ResetSvg css={icon} preserveAspectRatio="none" />
      </div>
    </div>
  );
};
