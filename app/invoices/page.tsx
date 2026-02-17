import { DataPage } from '@/components/DataPage';
export default function InvoicesPage() { return <DataPage endpoint="/api/invoices" title="Invoices" fields={['orderId', 'issueDate', 'dueDate', 'status', 'paymentLink']} />; }
