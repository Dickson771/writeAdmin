'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['Dashboard', '/dashboard'],
  ['Orders', '/orders'],
  ['Clients', '/clients'],
  ['Writers', '/writers'],
  ['Invoices', '/invoices'],
  ['Unpaid Report', '/reports/unpaid'],
  ['Analytics', '/analytics'],
  ['Settings', '/settings']
];

export function Nav() {
  const pathname = usePathname();
  return (
    <aside className="w-full md:w-60 bg-white border-r min-h-screen p-4">
      <h1 className="text-xl font-bold text-brand">Assignment Help Pro</h1>
      <p className="text-xs text-slate-500">Academic Excellence Hub</p>
      <nav className="mt-6 space-y-1">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className={`block px-3 py-2 rounded-md ${pathname === href ? 'bg-blue-100 text-brand' : 'hover:bg-slate-100'}`}>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
