/* eslint-disable react/display-name */
import { css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { MyTheme, Theme } from '../../theme/theme';
import Close from '../../public/icons/exit.svg';
import { DESKTOP, MOBILE } from '../../config/config';
import {
  DarkPoints,
  DarkWall,
  DarkWeight,
  LightPoints,
  LightWall,
  LightWeight,
  Steps,
  tutorialHeaders,
  TutorialSteps,
  TutorialStepsMobile,
} from './tutorialUtils';
import { Button } from '../shared/startButton';

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
    [DESKTOP]: { width: '75vw', height: '90vh' },
    [MOBILE]: { width: '100%', height: '100%' },
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
    color: theme.tutorial.text,
    padding: '4vh 3% 0 3%',
    fontSize: 'max(1.5vw, 2.2vh)',
    fontWeight: 500,
    lineHeight: 1.5,
    margin: 0,
    flex: 2.5,
  });
const textContainer = css({ flex: 10, display: 'flex', flexDirection: 'row', [MOBILE]: { flexDirection: 'column' } });
const textHeaders = css({ display: 'inline' });
const desktopText = css({ [MOBILE]: { display: 'none' } });
const mobileText = css({ [DESKTOP]: { display: 'none' } });
const footer = css({ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around' });
const button = css({ width: 'max(10vw, 15vh)', height: 'max(7vh, 4vw)' });

export default React.memo(({ exit }: { exit: () => void }) => {
  const [state, setState] = useState(0 as Steps);
  const theme = useContext(MyTheme);

  const leftButton = () => (state === 0 ? exit() : setState(prev => (prev - 1) as Steps));
  const rightButton = () => (state === 4 ? exit() : setState(prev => (prev + 1) as Steps));

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
          <div onClick={exit} css={closeHolder}>
            <Close css={close} />
          </div>
        </div>
        <div css={textContainer}>
          <div css={textBox}>
            {state !== 0 && <h3 css={textHeaders}>{tutorialHeaders[state - 1]}</h3>}
            <span css={desktopText}>{TutorialSteps[state]}</span>
            <span css={mobileText}>{TutorialStepsMobile[state]}</span>
          </div>
          {state === 2 && (theme.isDark ? <DarkWeight /> : <LightWeight />)}
          {state === 3 && (theme.isDark ? <DarkPoints /> : <LightPoints />)}
          {state === 4 && (theme.isDark ? <DarkWall /> : <LightWall />)}
        </div>
        <div css={footer}>
          <Button
            input={state === 0 ? 'Exit' : 'Previous'}
            fontSize="max(1.5vw, 3vh)"
            click={leftButton}
            styles={button}
          />
          <Button
            input={state === 0 ? 'Start' : state === 4 ? 'Complete' : 'Next'}
            fontSize="max(1.5vw, 3vh)"
            click={rightButton}
            styles={button}
          />
        </div>
      </div>
    </div>
  );
});
