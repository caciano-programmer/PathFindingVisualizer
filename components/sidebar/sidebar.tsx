import { css, SerializedStyles } from '@emotion/react';
import KettlebellSvg from '../../public/kettlebell.svg';
import TutorialSvg from '../../public/tutorial.svg';
import LightThemeSvg from '../../public/light.svg';
import DarkThemeSvg from '../../public/dark.svg';
import CodeSvg from '../../public/code.svg';
import StartSvg from '../../public/start.svg';
import DestinationSvg from '../../public/end.svg';
import MazeSvg from '../../public/maze.svg';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  padding: '1vw',
});
const child = css({
  flex: '1',
});
const icons = css({ width: '40px', height: '40px', cursor: 'pointer' });

type SidebarProps = { styles: SerializedStyles };

export const Sidebar = ({ styles }: SidebarProps) => (
  <div css={[container, styles]}>
    <div css={child}>
      Tutorial
      <TutorialSvg />
    </div>
    <div css={child}>
      Algorithm Code
      <CodeSvg css={icons} />
    </div>
    <div css={child}>
      Theme
      <LightThemeSvg />
      <DarkThemeSvg />
    </div>
    <div css={child}>
      <div>
        Small:
        <KettlebellSvg css={icons} />
      </div>
      <div>
        Large:
        <KettlebellSvg css={icons} />
      </div>
    </div>
    <div css={child}>
      <button type="button">
        Randomized Maze
        <MazeSvg css={icons} />
      </button>
    </div>
    <div css={child}>
      Colors of dividers
      <StartSvg />
      <DestinationSvg />
    </div>
  </div>
);
