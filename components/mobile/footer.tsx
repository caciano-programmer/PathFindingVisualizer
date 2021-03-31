import { css, SerializedStyles } from '@emotion/react';
import { algorithms } from '../../algorithms/algorithms';
import ResetSvg from '../../public/refresh.svg';
import KettlebellSvg from '../../public/kettlebell.svg';

const container = css({ display: 'flex' });
const icon = css({ flex: 1, width: '40px', height: '40px', cursor: 'pointer' });
const algorithm = css({ flex: 1 });
const initialize = css({ flex: 1 });

type FooterProps = {
  styles: SerializedStyles;
};

export const Footer = ({ styles }: FooterProps) => (
  <div css={[styles, container]}>
    <KettlebellSvg css={icon} />
    <select css={algorithm}>
      {Object.keys(algorithms).map(algo => (
        <option key={algo}>{algo}</option>
      ))}
    </select>
    <button type="button" css={initialize}>
      Visualize!
    </button>
    <div>
      <ResetSvg css={icon} />
    </div>
  </div>
);
