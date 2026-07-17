import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock Prisma so tests run without a database
vi.mock('../src/config/db.js', () => ({
  default: { user: { findUnique: vi.fn(), create: vi.fn() } },
}));

process.env.JWT_SECRET = 'test-secret';

const prisma = (await import('../src/config/db.js')).default;
const app = (await import('../src/app.js')).default;

describe('Auth API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('registers a new user and returns a token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: '1', name: 'Rishabh', email: 'test@example.com', password: 'hashed',
    });

    const res = await request(app).post('/api/auth/register')
      .send({ name: 'Rishabh', email: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('rejects duplicate registration', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });
    const res = await request(app).post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'secret123' });
    expect(res.status).toBe(409);
  });

  it('rejects login with invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'nope@example.com', password: 'x' });
    expect(res.status).toBe(401);
  });
});