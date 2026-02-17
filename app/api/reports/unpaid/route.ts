import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const orders = await prisma.order.findMany({
    where: { OR: [{ paymentStatus: 'NotPaid' }, { paymentStatus: 'PartiallyPaid' }, { paymentStatus: 'Refused' }] },
    include: { client: true },
    orderBy: { deadline: 'asc' }
  });
  const totalOutstanding = orders.reduce((sum, o) => sum + (o.priceQuoted - o.amountPaid), 0);
  const reasons = orders.reduce<Record<string, number>>((acc, o) => {
    const key = o.refusalReason || 'Unspecified';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return NextResponse.json({ orders, totalOutstanding, refusalReasons: reasons });
}
