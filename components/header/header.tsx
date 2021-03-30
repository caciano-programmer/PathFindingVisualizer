import { css, SerializedStyles } from '@emotion/react';
import ResetSvg from '../../public/refresh.svg';
import SettingsSvg from '../../public/settings.svg';
import { algorithms } from '../../algorithms/algorithms';
import { useMediaQuery, Screen } from '../../hooks/mediaQuery';

const container = css({ display: 'flex', flexDirection: 'row', alignItems: 'center' });
const logo = css({ flex: 1 });
const algorithm = css({ flex: 1 });
const initialize = css({ flex: 1 });
const icon = css({ flex: 1, cursor: 'pointer' });

type HeaderProps = {
  styles: SerializedStyles;
};

export const Header = ({ styles }: HeaderProps) => {
  const screen = useMediaQuery();
  const mobile = screen === Screen.MobileLandscape || screen === Screen.MobilePortrait;
  return (
    <header css={[styles, container]}>
      <div css={logo}>PathVisualizer</div>
      <select css={algorithm}>
        {Object.keys(algorithms).map(algo => (
          <option key={algo}>{algo}</option>
        ))}
      </select>
      <button type="button" css={initialize}>
        Visualize!
      </button>
      <ResetSvg css={icon} />
      <SettingsSvg css={icon} />
    </header>
  );
};
