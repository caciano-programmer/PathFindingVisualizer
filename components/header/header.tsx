import { css, SerializedStyles } from '@emotion/react';
import { useState } from 'react';
import Select, { Styles } from 'react-select';
import ResetSvg from '../../public/refresh.svg';
import MenuSvg from '../../public/menu.svg';
import { AlgorithmKey, algorithms } from '../../algorithms/algorithms';
import { MOBILE, DESKTOP, Option, primaryOptions, closedOptions } from '../../config/config';
import { Slideable } from '../mobile/slideable';
import { useDispatch, useSelector } from 'react-redux';
import { resetState, selectAlgorithm, setAlgorithm } from '../../redux/store';
import { StartButton } from '../shared/startButton';

const fullSize = css({ width: '100%', height: '100%' });
const pointer = css({ cursor: 'pointer' });
const container = css({
  display: 'grid',
  [DESKTOP]: { gridTemplateColumns: '2.25fr 2fr 2fr 1fr' },
  [MOBILE]: { gridTemplateColumns: '6.25fr 1fr' },
  alignItems: 'center',
});
const desktop = css({ [MOBILE]: { display: 'none' } });
const mobile = css({ [DESKTOP]: { display: 'none' } });
const logo = css({ justifySelf: 'start', paddingLeft: '25px', fontSize: 'max(4.25vh, 3.25vw)' });
const startButton = css({ width: '50%', height: '50%', justifySelf: 'center', [MOBILE]: { display: 'none' } });
const iconHolder = css({ justifySelf: 'end', paddingRight: '50%' });
const icon = css({ width: 'max(4.5vw, 6vh)', height: 'max(4.5vw, 6vh)', marginBottom: '-25%' });
const selectContainer = css({ width: '75%', justifySelf: 'center' });
const select: Partial<Styles<any, false, any>> = {
  control: styles => ({
    ...styles,
    border: 'none',
    boxShadow: 'none',
    borderBottom: '1px solid black',
    borderRadius: 0,
  }),
  indicatorSeparator: styles => ({ ...styles, color: 'black', marginBottom: 0 }),
};

type HeaderProps = { styles: SerializedStyles; setCode: () => void };

export const Header = ({ styles, setCode }: HeaderProps) => {
  const [options, showOptions] = useState(closedOptions);
  const key = useSelector(selectAlgorithm);
  const dispatch = useDispatch();

  return (
    <>
      <header css={[styles, container, fullSize]}>
        <div css={logo}>PathVisualizer</div>
        <Select
          css={[desktop, selectContainer]}
          options={Object.entries(algorithms).map(([key, { name }]) => ({ value: key as AlgorithmKey, label: name }))}
          value={{ value: key, label: algorithms[key].name }}
          onChange={e => (e?.value ? dispatch(setAlgorithm(e.value)) : null)}
          styles={select}
          isSearchable={false}
        />
        <StartButton styles={startButton} />
        <div css={[desktop, iconHolder]} onClick={() => dispatch(resetState())}>
          <ResetSvg css={[pointer, icon]} />
        </div>
        <div css={[mobile, iconHolder]} onClick={() => showOptions(primaryOptions)}>
          <MenuSvg css={[pointer, icon]} />
        </div>
      </header>
      <Slideable state={options} setOption={(option: Option) => showOptions(option)} setCode={setCode} />
    </>
  );
};
