import { css, SerializedStyles } from '@emotion/react';
import { useState } from 'react';
import ResetSvg from '../../public/refresh.svg';
import SettingsSvg from '../../public/settings.svg';
import { algorithms } from '../../algorithms/algorithms';
import { MOBILE, DESKTOP } from '../../config/config';
import { Slideable } from '../mobile/slideable';

const container = css({ display: 'flex', flexDirection: 'row', alignItems: 'center' });
const desktop = css({ [MOBILE]: { display: 'none' } });
const mobile = css({ [DESKTOP]: { display: 'none' } });
const logo = css({ flex: 1 });
const algorithm = css({ flex: 1 });
const initialize = css({ flex: 1 });
const icon = css({ flex: 1, cursor: 'pointer' });

type HeaderProps = {
  styles: SerializedStyles;
};

export const Header = ({ styles }: HeaderProps) => {
  const [animation, startAnimation] = useState(false);
  const [options, showOptions] = useState(false);
  const animate = () => startAnimation(true);
  const stopAnimation = () => startAnimation(false);
  return (
    <>
      <header css={[styles, container]}>
        <div css={logo}>PathVisualizer</div>
        <select css={[algorithm, desktop]}>
          {Object.keys(algorithms).map(algo => (
            <option key={algo}>{algo}</option>
          ))}
        </select>
        <button type="button" css={[initialize, desktop]}>
          Visualize!
        </button>
        <div>
          <ResetSvg css={[icon, desktop]} />
        </div>
        <div>
          <SettingsSvg
            css={[icon, mobile]}
            className={animation ? 'mobileSettingsIcon' : ''}
            onClick={animate}
            onAnimationEnd={stopAnimation}
          />
        </div>
      </header>
      <Slideable open={options} close={() => showOptions(false)} />
    </>
  );
};
