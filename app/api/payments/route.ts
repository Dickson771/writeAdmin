import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const payment = await prisma.payment.create({
    data: {
      invoiceId: body.invoiceId,
      amount: Number(body.amount),
      method: body.method,
      date: new Date(body.date),
      note: body.note
    }
  });
  const invoice = await prisma.invoice.findUniqueOrThrow({ where: { id: body.invoiceId }, include: { payments: true, order: true } });
  const paid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  await prisma.invoice.update({ where: { id: invoice.id }, data: { status: paid >= invoice.total ? 'Paid' : 'Sent' } });
  await prisma.order.update({
    where: { id: invoice.orderId },
    data: { amountPaid: { increment: body.amount }, paymentStatus: paid >= invoice.total ? 'Paid' : 'PartiallyPaid' }
  });
  return NextResponse.json(payment, { status: 201 });
}
