import { css, SerializedStyles } from '@emotion/react';
import { useContext, useState } from 'react';
import Select, { Styles } from 'react-select';
import ResetSvg from '../../public/refresh.svg';
import MenuSvg from '../../public/menu.svg';
import { AlgorithmKey, algorithms } from '../../algorithms/algorithms';
import { MOBILE, DESKTOP, Option, primaryOptions, closedOptions } from '../../config/config';
import { Slideable } from '../mobile/slideable';
import { useDispatch, useSelector } from 'react-redux';
import { resetState, selectAlgorithm, setAlgorithm } from '../../redux/store';
import { StartButton } from '../shared/startButton';
import { MyTheme, Theme } from '../../theme/theme';

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
const logoCss = (theme: Theme) =>
  css({
    justifySelf: 'start',
    paddingLeft: '25px',
    fontSize: 'max(4.25vh, 3.25vw)',
    color: theme.main,
    fontFamily: 'Lobster Two',
    fontWeight: 600,
  });
const startButton = css({ width: '50%', height: '50%', justifySelf: 'center', [MOBILE]: { display: 'none' } });
const iconHolder = css({ justifySelf: 'end', paddingRight: '50%' });
const iconCss = (theme: Theme) =>
  css({
    width: 'max(4.5vw, 6vh)',
    height: 'max(4.5vw, 6vh)',
    marginBottom: '-25%',
    borderRadius: '50%',
    fill: theme.main,
    [DESKTOP]: { '&:hover': { filter: `drop-shadow(0 0 .5vw ${theme.main})`, height: '4.55vw', width: '4.55vw' } },
  });
const selectContainer = css({ width: '75%', justifySelf: 'center' });
const selectCss = (theme: Theme): Partial<Styles<any, false, any>> => ({
  control: styles => ({
    ...styles,
    border: 'none',
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.main}`,
    borderRadius: 0,
    backgroundColor: 'inherit',
    cursor: 'pointer',
    '&:hover': { borderColor: theme.main },
  }),
  indicatorSeparator: styles => ({ ...styles, backgroundColor: theme.main, marginBottom: '-1px' }),
  dropdownIndicator: styles => ({ ...styles, color: theme.main, '&:hover': { color: theme.mainHover } }),
  singleValue: styles => ({ ...styles, color: theme.main, fontWeight: 500 }),
  menu: styles => ({ ...styles, backgroundColor: theme.select.background }),
  option: (styles, { isDisabled, isFocused }) => {
    let backgroundColor = theme.select.background;
    if (isDisabled) backgroundColor = theme.select.disabled;
    else if (isFocused) backgroundColor = theme.select.highlight;
    return { ...styles, color: isDisabled ? theme.select.disabledText : theme.main, fontWeight: 500, backgroundColor };
  },
});

type HeaderProps = { styles: SerializedStyles; setTheme: () => void; setCode: () => void };

export const Header = ({ styles, setCode, setTheme }: HeaderProps) => {
  const [options, showOptions] = useState(closedOptions);
  const key = useSelector(selectAlgorithm);
  const dispatch = useDispatch();
  const theme = useContext(MyTheme);

  const logo = logoCss(theme);
  const select = selectCss(theme);
  const icon = iconCss(theme);

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
          isOptionDisabled={option => option.value === key}
        />
        <StartButton styles={startButton} />
        <div css={[desktop, iconHolder]} onClick={() => dispatch(resetState())}>
          <ResetSvg css={[pointer, icon]} />
        </div>
        <div css={[mobile, iconHolder]} onClick={() => showOptions(primaryOptions)}>
          <MenuSvg css={[pointer, icon]} />
        </div>
      </header>
      <Slideable
        state={options}
        setOption={(option: Option) => showOptions(option)}
        setTheme={setTheme}
        setCode={setCode}
      />
    </>
  );
};
