/* eslint-disable react-hooks/exhaustive-deps */

import { useDispatch } from 'react-redux';
import { setDimension } from '../redux/store';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dynamic from 'next/dynamic';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { Footer } from '../components/mobile/footer';
import { ROWS, COLUMNS, MOBILE, DESKTOP, START, M_END, END, M_START } from '../config/config';

const DynamicTable = dynamic(() => import('../components/table/table'));

const container = css({
  width: '100%',
  height: '100%',
  display: 'grid',
  [DESKTOP]: { gridTemplateRows: '3fr 17fr', gridTemplateColumns: '2.25fr 17fr' },
  [MOBILE]: { gridTemplateRows: '1.75fr 17fr 2.25fr', gridTemplateColumns: '1fr' },
});
const header = css({ gridColumn: 'span 2' });
const sidebar = css({ [MOBILE]: { display: 'none' } });
const tableCss = css({ [DESKTOP]: { gridColumn: 'span 1' }, [MOBILE]: { gridColumn: 'span 2' } });
const footer = css({ gridColumn: 'span 2', minHeight: 0, [DESKTOP]: { display: 'none' } });

export default function Home() {
  const [touchDevice, setTouchDevice] = useState(null as null | boolean);
  const dispatch = useDispatch();

  useEffect(() => {
    const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1000;
    import('react-device-detect').then(device => {
      const touchDevice = device.isMobile || device.isIPad13 || isMobile;
      if (!touchDevice) dispatch(setDimension({ rows: ROWS, columns: COLUMNS }));
      setTouchDevice(touchDevice);
    });
  }, []);

  return (
    <div css={container}>
      <Header styles={header} />
      {touchDevice === false && (
        <DndProvider backend={HTML5Backend}>
          <Sidebar styles={sidebar} />
          <DynamicTable styles={tableCss} start={START} end={END} />
        </DndProvider>
      )}
      {touchDevice && (
        <DndProvider backend={TouchBackend}>
          <DynamicTable styles={tableCss} start={M_START} end={M_END} />
          <Footer styles={footer} />
        </DndProvider>
      )}
    </div>
  );
}
