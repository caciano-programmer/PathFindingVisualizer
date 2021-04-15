import { css, SerializedStyles } from '@emotion/react';
import KettlebellSvg from '../../public/kettlebell.svg';
import TutorialSvg from '../../public/tutorial.svg';
import LightThemeSvg from '../../public/light.svg';
import DarkThemeSvg from '../../public/dark.svg';
import CodeSvg from '../../public/code.svg';
import StartSvg from '../../public/start.svg';
import DestinationSvg from '../../public/end.svg';
import MazeSvg from '../../public/maze.svg';
import { useDrag } from 'react-dnd';
import { Cell } from '../../config/config';
import { useDispatch } from 'react-redux';
import { setMaze } from '../../redux/store';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  padding: '1vw',
});
const child = css({ flex: '1', cursor: 'pointer' });
const icons = css({ width: '40px', height: '40px' });
const grabItem = css({ cursor: 'grab' });

type SidebarProps = { styles: SerializedStyles };

export const Sidebar = ({ styles }: SidebarProps) => {
  const dragWeight = useDrag({ type: Cell.WEIGHT, item: { type: Cell.WEIGHT } })[1];
  const dispatch = useDispatch();

  return (
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
        <div ref={dragWeight} css={grabItem}>
          <KettlebellSvg css={icons} />
        </div>
      </div>
      <button css={child} type="button" onClick={() => dispatch(setMaze())}>
        Randomized Maze
        <MazeSvg css={icons} />
      </button>
      <div css={child}>
        Colors of dividers
        <StartSvg />
        <DestinationSvg />
      </div>
    </div>
  );
};
