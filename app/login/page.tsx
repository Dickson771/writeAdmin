'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@ahp.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!res.ok) return setError('Invalid credentials');
    router.push('/dashboard');
  }

  return (
    <div className="max-w-md mx-auto card mt-24">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={login} className="space-y-3">
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn w-full">Sign In</button>
      </form>
    </div>
  );
}
