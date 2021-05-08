/* eslint-disable react/display-name */
import { css } from '@emotion/react';
import React, { useContext, useEffect, useState } from 'react';
import { MyTheme, Theme } from '../../theme/theme';
import Close from '../../public/icons/exit.svg';
import { DESKTOP, MOBILE } from '../../config/config';
import { welcome } from './tutorialUtils';
import { Button } from '../shared/startButton';
import { useDispatch } from 'react-redux';

const containerCss = (theme: Theme) =>
  css({
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: theme.tutorial.overlay,
    zIndex: 3,
    cursor: 'not-allowed',
  });
const innerDisplayCss = (theme: Theme) =>
  css({
    display: 'flex',
    flexDirection: 'column',
    [DESKTOP]: { width: '50vw', height: '70vh' },
    [MOBILE]: { width: '90vw', height: '90vh' },
    backgroundColor: theme.background,
    cursor: 'auto',
  });
const headerCss = (theme: Theme) =>
  css({
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    borderBottom: `1px solid ${theme.main}`,
    boxShadow: `0 0 7px ${theme.main}`,
    clipPath: 'inset(0px 0px -7px 0px)',
    padding: '0 2.5% 0 2.5%',
  });
const titleCss = (theme: Theme) => css({ flex: 1, color: theme.main, fontWeight: 600, fontSize: 'max(2.75vw, 5vh)' });
const closeHolder = css({ cursor: 'pointer' });
const closeCss = (theme: Theme) =>
  css({
    justifySelf: 'right',
    fill: theme.main,
    height: 'max(4.75vw, 9vh)',
    width: 'max(4.75vw, 9vh)',
    [DESKTOP]: { '&:hover': { filter: `drop-shadow(0 0 .5vw ${theme.main})` } },
  });
const textBoxCss = (theme: Theme) =>
  css({
    flex: 5,
    color: theme.tutorial.text,
    padding: '4vh 3% 0 3%',
    fontSize: 'max(1.5vw, 3.25vh)',
    fontWeight: 500,
    lineHeight: 1.5,
    margin: 0,
  });
const footer = css({ flex: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-around' });
const button = css({ width: 'max(10vw, 15vh)', height: 'max(7vh, 4vw)' });

export const Tutorial = React.memo(({ exit }: { exit: () => void }) => {
  type Steps = 1 | 2 | 3 | 4;
  const [state, setState] = useState(1 as Steps);
  const theme = useContext(MyTheme);

  const exitTutorial = () => {
    exit();
    setState(1);
  };
  const leftButton = () => (state === 1 ? exitTutorial() : setState(prev => (prev - 1) as Steps));
  const rightButton = () => (state === 4 ? exitTutorial() : setState(prev => (prev + 1) as Steps));

  const container = containerCss(theme);
  const innerDisplay = innerDisplayCss(theme);
  const header = headerCss(theme);
  const close = closeCss(theme);
  const title = titleCss(theme);
  const textBox = textBoxCss(theme);

  return (
    <div css={container}>
      <div css={innerDisplay}>
        <div css={header}>
          <div css={title}>Tutorial</div>
          <div onClick={exitTutorial} css={closeHolder}>
            <Close css={close} />
          </div>
        </div>
        <p css={textBox}>{welcome}</p>
        <div css={footer}>
          <Button
            input={state === 1 ? 'Exit' : 'Previous'}
            fontSize="max(1.5vw, 3vh)"
            click={leftButton}
            styles={button}
          />
          <Button
            input={state === 1 ? 'Start' : state === 4 ? 'Complete' : 'Next'}
            fontSize="max(1.5vw, 3vh)"
            click={rightButton}
            styles={button}
          />
        </div>
      </div>
    </div>
  );
});
