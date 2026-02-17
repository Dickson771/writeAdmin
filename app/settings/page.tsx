'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>();
  useEffect(() => { fetch('/api/settings').then((r) => r.json()).then(setSettings); }, []);
  if (!settings) return <p>Loading...</p>;
  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    alert('Saved');
  }
  return (
    <form onSubmit={save} className="space-y-3 max-w-2xl">
      <h2 className="text-2xl font-bold">Admin Settings</h2>
      {['businessName', 'businessSubtitle', 'email', 'phone', 'address', 'invoicePrefix'].map((f) => (
        <input key={f} className="input" value={settings[f] || ''} onChange={(e) => setSettings({ ...settings, [f]: e.target.value })} placeholder={f} />
      ))}
      <button className="btn">Save Settings</button>
    </form>
  );
}
