import { PaymentStatus } from '@prisma/client';
import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional()
});

export const writerSchema = z.object({
  name: z.string().min(2),
  contact: z.string().optional(),
  specialization: z.string().optional(),
  rateType: z.enum(['percentage', 'flat']),
  rateValue: z.coerce.number().min(0),
  status: z.enum(['active', 'inactive'])
});

export const orderSchema = z
  .object({
    clientId: z.string(),
    title: z.string().min(3),
    orderType: z.enum(['Essay', 'Thesis', 'Coding', 'Quiz', 'Exam', 'Discussion', 'Other']),
    subject: z.string().optional(),
    wordsPages: z.string().optional(),
    formatStyle: z.string().optional(),
    priceQuoted: z.coerce.number().positive(),
    depositRequired: z.coerce.boolean().default(false),
    amountPaid: z.coerce.number().min(0).default(0),
    writerId: z.string().optional().nullable(),
    writerCost: z.coerce.number().optional(),
    status: z.enum(['New', 'InProgress', 'Completed', 'Cancelled', 'OnHold']),
    paymentStatus: z.enum(['NotPaid', 'PartiallyPaid', 'Paid', 'Refused']),
    refusalReason: z.string().optional(),
    deadline: z.string(),
    priority: z.enum(['low', 'normal', 'high']),
    links: z.string().optional(),
    internalNotes: z.string().optional()
  })
  .superRefine((value, ctx) => {
    if (value.paymentStatus === PaymentStatus.Refused && !value.refusalReason) {
      ctx.addIssue({ code: 'custom', path: ['refusalReason'], message: 'Reason required for refused payment.' });
    }
  });
