import { css, SerializedStyles } from '@emotion/react';
import KettlebellSvg from '../../public/icons/kettlebell.svg';
import TutorialSvg from '../../public/icons/tutorial.svg';
import LightThemeSvg from '../../public/icons/light.svg';
import DarkThemeSvg from '../../public/icons/dark.svg';
import CodeSvg from '../../public/icons/code.svg';
import MazeSvg from '../../public/icons/maze.svg';
import { selectAlgorithmDraggable, selectTutorial, setMaze, setTutorialStatus } from '../../redux/store';
import { Cell } from '../table/table-utils';
import { useDispatch, useSelector } from 'react-redux';
import { Description } from '../shared/description';
import { useContext } from 'react';
import { MyTheme, Theme } from '../../theme/theme';
import { DESKTOP } from '../../config/config';
import { bounceAnimation } from '../shared/sharedUtils';

const container = css({
  display: 'grid',
  gridTemplateRows: '1fr 1fr 1fr 4fr 8fr 5fr',
  gridAutoRows: '1fr',
  alignItems: 'center',
  padding: '1.5vh 0 0 .5vw',
});
const linkTextCss = (theme: Theme) =>
  css({ cursor: 'pointer', fontSize: '1.25vw', '&:hover': { textDecoration: 'underline' }, color: theme.main });
const smallIconCss = (theme: Theme) => css({ width: '1.5vw', height: '1.5vw', marginBottom: '-4px', fill: theme.main });
const weights = css({ textAlign: 'center', alignSelf: 'end' });
const smallWeightCss = (theme: Theme, draggable: boolean) =>
  css({ width: '3vw', height: '3vw', fill: draggable ? theme.smallWeight : theme.disabled.primary });
const largeWeightCss = (theme: Theme, draggable: boolean) =>
  css({ width: '4vw', height: '4vw', fill: draggable ? theme.largeWeight : theme.disabled.primary });
const grabItemCss = (draggable: boolean) => css({ cursor: draggable ? 'grab' : 'not-allowed' });
const mazeCss = (theme: Theme) =>
  css({ textAlign: 'center', fontSize: '1.25vw', cursor: 'pointer', fontWeight: 400, color: theme.main });
const mazeIconCss = (theme: Theme) =>
  css({
    width: '6vw',
    height: '6vw',
    fill: theme.main,
    [DESKTOP]: {
      '&:hover': { filter: `drop-shadow(0 0 .5vw ${theme.mazeGlow})`, height: '6.025vw', width: '6.025vw' },
    },
  });
const description = css({ paddingBottom: '20%' });

type SidebarProps = { styles: SerializedStyles; setTheme: () => void; setCode: () => void; tutorial: () => void };

export const Sidebar = ({ styles, setTheme, setCode, tutorial }: SidebarProps) => {
  const dispatch = useDispatch();
  const theme = useContext(MyTheme);
  const tutorialSeen = useSelector(selectTutorial);
  const withWeight = useSelector(selectAlgorithmDraggable);
  const openTutorial = () => {
    tutorial();
    dispatch(setTutorialStatus());
  };

  const linkText = linkTextCss(theme);
  const smallIcon = smallIconCss(theme);
  const maze = mazeCss(theme);
  const mazeIcon = mazeIconCss(theme);
  const grabItem = grabItemCss(withWeight);
  const smallWeight = smallWeightCss(theme, withWeight);
  const largeWeight = largeWeightCss(theme, withWeight);
  const tutorialIcon = bounceAnimation(!tutorialSeen);

  const drag = (event: React.DragEvent<HTMLSpanElement>, size: Cell.WEIGHT_SM | Cell.WEIGHT_LG) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ movedType: size }));
  };

  return (
    <div css={[container, styles]}>
      <div>
        <TutorialSvg css={[smallIcon, tutorialIcon]} />
        &ensp;
        <span css={linkText} onClick={openTutorial}>
          Tutorial
        </span>
      </div>
      <div>
        <CodeSvg css={smallIcon} />
        &ensp;
        <span css={linkText} onClick={setCode}>
          Code
        </span>
      </div>
      <div>
        {!theme.isDark && <DarkThemeSvg css={smallIcon} />}
        {theme.isDark && <LightThemeSvg css={smallIcon} />}
        &ensp;
        <span css={linkText} onClick={setTheme}>{`${theme.isDark ? 'Light' : 'Dark'} Mode`}</span>
      </div>
      <div css={weights}>
        <span css={grabItem} draggable={withWeight} onDragStart={event => drag(event, Cell.WEIGHT_SM)}>
          <KettlebellSvg css={smallWeight} />
        </span>
        <span css={grabItem} draggable={withWeight} onDragStart={event => drag(event, Cell.WEIGHT_LG)}>
          <KettlebellSvg css={largeWeight} />
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
