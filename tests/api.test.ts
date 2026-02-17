import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    client: { findMany: vi.fn(async () => [{ id: '1', name: 'C', orders: [] }]), create: vi.fn(async (x) => ({ id: 'n', ...x.data })) },
    writer: { findMany: vi.fn(async () => [{ id: '1', name: 'W', orders: [] }]), create: vi.fn(async (x) => ({ id: 'n', ...x.data })) },
    order: { findMany: vi.fn(async () => [] }
  }
}));

describe('API routes', () => {
  it('GET /api/clients returns json array', async () => {
    const { GET } = await import('../app/api/clients/route');
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST /api/writers validates and creates writer', async () => {
    const { POST } = await import('../app/api/writers/route');
    const req = new Request('http://localhost/api/writers', {
      method: 'POST',
      body: JSON.stringify({ name: 'J', rateType: 'flat', rateValue: 20, status: 'active' })
    });
    await expect(POST(req)).rejects.toBeTruthy();
  });
});
