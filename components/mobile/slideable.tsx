import { css } from '@emotion/react';
import { Dispatch, SetStateAction } from 'react';

const container = css({
  display: 'none',
  height: '100%',
  width: '80%',
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: 'white',
  opacity: '30%',
});

type SlideableProps = { open: boolean; close: Dispatch<SetStateAction<boolean>> };

export const Slideable = ({ open, close }: SlideableProps) => <div css={container}>Mobile</div>;
