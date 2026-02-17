import { DataPage } from '@/components/DataPage';
export default function WritersPage() { return <DataPage endpoint="/api/writers" title="Writers" fields={['name', 'contact', 'specialization', 'rateType', 'rateValue', 'status']} />; }
