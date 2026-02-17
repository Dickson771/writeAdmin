'use client';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>();
  useEffect(() => { fetch('/api/analytics').then((r) => r.json()).then(setData); }, []);
  if (!data) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card"><h3 className="font-semibold">Orders by Status</h3>{data.byStatus.map((x: any) => <p key={x.name}>{x.name}: {x.value}</p>)}</div>
        <div className="card"><h3 className="font-semibold">Orders by Type</h3>{data.byType.map((x: any) => <p key={x.name}>{x.name}: {x.value}</p>)}</div>
        <div className="card"><h3 className="font-semibold">Top Clients</h3>{data.topClients.map((x: any) => <p key={x.name}>{x.name} (${x.lifetimeValue})</p>)}</div>
        <div className="card"><h3 className="font-semibold">Top Writers</h3>{data.topWriters.map((x: any) => <p key={x.name}>{x.name} ({x.completedOrders})</p>)}</div>
      </div>
    </div>
  );
}
