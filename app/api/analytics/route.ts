import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [orders, clients, writers] = await Promise.all([prisma.order.findMany({ include: { client: true, writer: true } }), prisma.client.findMany({ include: { orders: true } }), prisma.writer.findMany({ include: { orders: true } })]);

  const byStatus = Object.entries(orders.reduce<Record<string, number>>((acc, o) => ((acc[o.status] = (acc[o.status] || 0) + 1), acc), {})).map(([name, value]) => ({ name, value }));
  const byType = Object.entries(orders.reduce<Record<string, number>>((acc, o) => ((acc[o.orderType] = (acc[o.orderType] || 0) + 1), acc), {})).map(([name, value]) => ({ name, value }));
  const topClients = clients
    .map((c) => ({ name: c.name, lifetimeValue: c.orders.reduce((s, o) => s + o.amountPaid, 0), orderCount: c.orders.length }))
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
    .slice(0, 5);
  const topWriters = writers
    .map((w) => ({ name: w.name, completedOrders: w.orders.filter((o) => o.status === 'Completed').length, profitContribution: w.orders.reduce((s, o) => s + (o.amountPaid - (o.writerCost || 0)), 0) }))
    .sort((a, b) => b.completedOrders - a.completedOrders)
    .slice(0, 5);
  return NextResponse.json({ byStatus, byType, topClients, topWriters });
}
