import fs from 'node:fs/promises';
import path from 'node:path';

interface InvoicePayload {
  invoiceNumber: string;
  businessName: string;
  subtitle: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientEmail?: string | null;
  orderTitle: string;
  lineItems: { description: string; qty: number; unitPrice: number }[];
  subtotal: number;
  tax?: number | null;
  total: number;
}

export async function saveInvoicePdfLike(payload: InvoicePayload) {
  const dir = path.join(process.cwd(), 'public', 'invoices');
  await fs.mkdir(dir, { recursive: true });
  const filename = `${payload.invoiceNumber}.pdf`;
  const target = path.join(dir, filename);
  const content = `ASSIGNMENT HELP PRO\n${payload.subtitle}\nInvoice ${payload.invoiceNumber}\nIssue:${payload.issueDate}\nDue:${payload.dueDate}\nClient:${payload.clientName} ${payload.clientEmail || ''}\nOrder:${payload.orderTitle}\nItems:\n${payload.lineItems
    .map((l) => `${l.description} | ${l.qty} x ${l.unitPrice}`)
    .join('\n')}\nSubtotal:${payload.subtotal}\nTax:${payload.tax || 0}\nTotal:${payload.total}`;
  await fs.writeFile(target, content);
  return `/invoices/${filename}`;
}
