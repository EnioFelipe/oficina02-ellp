export default function Table({ columns, rows, empty = 'Nenhum registro encontrado' }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length}>{empty}</td></tr>
          )}
          {rows.map((row) => (
            <tr key={row._id || row.id}>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
