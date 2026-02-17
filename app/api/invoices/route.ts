import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveInvoicePdfLike } from '@/lib/invoicePdf';

function nextInvoiceNumber(prefix: string, last?: string) {
  const seq = last ? Number(last.split('-')[1]) + 1 : 1;
  return `${prefix}-${String(seq).padStart(6, '0')}`;
}

export async function GET() {
  const invoices = await prisma.invoice.findMany({ include: { client: true, order: true, payments: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const body = await request.json();
  const setting = await prisma.setting.upsert({ where: { id: 'singleton' }, update: {}, create: { id: 'singleton' } });
  const last = await prisma.invoice.findFirst({ orderBy: { createdAt: 'desc' } });
  const invoiceNumber = nextInvoiceNumber(setting.invoicePrefix, last?.invoiceNumber);
  const order = await prisma.order.findUniqueOrThrow({ where: { id: body.orderId }, include: { client: true } });
  const lineItems = body.lineItems || [{ description: order.title, qty: 1, unitPrice: order.priceQuoted }];
  const subtotal = lineItems.reduce((sum: number, i: any) => sum + i.qty * i.unitPrice, 0);
  const tax = setting.taxRate ? (subtotal * setting.taxRate) / 100 : 0;
  const total = subtotal + tax;
  const pdfPath = await saveInvoicePdfLike({
    invoiceNumber,
    businessName: setting.businessName,
    subtitle: setting.businessSubtitle,
    issueDate: body.issueDate,
    dueDate: body.dueDate,
    clientName: order.client.name,
    clientEmail: order.client.email,
    orderTitle: order.title,
    lineItems,
    subtotal,
    tax,
    total
  });

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientId: order.clientId,
      orderId: order.id,
      issueDate: new Date(body.issueDate),
      dueDate: new Date(body.dueDate),
      lineItems,
      subtotal,
      tax,
      total,
      status: body.status || 'Sent',
      paymentLink: body.paymentLink,
      pdfPath
    }
  });
  return NextResponse.json(invoice, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const invoice = await prisma.invoice.update({ where: { id: body.id }, data: body });
  return NextResponse.json(invoice);
}
