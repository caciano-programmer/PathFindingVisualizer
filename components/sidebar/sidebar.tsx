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
  display: 'grid',
  gridTemplateRows: '1fr 1fr 1fr 4fr 6fr 7fr',
  gridAutoRows: '1fr',
  alignItems: 'center',
  padding: '.5vh 0 0 .5vw',
});
const links = css({ cursor: 'pointer', fontSize: '1.25vw' });
const linkText = css({ marginRight: '.5vw' });
const smallIcon = css({ width: '1.5vw', height: '1.5vw', marginBottom: '-4px' });
const weights = css({ textAlign: 'center' });
const smallWeight = css({ width: '3vw', height: '3vw' });
const largeWeight = css({ width: '4vw', height: '4vw' });
const grabItem = css({ cursor: 'grab' });
const maze = css({ textAlign: 'center', fontSize: '1.2vw', cursor: 'pointer', fontWeight: 400 });
const mazeIcon = css({ width: '6vw', height: '6vw', '&:hover': { width: '6.25vw', height: '6.25vw' } });
const description = css({
  alignSelf: 'start',
  fontSize: '.95vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  height: '100%',
  width: '100%',
  paddingBottom: '20%',
  textAlign: 'center',
  cursor: 'text',
});
const descriptionIcon = css({ width: '.95vw', height: '.95vw', marginBottom: '-2px' });
const descriptionCell = css({
  border: '1px solid black',
  width: '.95vw',
  height: '.95vw',
  display: 'inline-block',
  margin: '0 0 -2px 2px',
});
const marginDescriptionIcon = css({ marginRight: '.5vw' });

type SidebarProps = { styles: SerializedStyles; setCode: () => void };

export const Sidebar = ({ styles, setCode }: SidebarProps) => {
  const dispatch = useDispatch();

  const drag = (event: React.DragEvent<HTMLSpanElement>, size: Cell.WEIGHT_SM | Cell.WEIGHT_LG) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ movedType: size }));
  };

  return (
    <div css={[container, styles]}>
      <div css={links}>
        <span css={linkText}>Tutorial:</span>
        <TutorialSvg css={smallIcon} />
      </div>
      <div css={links} onClick={setCode}>
        <span css={linkText}>Code:</span>
        <CodeSvg css={smallIcon} />
      </div>
      <div css={links}>
        <span css={linkText}>Theme:</span>
        <LightThemeSvg css={smallIcon} />
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
      <div css={description}>
        <div>
          <span>Start: </span>
          <StartSvg css={[descriptionIcon, marginDescriptionIcon]} />
          <span>End: </span>
          <DestinationSvg css={descriptionIcon} />
        </div>
        <div>
          <span>Small Weight: </span>
          <KettlebellSvg css={descriptionIcon} />
        </div>
        <div>
          <span>Large Weight: </span>
          <KettlebellSvg css={descriptionIcon} />
        </div>
        <div>
          <span>Clear: </span>
          <div css={[descriptionCell, marginDescriptionIcon]} />
          <span>Wall: </span>
          <div css={descriptionCell} />
        </div>
        <div>
          <span>Visited: </span>
          <div css={[descriptionCell, marginDescriptionIcon]} />
          <span>Path: </span>
          <div css={descriptionCell} />
        </div>
      </div>
    </div>
  );
};
