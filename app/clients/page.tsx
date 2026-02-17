import { DataPage } from '@/components/DataPage';
export default function ClientsPage() { return <DataPage endpoint="/api/clients" title="Clients" fields={['name', 'email', 'phone', 'country', 'notes']} />; }
