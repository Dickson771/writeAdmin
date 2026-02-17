export function KpiCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="text-2xl font-semibold mt-1">{value}</h3>
    </div>
  );
}
