import { css, SerializedStyles } from '@emotion/react';
import { useState } from 'react';
import ResetSvg from '../../public/refresh.svg';
import MenuSvg from '../../public/menu.svg';
import { AlgorithmKey, algorithms } from '../../algorithms/algorithms';
import { MOBILE, DESKTOP } from '../../config/config';
import { Slideable } from '../mobile/slideable';
import { useDispatch, useSelector } from 'react-redux';
import { resetState, selectAlgorithm, setAlgorithm } from '../../redux/store';

const container = css({ display: 'flex', flexDirection: 'row', alignItems: 'center' });
const desktop = css({ [MOBILE]: { display: 'none' } });
const mobile = css({ [DESKTOP]: { display: 'none' } });
const logo = css({ flex: 1 });
const algorithmCss = css({ flex: 1 });
const initialize = css({ flex: 1 });
const icon = css({ flex: 1, cursor: 'pointer' });

type HeaderProps = {
  styles: SerializedStyles;
};

export const Header = ({ styles }: HeaderProps) => {
  const [options, showOptions] = useState(false);
  const { key } = useSelector(selectAlgorithm);
  const dispatch = useDispatch();

  return (
    <>
      <header css={[styles, container]}>
        <div css={logo}>PathVisualizer</div>
        <select
          css={[algorithmCss, desktop]}
          value={key}
          onChange={event => dispatch(setAlgorithm(event.target.value as AlgorithmKey))}
        >
          {Object.entries(algorithms).map(([currentKey, { name }]) => (
            <option key={currentKey} value={currentKey} disabled={key === currentKey}>
              {name}
            </option>
          ))}
        </select>
        <button type="button" css={[initialize, desktop]}>
          Visualize!
        </button>
        <div onClick={() => dispatch(resetState())}>
          <ResetSvg css={[icon, desktop]} />
        </div>
        <div onClick={() => showOptions(true)}>
          <MenuSvg css={[icon, mobile]} />
        </div>
      </header>
      <Slideable open={options} close={() => showOptions(false)} />
    </>
  );
};
