import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dynamic from 'next/dynamic';
import { css } from '@emotion/react';
import { Provider } from 'react-redux';
import { useEffect, useState } from 'react';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { Footer } from '../components/mobile/footer';
import { ROWS, COLUMNS, MOBILE, DESKTOP, MOBILE_GRID_LIMIT } from '../config/config';
import { store } from '../store/store';

const DynamicTable = dynamic(() => import('../components/table/table'));

const container = css({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '3fr 17fr',
  [DESKTOP]: { gridTemplateRows: '3fr 17fr' },
  [MOBILE]: { gridTemplateRows: '2fr 17fr 2.5fr' },
});
const header = css({ gridColumn: 'span 2' });
const sidebar = css({ [MOBILE]: { display: 'none' } });
const tableCss = css({ [DESKTOP]: { gridColumn: 'span 1' }, [MOBILE]: { gridColumn: 'span 2' } });
const footer = css({ gridColumn: 'span 2', [DESKTOP]: { display: 'none' } });

export default function Home() {
  const [table, setTable] = useState({ touch: null as null | boolean, rows: ROWS, columns: COLUMNS });

  useEffect(() => {
    import('react-device-detect').then(device => {
      const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1000;
      const touchDevice = device.isMobile || device.isIPad13 || isMobile;
      if (touchDevice) setTable({ touch: true, rows: MOBILE_GRID_LIMIT, columns: MOBILE_GRID_LIMIT });
      else setTable(state => ({ ...state, touch: false }));
    });
  }, []);

  return (
    <Provider store={store}>
      <div css={container}>
        <Header styles={header} />
        <Sidebar styles={sidebar} />
        {table.touch === false && (
          <DndProvider backend={HTML5Backend}>
            <DynamicTable rows={table.rows} columns={table.columns} styles={tableCss} />
          </DndProvider>
        )}
        {table.touch && (
          <DndProvider backend={TouchBackend}>
            <DynamicTable rows={table.rows} columns={table.columns} styles={tableCss} />
          </DndProvider>
        )}
        <Footer styles={footer} />
      </div>
    </Provider>
  );
}
