import { css, SerializedStyles } from '@emotion/react';
import KettlebellSvg from '../../public/kettlebell.svg';
import TutorialSvg from '../../public/tutorial.svg';
import LightThemeSvg from '../../public/light.svg';
import DarkThemeSvg from '../../public/dark.svg';
import CodeSvg from '../../public/code.svg';
import StartSvg from '../../public/start.svg';
import DestinationSvg from '../../public/end.svg';
import MazeSvg from '../../public/maze.svg';
import { setMaze } from '../../redux/store';
import { Cell } from '../table/table-utils';
import { useDispatch } from 'react-redux';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  padding: '1vw',
});
const child = css({ flex: '1', cursor: 'pointer' });
const icons = css({ width: '40px', height: '40px' });
const grabItem = css({ cursor: 'grab' });

type SidebarProps = { styles: SerializedStyles; setCode: () => void };

export const Sidebar = ({ styles, setCode }: SidebarProps) => {
  const dispatch = useDispatch();

  const dragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ movedType: Cell.WEIGHT }));
  };

  return (
    <div css={[container, styles]}>
      <div css={child}>
        Tutorial
        <TutorialSvg />
      </div>
      <div css={child} onClick={setCode}>
        Algorithm Code
        <CodeSvg css={icons} />
      </div>
      <div css={child}>
        Theme
        <LightThemeSvg />
        <DarkThemeSvg />
      </div>
      <div css={child}>
        <div css={grabItem} draggable={true} onDragStart={dragStart}>
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
