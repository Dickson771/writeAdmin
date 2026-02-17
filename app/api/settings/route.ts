import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const settings = await prisma.setting.upsert({ where: { id: 'singleton' }, update: {}, create: { id: 'singleton' } });
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const settings = await prisma.setting.upsert({ where: { id: 'singleton' }, update: body, create: { id: 'singleton', ...body } });
  return NextResponse.json(settings);
}
