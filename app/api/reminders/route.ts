import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addHours } from 'date-fns';

export async function GET() {
  const now = new Date();
  const upcoming = await prisma.order.findMany({
    where: { deadline: { lte: addHours(now, 48), gte: now }, status: { in: ['New', 'InProgress', 'OnHold'] } },
    include: { client: true, writer: true },
    orderBy: { deadline: 'asc' }
  });
  return NextResponse.json(upcoming);
}

export async function POST(request: Request) {
  const body = await request.json();
  const reminder = await prisma.reminder.create({ data: { orderId: body.orderId, remindAt: new Date(body.remindAt), type: body.type } });
  return NextResponse.json(reminder, { status: 201 });
}
