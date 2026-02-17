import { AssignmentStatus, OrderType, PaymentStatus, PrismaClient, Priority } from '@prisma/client';
import { addDays } from 'date-fns';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.orderActivity.deleteMany();
  await prisma.order.deleteMany();
  await prisma.writer.deleteMany();
  await prisma.client.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: 'admin@ahp.local',
      passwordHash: await hashPassword('admin123'),
      name: 'Admin'
    }
  });

  const [alice, bob] = await Promise.all([
    prisma.client.create({ data: { name: 'Alice Morgan', email: 'alice@example.com', country: 'USA' } }),
    prisma.client.create({ data: { name: 'Bob Kamau', email: 'bob@example.com', country: 'Kenya' } })
  ]);

  const writer = await prisma.writer.create({
    data: { name: 'Jane Writer', contact: '+254700000', specialization: 'Nursing,Essay', rateType: 'percentage', rateValue: 45, status: 'active' }
  });

  const order = await prisma.order.create({
    data: {
      clientId: alice.id,
      title: 'Nursing Case Study',
      orderType: OrderType.Essay,
      subject: 'Nursing',
      priceQuoted: 120,
      amountPaid: 60,
      paymentStatus: PaymentStatus.PartiallyPaid,
      status: AssignmentStatus.InProgress,
      deadline: addDays(new Date(), 2),
      priority: Priority.high,
      writerId: writer.id,
      writerCost: 50,
      activities: { create: { action: 'Seeded', note: 'Demo order' } },
      reminders: { createMany: { data: [{ remindAt: addDays(new Date(), 1), type: 'h24' }, { remindAt: addDays(new Date(), 1.75), type: 'h6' }] } }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      clientId: bob.id,
      title: 'Python Quiz Support',
      orderType: OrderType.Coding,
      priceQuoted: 90,
      amountPaid: 0,
      paymentStatus: PaymentStatus.Refused,
      refusalReason: 'Couldn’t pay',
      status: AssignmentStatus.OnHold,
      deadline: addDays(new Date(), 1),
      priority: Priority.normal
    }
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'AHP-000001',
      clientId: alice.id,
      orderId: order.id,
      issueDate: new Date(),
      dueDate: addDays(new Date(), 7),
      lineItems: [{ description: order.title, qty: 1, unitPrice: 120 }],
      subtotal: 120,
      tax: 0,
      total: 120,
      status: 'Sent',
      pdfPath: '/invoices/AHP-000001.pdf'
    }
  });

  await prisma.setting.create({ data: { id: 'singleton', businessName: 'Assignment Help Pro', businessSubtitle: 'Academic Excellence Hub', invoicePrefix: 'AHP' } });

  console.log('Seed complete', { order: order.id, order2: order2.id });
}

main().finally(async () => prisma.$disconnect());
