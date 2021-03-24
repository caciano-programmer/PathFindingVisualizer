import { Table } from '../components/table';

const TABLE_ROWS = 25;
const TABLE_COLUMNS = 50;

export default function Path() {
  return (
    <div className="app-container">
      <Table rows={TABLE_ROWS} columns={TABLE_COLUMNS} />
    </div>
  );
}
