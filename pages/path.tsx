import { Table } from '../components/table';
import { useMediaQuery, Screen } from '../hooks/mediaQuery';

const ROWS = 20;
const COLS = 40;
const PORTRAIT_ROWS = 18;
const PORTRAIT_COLS = 10;
const LANDSCAPE_ROWS = 10;
const LANDSCAPE_COLS = 20;

export default function Path() {
  const screen = useMediaQuery();
  return (
    <div className="app-container">
      <Table
        rows={screen === Screen.Desktop ? ROWS : screen === Screen.MobilePortrait ? PORTRAIT_ROWS : LANDSCAPE_ROWS}
        columns={screen === Screen.Desktop ? COLS : screen === Screen.MobilePortrait ? PORTRAIT_COLS : LANDSCAPE_COLS}
      />
    </div>
  );
}
