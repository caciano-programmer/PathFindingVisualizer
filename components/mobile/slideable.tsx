import { css, SerializedStyles } from '@emotion/react';
import { useSwipeable } from 'react-swipeable';
import CloseSvg from '../../public/exit.svg';
import { useDispatch } from 'react-redux';
import { setAlgorithm, setMaze } from '../../redux/store';
import { Description } from '../shared/description';
import Next from '../../public/next.svg';
import Back from '../../public/back.svg';
import { AlgorithmKey, algorithms } from '../../algorithms/algorithms';
import { closedOptions, Option, primaryOptions, secondaryOptions } from '../../config/config';
import { useContext } from 'react';
import { MyTheme, Theme } from '../../theme/theme';

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

type SlideableProps = { state: Option; setOption: (option: Option) => void; setTheme: () => void; setCode: () => void };

export const Slideable = ({ state, setOption, setTheme, setCode }: SlideableProps) => {
  const handlers = useSwipeable({ onSwipedRight: () => setOption(closedOptions) });
  const dispatch = useDispatch();
  const theme = useContext(MyTheme);

  const containerCss = container(state.show, theme);
  const headerCss = header(theme);
  const largeIcon = largeIconCss(theme);
  const icon = iconCss(theme);
  const mode = theme.isDark ? 'Light Mode' : 'Dark Mode';

  const fnWithClose = (fn: () => void) => {
    setOption(closedOptions);
    if (fn != undefined) fn();
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
          <MenuOption style={icon} name="Choose Algorithm" clickFn={() => setOption(secondaryOptions)} />
          <MenuOption style={icon} name="Generate Maze" clickFn={() => fnWithClose(() => dispatch(setMaze()))} />
          <MenuOption style={icon} name="Tutorial" />
          <MenuOption style={icon} name="Algorithm Code" clickFn={() => fnWithClose(setCode)} />
          <MenuOption style={icon} name={mode} clickFn={() => fnWithClose(setTheme)} />
          <Description size="2.75vh" spacing="8vh" styles={description} />
        </>
      )}
      {state.secondary && (
        <>
          {Object.entries(algorithms).map(([key, { name }]) => {
            const fn = () => fnWithClose(() => dispatch(setAlgorithm(key as AlgorithmKey)));
            return <MenuOption style={icon} key={key} name={name} clickFn={fn} />;
          })}
        </>
      )}
    </div>
  );
};

function MenuOption({ name, clickFn, style }: { name: string; clickFn?: () => void; style: SerializedStyles }) {
  return (
    <div css={option} onClick={clickFn}>
      <span css={optionText}>{name}</span>
      <span css={optionIcon}>
        <Next css={style} />
      </span>
    </div>
  );
}
