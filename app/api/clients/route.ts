import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clientSchema } from '@/lib/validators';

export async function GET() {
  const clients = await prisma.client.findMany({
    include: { orders: true },
    orderBy: { createdAt: 'desc' }
  });
  const mapped = clients.map((c) => ({
    ...c,
    totalOrders: c.orders.length,
    lifetimeValue: c.orders.reduce((sum, o) => sum + o.amountPaid, 0),
    lastOrderDate: c.orders[0]?.createdAt || null
  }));
  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  const body = clientSchema.parse(await request.json());
  const client = await prisma.client.create({ data: body });
  return NextResponse.json(client, { status: 201 });
}
