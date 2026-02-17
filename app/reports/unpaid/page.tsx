'use client';
import { useEffect, useState } from 'react';
import { currency } from '@/lib/utils';

export default function UnpaidReportPage() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/reports/unpaid').then((r) => r.json()).then(setData); }, []);
  if (!data) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Unpaid/Refused Report</h2>
      <div className="card">Total Outstanding: <strong>{currency(data.totalOutstanding)}</strong></div>
      <div className="card">
        <h3 className="font-semibold mb-2">Refusal Reasons</h3>
        {Object.entries(data.refusalReasons).map(([k, v]: any) => <p key={k}>{k}: {v}</p>)}
      </div>
    </div>
  );
}
