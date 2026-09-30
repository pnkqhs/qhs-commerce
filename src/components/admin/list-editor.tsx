'use client';
import { useState, useId } from 'react';
export function ListEditor({
  name,
  label,
  columns,
  initial = [],
  strings = false,
}: {
  name: string;
  label: string;
  columns: { key: string; label: string }[];
  initial?: Record<string, string>[] | string[];
  strings?: boolean;
}) {
  const prefix = useId();
  const [rows, setRows] = useState(() =>
    initial.map((row, index) => ({
      id: index,
      data: typeof row === 'string' ? { url: row } : row,
    })),
  );
  const [nextId, setNextId] = useState(initial.length);
  const serialized = rows.map((r) => (strings ? r.data.url || '' : r.data));
  function update(id: number, key: string, value: string) {
    setRows(rows.map((r) => (r.id === id ? { ...r, data: { ...r.data, [key]: value } } : r)));
  }
  return (
    <div className="full list-editor">
      <h3>{label}</h3>
      <input type="hidden" name={name} value={JSON.stringify(serialized)} />
      {rows.map((r) => (
        <div className="list-editor-row" key={r.id}>
          {columns.map((c) => (
            <label key={c.key} htmlFor={`${prefix}-${r.id}-${c.key}`}>
              {c.label}
              <input
                id={`${prefix}-${r.id}-${c.key}`}
                value={r.data[c.key] || ''}
                onChange={(e) => update(r.id, c.key, e.target.value)}
              />
            </label>
          ))}
          <button
            className="button button-outline"
            type="button"
            aria-label={`Xóa dòng ${label} ${r.id + 1}`}
            onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
          >
            Xóa
          </button>
        </div>
      ))}
      <button
        className="button button-outline"
        type="button"
        onClick={() => {
          setRows([
            ...rows,
            { id: nextId, data: Object.fromEntries(columns.map((c) => [c.key, ''])) },
          ]);
          setNextId(nextId + 1);
        }}
      >
        + Thêm {label.toLowerCase()}
      </button>
    </div>
  );
}
