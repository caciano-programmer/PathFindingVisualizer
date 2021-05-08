import { css, SerializedStyles } from '@emotion/react';
import { useContext } from 'react';
import { DESKTOP } from '../../config/config';
import { MyTheme, Theme } from '../../theme/theme';

const button = (theme: Theme, disabled: boolean, fontSize = '1.5vw') =>
  css({
    backgroundColor: disabled ? theme.disabled.secondary : theme.visualize.color,
    fontSize,
    fontWeight: 600,
    color: disabled ? theme.disabled.primary : theme.main,
    border: `1px solid ${disabled ? theme.disabled.primary : theme.main}`,
    borderRadius: '30px',
    [DESKTOP]: disabled ? '' : { '&:hover': { boxShadow: `0 0 1vw .5vw ${theme.glow}` } },
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
  });

type ButtonProps = { fontSize: string; disabled?: boolean; input: string; styles?: SerializedStyles; click: () => any };
export const Button = ({ fontSize, styles, disabled, input, click }: ButtonProps) => {
  const theme = useContext(MyTheme);
  const buttonCss = button(theme, disabled || false, fontSize);

  return (
    <button type="button" disabled={disabled} css={[buttonCss, styles]} onClick={click}>
      <span>{input}</span>
    </button>
  );
};
