import { css } from '@emotion/react';
import WeightSvg from '../../public/weights.svg';
import TutorialSvg from '../../public/tutorial.svg';
import LightThemeSvg from '../../public/light.svg';
import DarkThemeSvg from '../../public/dark.svg';

const container = css({
  display: 'flex',
  flexDirection: 'column',
});
const child = css({
  flex: '1',
});

export const Sidebar = () => (
  <div css={container}>
    <div css={child}>
      Tutorial
      <TutorialSvg />
    </div>
    <div css={child}>
      Theme
      <LightThemeSvg />
      <DarkThemeSvg />
    </div>
    <div css={child}>
      <div>
        Small:
        <WeightSvg />
      </div>
      <div>
        Large:
        <WeightSvg />
      </div>
    </div>
    <div css={child}>
      <button type="button">Generate Maze</button>
    </div>
    <div css={child}>Colors of dividers</div>
  </div>
);
