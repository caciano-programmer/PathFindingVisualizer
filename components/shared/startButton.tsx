import { css, SerializedStyles } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { Progress } from '../../config/config';
import { setStatus } from '../../redux/store';

const button = (fontSize = '1.5vw') =>
  css({
    backgroundColor: 'gray',
    fontSize,
    textAlign: 'center',
    border: '1px solid black',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

export const StartButton = ({ fontSize, styles }: { fontSize?: string; styles?: SerializedStyles }) => {
  const dispatch = useDispatch();
  const buttonCss = button(fontSize);

  return (
    <div css={[buttonCss, styles]} onClick={() => dispatch(setStatus(Progress.IN_PROGESS))}>
      <span>Visualize</span>
    </div>
  );
};
