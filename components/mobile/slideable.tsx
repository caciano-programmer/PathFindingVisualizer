import { css } from '@emotion/react';
import { useSwipeable } from 'react-swipeable';
import CloseSvg from '../../public/exit.svg';
import { useDispatch } from 'react-redux';
import { setMaze } from '../../redux/store';
import { Description } from '../shared/description';
import Next from '../../public/next.svg';

const container = (open: boolean) =>
  css({
    display: 'grid',
    gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 5fr',
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
  height: '100%',
  alignItems: 'center',
  boxShadow: '0 1px 2px',
});
const headerTitle = css({ justifySelf: 'start', flexGrow: 1, fontSize: '4.5vh', paddingLeft: '5%', fontWeight: 500 });
const headerIcon = css({ justifySelf: 'end', flexGrow: 1, textAlign: 'right' });
const closeIcon = css({ cursor: 'pointer', width: '9vh', height: '9vh' });
const option = css({ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 2.5% 0 2.5%' });
const optionText = css({ flex: 1, fontSize: '2.9vh' });
const optionIcon = css({ flex: 1, textAlign: 'right' });
const icon = css({ width: '5vh', height: '5vh' });
const description = css({ padding: '15% 0 10% 0' });

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
      <div css={header}>
        <span css={headerTitle}>Options</span>
        <span css={headerIcon}>
          <CloseSvg onClick={close} css={closeIcon} />
        </span>
      </div>
      <div css={option}>
        <span css={optionText}>Tutorial</span>
        <span css={optionIcon}>
          <Next css={icon} />
        </span>
      </div>
      <div css={option} onClick={() => fnWithClose(setCode)}>
        <span css={optionText}>Algorithm Code</span>
        <span css={optionIcon}>
          <Next css={icon} />
        </span>
      </div>
      <div css={option} onClick={() => fnWithClose(() => dispatch(setMaze()))}>
        <span css={optionText}>Generate Maze</span>
        <span css={optionIcon}>
          <Next css={icon} />
        </span>
      </div>
      <div css={option}>
        <span css={optionText}>Theme</span>
        <span css={optionIcon}>
          <Next css={icon} />
        </span>
      </div>
      <Description size="2.5vh" spacing="4vh" styles={description} />
    </div>
  );
};
