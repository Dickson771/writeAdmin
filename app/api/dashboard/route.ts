import { addHours } from 'date-fns';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const now = new Date();
  const [orders, invoices] = await Promise.all([prisma.order.findMany(), prisma.invoice.findMany()]);
  const totalRevenue = orders.reduce((sum, o) => sum + o.amountPaid, 0);
  const unpaidTotal = orders.reduce((sum, o) => sum + Math.max(0, o.priceQuoted - o.amountPaid), 0);
  const dueSoon = orders.filter((o) => o.deadline > now && o.deadline < addHours(now, 48)).length;
  const activeOrders = orders.filter((o) => ['New', 'InProgress', 'OnHold'].includes(o.status)).length;
  const overdueInvoices = invoices.filter((i) => i.dueDate < now && i.status !== 'Paid' && i.status !== 'Void').length;
  return NextResponse.json({ totalRevenue, unpaidTotal, dueSoon, activeOrders, overdueInvoices });
}
