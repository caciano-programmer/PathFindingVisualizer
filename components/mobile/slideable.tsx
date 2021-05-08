import { css, SerializedStyles } from '@emotion/react';
import { useSwipeable } from 'react-swipeable';
import CloseSvg from '../../public/icons/exit.svg';
import { useDispatch, useSelector } from 'react-redux';
import { selectTutorial, setAlgorithm, setMaze, setTutorialStatus } from '../../redux/store';
import { Description } from '../shared/description';
import Next from '../../public/icons/next.svg';
import Back from '../../public/icons/back.svg';
import { AlgorithmKey, algorithms } from '../../algorithms/algorithms';
import { closedOptions, Option, primaryOptions, secondaryOptions } from '../../config/config';
import { useContext } from 'react';
import { MyTheme, Theme } from '../../theme/theme';
import { bounceAnimation } from '../shared/sharedUtils';

const container = (open: boolean, theme: Theme) =>
  css({
    height: '100%',
    width: '80%',
    position: 'fixed',
    top: 0,
    right: open ? 0 : '-80%',
    backgroundColor: theme.options,
    transition: 'right .25s linear',
    color: theme.main,
  });
const header = (theme: Theme) =>
  css({
    borderBottom: `1px solid ${theme.main}`,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '11%',
    alignItems: 'center',
    boxShadow: `0 0 10px ${theme.main}`,
    clipPath: 'inset(0px 0px -10px 0px)',
  });
const headerTitle = css({ justifySelf: 'start', flex: 1, fontSize: '5.5vh', paddingLeft: '5%', fontWeight: 500 });
const headerIcon = css({ justifySelf: 'end', flex: 1, textAlign: 'right' });
const largeIconCss = (theme: Theme) => css({ cursor: 'pointer', width: '9vh', height: '9vh', fill: theme.main });
const option = css({ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 3% 0 3%', height: '9%' });
const optionText = css({ flex: 4, fontSize: '3.25vh' });
const optionIcon = css({ flex: 1, textAlign: 'right', marginBottom: '-1vh' });
const iconCss = (theme: Theme) => css({ width: '5.5vh', height: '5.5vh', fill: theme.main });
const description = css({ padding: '10% 0 10% 0', width: '100%', height: '45%' });

type SlideableProps = {
  state: Option;
  setOption: (option: Option) => void;
  setTheme: () => void;
  setCode: () => void;
  tutorial: () => void;
};

export const Slideable = ({ state, setOption, setTheme, setCode, tutorial }: SlideableProps) => {
  const handlers = useSwipeable({ onSwipedRight: () => setOption(closedOptions) });
  const dispatch = useDispatch();
  const theme = useContext(MyTheme);
  const setTut = () => dispatch(setTutorialStatus());
  const tutorialSeen = useSelector(selectTutorial);

  const containerCss = container(state.show, theme);
  const headerCss = header(theme);
  const largeIcon = largeIconCss(theme);
  const icon = iconCss(theme);
  const bounce = bounceAnimation(!tutorialSeen);
  const mode = theme.isDark ? 'Light Mode' : 'Dark Mode';

  const fnWithClose = (...fns: (() => void)[]) => {
    setOption(closedOptions);
    fns.forEach(fn => fn());
  };

  return (
    <div css={containerCss} {...handlers}>
      <div css={headerCss}>
        {state.show && !state.secondary && <span css={headerTitle}>Options</span>}
        {state.secondary && <Back css={largeIcon} onClick={() => setOption(primaryOptions)} />}
        <span css={headerIcon}>
          <CloseSvg css={largeIcon} onClick={() => setOption(closedOptions)} />
        </span>
      </div>
      {!state.secondary && (
        <>
          <MenuOption iconCss={icon} name="Choose Algorithm" clickFn={() => setOption(secondaryOptions)} />
          <MenuOption iconCss={icon} name="Generate Maze" clickFn={() => fnWithClose(() => dispatch(setMaze()))} />
          <MenuOption iconCss={icon} textCss={bounce} name="Tutorial" clickFn={() => fnWithClose(tutorial, setTut)} />
          <MenuOption iconCss={icon} name="Algorithm Code" clickFn={() => fnWithClose(setCode)} />
          <MenuOption iconCss={icon} name={mode} clickFn={() => fnWithClose(setTheme)} />
          <Description size="2.75vh" spacing="8vh" styles={description} />
        </>
      )}
      {state.secondary && (
        <>
          {Object.entries(algorithms).map(([key, { name }]) => {
            const fn = () => fnWithClose(() => dispatch(setAlgorithm(key as AlgorithmKey)));
            return <MenuOption iconCss={icon} key={key} name={name} clickFn={fn} />;
          })}
        </>
      )}
    </div>
  );
};

type MenuOptionProp = { name: string; clickFn?: () => void; iconCss?: SerializedStyles; textCss?: SerializedStyles };
function MenuOption({ name, clickFn, iconCss, textCss }: MenuOptionProp) {
  return (
    <div css={option} onClick={clickFn}>
      <span css={[optionText, textCss]}>{name}</span>
      <span css={optionIcon}>
        <Next css={iconCss} />
      </span>
    </div>
  );
}
