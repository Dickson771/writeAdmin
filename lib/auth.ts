import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const TOKEN_NAME = 'ahp_token';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { userId: string; email: string };
}

export async function setSession(token: string) {
  cookies().set(TOKEN_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/' });
}

export function getSessionToken() {
  return cookies().get(TOKEN_NAME)?.value;
}
