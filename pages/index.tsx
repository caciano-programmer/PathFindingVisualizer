/* eslint-disable react-hooks/exhaustive-deps */

import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { Footer } from '../components/mobile/footer';
import { MOBILE, DESKTOP, DesktopDimension, MobileDimension } from '../config/config';
import { setDimension } from '../redux/store';
import Table from '../components/table/table';
import { Dark, Light, MyTheme, Theme } from '../theme/theme';
import { Tutorial } from '../components/tutorial/tutorial';

const DynamicCode = dynamic(() => import('../components/code/code'));

const containerCss = (theme: Theme) =>
  css({
    width: '100%',
    height: '100%',
    display: 'grid',
    backgroundColor: theme.background,
    [DESKTOP]: { gridTemplateRows: '2.25fr 17fr', gridTemplateColumns: '1.75fr 17fr' },
    [MOBILE]: { gridTemplateRows: '1.75fr 15fr 2fr', gridTemplateColumns: '1fr' },
  });
const header = css({ gridColumn: 'span 2' });
const sidebar = css({ [MOBILE]: { display: 'none' } });
const tableCss = css({ [DESKTOP]: { gridColumn: 'span 1' }, [MOBILE]: { gridColumn: 'span 2' } });
const footer = css({ gridColumn: 'span 2', minHeight: 0, [DESKTOP]: { display: 'none' } });

export default function Home() {
  const [theme, toggleTheme] = useState(Light);
  const [code, setCode] = useState(false);
  const [tutorial, setTutorial] = useState(false);
  const dispatch = useDispatch();
  const container = containerCss(theme);

  const closeCode = React.useCallback(() => setCode(false), []);
  const openCode = React.useCallback(() => setCode(true), []);
  const switchTheme = React.useCallback(() => toggleTheme(state => (state === Dark ? Light : Dark)), []);
  const toggleTutorial = React.useCallback(() => setTutorial(state => !state), []);

  useEffect(() => {
    function resize() {
      if (window.innerWidth <= 1000) dispatch(setDimension(MobileDimension));
      else dispatch(setDimension(DesktopDimension));
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <MyTheme.Provider value={theme}>
      {tutorial && <Tutorial exit={toggleTutorial} />}
      <DynamicCode isOpen={code} close={closeCode} />
      <div css={container}>
        <Header styles={header} setTheme={switchTheme} setCode={openCode} tutorial={toggleTutorial} />
        <Sidebar styles={sidebar} setTheme={switchTheme} setCode={openCode} tutorial={toggleTutorial} />
        <Table styles={tableCss} />
        <Footer styles={footer} />
      </div>
    </MyTheme.Provider>
  );
}
