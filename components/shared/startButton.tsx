import { css, SerializedStyles } from '@emotion/react';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { DESKTOP, Progress } from '../../config/config';
import { setStatus } from '../../redux/store';
import { MyTheme, Theme } from '../../theme/theme';

const button = (fontSize = '1.5vw', theme: Theme) =>
  css({
    backgroundColor: theme.visualize.color,
    fontSize,
    textAlign: 'center',
    color: theme.main,
    border: `1px solid ${theme.main}`,
    borderRadius: '15px',
    [DESKTOP]: { '&:hover': { boxShadow: `0 0 1vw .5vw ${theme.glow}` } },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

export const StartButton = ({ fontSize, styles }: { fontSize?: string; styles?: SerializedStyles }) => {
  const dispatch = useDispatch();
  const theme = useContext(MyTheme);

  const buttonCss = button(fontSize, theme);

  return (
    <div css={[buttonCss, styles]} onClick={() => dispatch(setStatus(Progress.IN_PROGESS))}>
      <span>Visualize</span>
    </div>
  );
};
