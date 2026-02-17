import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writerSchema } from '@/lib/validators';

export async function GET() {
  const writers = await prisma.writer.findMany({ include: { orders: true }, orderBy: { createdAt: 'desc' } });
  const mapped = writers.map((w) => ({
    ...w,
    completedOrders: w.orders.filter((o) => o.status === 'Completed').length,
    totalEarnings: w.orders.reduce((sum, o) => sum + (o.writerCost || 0), 0)
  }));
  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  const body = writerSchema.parse(await request.json());
  const writer = await prisma.writer.create({ data: body });
  return NextResponse.json(writer, { status: 201 });
}
