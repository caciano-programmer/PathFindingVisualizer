import { css } from '@emotion/react';
import { useSwipeable } from 'react-swipeable';
import CloseSvg from '../../public/exit.svg';
import { useDispatch } from 'react-redux';
import { setAlgorithm, setMaze } from '../../redux/store';
import { Description } from '../shared/description';
import Next from '../../public/next.svg';
import { AlgorithmKey, algorithms } from '../../algorithms/algorithms';
import { closedOptions, Option, secondaryOptions } from '../../config/config';

const container = (open: boolean) =>
  css({
    height: '100%',
    width: '80%',
    position: 'fixed',
    top: 0,
    right: open ? 0 : '-80%',
    backgroundColor: 'grey',
    transition: 'right .25s linear',
  });
const header = css({
  borderBottom: '1px solid black',
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '11%',
  alignItems: 'center',
  boxShadow: '0 1px 3px',
});
const headerTitle = css({ justifySelf: 'start', flex: 1, fontSize: '5.5vh', paddingLeft: '5%', fontWeight: 500 });
const headerIcon = css({ justifySelf: 'end', flex: 1, textAlign: 'right' });
const closeIcon = css({ cursor: 'pointer', width: '9vh', height: '9vh' });
const option = css({ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 3% 0 3%', height: '9%' });
const optionText = css({ flex: 4, fontSize: '3.25vh' });
const optionIcon = css({ flex: 1, textAlign: 'right', marginBottom: '-1vh' });
const icon = css({ width: '5.5vh', height: '5.5vh' });
const description = css({ padding: '10% 0 10% 0', width: '100%', height: '45%' });

type SlideableProps = { state: Option; setOption: (option: Option) => void; setCode: () => void };

export const Slideable = ({ state, setOption, setCode }: SlideableProps) => {
  const handlers = useSwipeable({ onSwipedRight: () => setOption(closedOptions) });
  const dispatch = useDispatch();
  const containerCss = container(state.show);

  const fnWithClose = (fn: () => void) => {
    setOption(closedOptions);
    if (fn != undefined) fn();
  };

  return (
    <div css={containerCss} {...handlers}>
      <div css={header}>
        <span css={headerTitle}>Options</span>
        <span css={headerIcon}>
          <CloseSvg onClick={() => setOption(closedOptions)} css={closeIcon} />
        </span>
      </div>
      {!state.secondary && (
        <>
          <MenuOption name="Choose Algorithm" clickFn={() => setOption(secondaryOptions)} />
          <MenuOption name="Generate Maze" clickFn={() => fnWithClose(() => dispatch(setMaze()))} />
          <MenuOption name="Tutorial" />
          <MenuOption name="Algorithm Code" clickFn={() => fnWithClose(setCode)} />
          <MenuOption name="Theme" />
          <Description size="2.75vh" spacing="8vh" styles={description} />
        </>
      )}
      {state.secondary && (
        <>
          {Object.entries(algorithms).map(([key, { name }]) => {
            const fn = () => fnWithClose(() => dispatch(setAlgorithm(key as AlgorithmKey)));
            return <MenuOption key={key} name={name} clickFn={fn} />;
          })}
        </>
      )}
    </div>
  );
};

function MenuOption({ name, clickFn }: { name: string; clickFn?: () => void }) {
  return (
    <div css={option} onClick={clickFn}>
      <span css={optionText}>{name}</span>
      <span css={optionIcon}>
        <Next css={icon} />
      </span>
    </div>
  );
}
