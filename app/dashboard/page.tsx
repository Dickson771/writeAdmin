import { KpiCard } from '@/components/KpiCard';
import { currency } from '@/lib/utils';

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/dashboard`, { cache: 'no-store' });
  return res.json();
}

export default async function DashboardPage() {
  const data = await getData();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-slate-500">Manage assignments, invoices, and payments at a glance.</p>
      </div>
      <div className="grid md:grid-cols-5 gap-4">
        <KpiCard title="Total Revenue" value={currency(data.totalRevenue)} />
        <KpiCard title="Unpaid Total" value={currency(data.unpaidTotal)} />
        <KpiCard title="Due in 48h" value={data.dueSoon} />
        <KpiCard title="Active Orders" value={data.activeOrders} />
        <KpiCard title="Overdue Invoices" value={data.overdueInvoices} />
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <a href="/orders" className="btn">New Order</a>
          <a href="/clients" className="btn">New Client</a>
          <a href="/writers" className="btn">New Writer</a>
          <a href="/invoices" className="btn">Create Invoice</a>
        </div>
      </div>
    </div>
  );
}
