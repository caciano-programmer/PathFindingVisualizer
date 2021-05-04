import { css, SerializedStyles } from '@emotion/react';
import KettlebellSvg from '../../public/kettlebell.svg';
import TutorialSvg from '../../public/tutorial.svg';
import LightThemeSvg from '../../public/light.svg';
import CodeSvg from '../../public/code.svg';
import MazeSvg from '../../public/maze.svg';
import { setMaze } from '../../redux/store';
import { Cell } from '../table/table-utils';
import { useDispatch } from 'react-redux';
import { Description } from '../shared/description';

const container = css({
  display: 'grid',
  gridTemplateRows: '1fr 1fr 1fr 4fr 8fr 5fr',
  gridAutoRows: '1fr',
  alignItems: 'center',
  padding: '1.5vh 0 0 .5vw',
});

const links = css({ cursor: 'pointer', fontSize: '1.25vw' });
const linkText = css({ marginRight: '.5vw', '&:hover': { textDecoration: 'underline' } });
const smallIcon = css({ width: '1.5vw', height: '1.5vw', marginBottom: '-4px' });
const weights = css({ textAlign: 'center', alignSelf: 'end' });
const smallWeight = css({ width: '3vw', height: '3vw' });
const largeWeight = css({ width: '4vw', height: '4vw' });
const grabItem = css({ cursor: 'grab' });
const maze = css({ textAlign: 'center', fontSize: '1.2vw', cursor: 'pointer', fontWeight: 400 });
const mazeIcon = css({ width: '6vw', height: '6vw', '&:hover': { width: '6.25vw', height: '6.25vw' } });
const description = css({ paddingBottom: '20%' });

type SidebarProps = { styles: SerializedStyles; setCode: () => void };

export const Sidebar = ({ styles, setCode }: SidebarProps) => {
  const dispatch = useDispatch();

  const drag = (event: React.DragEvent<HTMLSpanElement>, size: Cell.WEIGHT_SM | Cell.WEIGHT_LG) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ movedType: size }));
  };

  return (
    <div css={[container, styles]}>
      <div css={links}>
        <TutorialSvg css={smallIcon} />
        &ensp;
        <span css={linkText}>Tutorial</span>
      </div>
      <div css={links} onClick={setCode}>
        <CodeSvg css={smallIcon} />
        &ensp;
        <span css={linkText}>Code</span>
      </div>
      <div css={links}>
        <LightThemeSvg css={smallIcon} />
        &ensp;
        <span css={linkText}>Theme</span>
      </div>
      <div css={weights}>
        <span css={grabItem} draggable={true} onDragStart={event => drag(event, Cell.WEIGHT_SM)}>
          <KettlebellSvg css={smallWeight} />
        </span>
        <span css={grabItem} draggable={true} onDragStart={event => drag(event, Cell.WEIGHT_LG)}>
          <KettlebellSvg css={largeWeight} style={{ fill: 'green' }} />
        </span>
      </div>
      <div css={maze} onClick={() => dispatch(setMaze())}>
        <span>Generate Maze:</span>
        <MazeSvg css={mazeIcon} />
      </div>
      <Description size=".95vw" styles={description} />
    </div>
  );
};
