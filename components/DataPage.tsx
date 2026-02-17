'use client';
import { useEffect, useMemo, useState } from 'react';

export function DataPage({ endpoint, title, fields }: { endpoint: string; title: string; fields: string[] }) {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [query, setQuery] = useState('');
  useEffect(() => { fetch(endpoint).then((r) => r.json()).then(setRows); }, [endpoint]);
  const filtered = useMemo(() => rows.filter((r) => JSON.stringify(r).toLowerCase().includes(query.toLowerCase())), [rows, query]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({});
    setRows(await (await fetch(endpoint)).json());
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <input className="input" placeholder="Quick search" value={query} onChange={(e) => setQuery(e.target.value)} />
      <form onSubmit={submit} className="card grid md:grid-cols-3 gap-3">
        {fields.map((f) => (
          <input key={f} className="input" required={f === 'name' || f === 'title'} placeholder={f} value={form[f] || ''} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
        ))}
        <button className="btn md:col-span-3">Save</button>
      </form>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr>{Object.keys(filtered[0] || {}).slice(0, 8).map((k) => <th key={k} className="text-left py-2">{k}</th>)}</tr></thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t">{Object.values(row).slice(0, 8).map((v: any, i) => <td className="py-2" key={i}>{typeof v === 'object' ? '-' : String(v)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
