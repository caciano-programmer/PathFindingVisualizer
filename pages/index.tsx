import { Table } from '../components/table/table';
import { css } from '@emotion/react';
import { Provider } from 'react-redux';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { Footer } from '../components/mobile/footer';
import { ROWS, COLUMNS, MOBILE, DESKTOP } from '../config/config';
import { store } from '../store/store';

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
const table = css({ [DESKTOP]: { gridColumn: 'span 1' }, [MOBILE]: { gridColumn: 'span 2' } });
const footer = css({ gridColumn: 'span 2', [DESKTOP]: { display: 'none' } });

export default function Home() {
  return (
    <Provider store={store}>
      <div css={container}>
        <Header styles={header} />
        <Sidebar styles={sidebar} />
        <Table rows={ROWS} columns={COLUMNS} styles={table} />
        <Footer styles={footer} />
      </div>
    </Provider>
  );
}
