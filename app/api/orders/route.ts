import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orderSchema } from '@/lib/validators';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const paymentStatus = searchParams.get('paymentStatus') || undefined;
  const writerId = searchParams.get('writerId') || undefined;

  const orders = await prisma.order.findMany({
    where: { status: status as any, paymentStatus: paymentStatus as any, writerId },
    include: { client: true, writer: true, activities: true },
    orderBy: { deadline: 'asc' }
  });
  return NextResponse.json(
    orders.map((o) => ({ ...o, balanceDue: o.priceQuoted - o.amountPaid, profit: o.amountPaid - (o.writerCost || 0) }))
  );
}

export async function POST(request: Request) {
  const body = orderSchema.parse(await request.json());
  const order = await prisma.order.create({
    data: {
      ...body,
      deadline: new Date(body.deadline),
      activities: {
        create: {
          action: 'Order created',
          note: body.internalNotes || 'Initial order entry'
        }
      }
    }
  });
  return NextResponse.json(order, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = orderSchema.partial().extend({ id: orderSchema.shape.clientId }).parse(await request.json());
  const { id, ...payload } = body;
  const order = await prisma.order.update({ where: { id }, data: { ...payload, deadline: payload.deadline ? new Date(payload.deadline) : undefined } });
  await prisma.orderActivity.create({ data: { orderId: id, action: 'Order updated', note: payload.status || payload.paymentStatus || '' } });
  return NextResponse.json(order);
}
