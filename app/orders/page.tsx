import { DataPage } from '@/components/DataPage';
export default function OrdersPage() {
  return <DataPage endpoint="/api/orders" title="Orders" fields={['clientId', 'title', 'orderType', 'subject', 'priceQuoted', 'paymentStatus', 'deadline', 'status', 'priority', 'refusalReason']} />;
}
