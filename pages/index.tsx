/* eslint-disable react-hooks/exhaustive-deps */

import { useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { Footer } from '../components/mobile/footer';
import { MOBILE, DESKTOP, DesktopDimension, MobileDimension, START, END, M_START, M_END } from '../config/config';
import { setDimension } from '../redux/store';

const DynamicTable = dynamic(() => import('../components/table/table'));

const container = css({
  width: '100%',
  height: '100%',
  display: 'grid',
  [DESKTOP]: { gridTemplateRows: '3fr 17fr', gridTemplateColumns: '2.25fr 17fr' },
  [MOBILE]: { gridTemplateRows: '2fr 17fr 3fr', gridTemplateColumns: '1fr' },
});
const header = css({ gridColumn: 'span 2' });
const sidebar = css({ [MOBILE]: { display: 'none' } });
const tableCss = css({ [DESKTOP]: { gridColumn: 'span 1' }, [MOBILE]: { gridColumn: 'span 2' } });
const footer = css({ gridColumn: 'span 2', minHeight: 0, [DESKTOP]: { display: 'none' } });

type StartPoints = { start: number; end: number } | undefined;

export default function Home() {
  const dispatch = useDispatch();
  const [startPoints, setStartPoints] = useState(undefined as StartPoints);

  useEffect(() => {
    function resize() {
      if (window.innerWidth >= 1000) {
        setStartPoints({ start: START, end: END });
        dispatch(setDimension(DesktopDimension));
      } else {
        setStartPoints({ start: M_START, end: M_END });
        dispatch(setDimension(MobileDimension));
      }
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div css={container}>
      <Header styles={header} />
      <Sidebar styles={sidebar} />
      <DynamicTable styles={tableCss} startPoints={startPoints} />
      <Footer styles={footer} />
    </div>
  );
}
