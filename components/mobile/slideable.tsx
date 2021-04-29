import { css } from '@emotion/react';
import { useSwipeable } from 'react-swipeable';
import CloseSvg from '../../public/exit.svg';
import MazeSvg from '../../public/maze.svg';
import TutorialSvg from '../../public/tutorial.svg';
import LightThemeSvg from '../../public/light.svg';
import DarkThemeSvg from '../../public/dark.svg';
import CodeSvg from '../../public/code.svg';
import StartSvg from '../../public/start.svg';
import DestinationSvg from '../../public/end.svg';
import { useDispatch } from 'react-redux';
import { setMaze } from '../../redux/store';

const container = (open: boolean) =>
  css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '80%',
    position: 'fixed',
    top: 0,
    right: open ? 0 : '-80%',
    backgroundColor: 'grey',
    transition: 'right .25s linear',
  });
const icon = css({ cursor: 'pointer', width: '60px', height: '60px' });

type SlideableProps = { open: boolean; close: () => void; setCode: () => void };

export const Slideable = ({ open, close, setCode }: SlideableProps) => {
  const handlers = useSwipeable({ onSwipedRight: close });
  const dispatch = useDispatch();
  const containerCss = container(open);

  const fnWithClose = (fn: () => void) => {
    close();
    fn();
  };

  return (
    <div css={containerCss} {...handlers}>
      <CloseSvg onClick={close} css={icon} />
      <div>
        Tutorial
        <TutorialSvg css={icon} />
      </div>
      <div onClick={() => fnWithClose(setCode)}>
        Algorithm Code
        <CodeSvg css={icon} />
      </div>
      <div>
        Theme
        <LightThemeSvg css={icon} />
        <DarkThemeSvg css={icon} />
      </div>
      <div onClick={() => fnWithClose(() => dispatch(setMaze()))}>
        Generate Randomized Maze
        <MazeSvg css={icon} />
      </div>
      <div>
        Colors
        <StartSvg css={icon} />
        <DestinationSvg css={icon} />
      </div>
    </div>
  );
};
