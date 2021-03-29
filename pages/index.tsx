import { Table } from '../components/table/table';
import { css } from '@emotion/react';
import { useMediaQuery, Screen } from '../hooks/mediaQuery';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';

const ROWS = 20;
const COLS = 40;
const PORTRAIT_ROWS = 18;
const PORTRAIT_COLS = 10;
const LANDSCAPE_ROWS = 10;
const LANDSCAPE_COLS = 20;

const container = css({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '3fr 17fr',
  gridTemplateRows: '3fr 17fr',
});
const headerGrid = css({ gridColumn: 'span 2' });

export default function Home() {
  const screen = useMediaQuery();
  return (
    <div css={container}>
      <Header styles={headerGrid} />
      <Sidebar />
      <Table
        rows={screen === Screen.Desktop ? ROWS : screen === Screen.MobilePortrait ? PORTRAIT_ROWS : LANDSCAPE_ROWS}
        columns={screen === Screen.Desktop ? COLS : screen === Screen.MobilePortrait ? PORTRAIT_COLS : LANDSCAPE_COLS}
      />
    </div>
  );
}
