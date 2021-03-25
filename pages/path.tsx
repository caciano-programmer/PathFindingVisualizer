import { Table } from '../components/table';
import { useMediaQuery } from '../hooks/mediaQuery';

const TABLE_ROWS = 25;
const TABLE_COLUMNS = 50;
const TABLE_ROWS_MOBILE = 20;
const TABLE_COLUMNS_MOBILE = 18;

export default function Path() {
  const mobile = useMediaQuery();
  return (
    <div className="app-container">
      <Table rows={mobile ? TABLE_ROWS_MOBILE : TABLE_ROWS} columns={mobile ? TABLE_COLUMNS_MOBILE : TABLE_COLUMNS} />
    </div>
  );
}
