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

const DynamicCode = dynamic(() => import('../components/code/code'));

const container = css({
  width: '100%',
  height: '100%',
  display: 'grid',
  [DESKTOP]: { gridTemplateRows: '2.25fr 17fr', gridTemplateColumns: '1.75fr 17fr' },
  [MOBILE]: { gridTemplateRows: '1.75fr 15fr 2.5fr', gridTemplateColumns: '1fr' },
});
const header = css({ gridColumn: 'span 2' });
const sidebar = css({ [MOBILE]: { display: 'none' } });
const tableCss = css({ [DESKTOP]: { gridColumn: 'span 1' }, [MOBILE]: { gridColumn: 'span 2' } });
const footer = css({ gridColumn: 'span 2', minHeight: 0, [DESKTOP]: { display: 'none' } });

export default function Home() {
  const dispatch = useDispatch();
  const [code, setCode] = useState(false);

  const toggleCode = React.useCallback(() => setCode(prev => !prev), []);

  useEffect(() => {
    function resize() {
      if (window.innerWidth <= 1000 && ('ontouchstart' in window || navigator.maxTouchPoints > 0))
        dispatch(setDimension(MobileDimension));
      else dispatch(setDimension(DesktopDimension));
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <>
      {code && <DynamicCode />}
      <div css={container}>
        <Header styles={header} setCode={toggleCode} />
        <Sidebar styles={sidebar} setCode={toggleCode} />
        <Table styles={tableCss} />
        <Footer styles={footer} />
      </div>
    </>
  );
}
