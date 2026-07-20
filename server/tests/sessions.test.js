import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// Mock Prisma so tests run without a database
vi.mock('../src/config/db.js', () => ({
  default: {
    chatSession: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

process.env.JWT_SECRET = 'test-secret';

const prisma = (await import('../src/config/db.js')).default;
const app = (await import('../src/app.js')).default;

const token = jwt.sign({ id: 'u1', email: 'test@example.com' }, 'test-secret');
const auth = (req) => req.set('Authorization', `Bearer ${token}`);

describe('Sessions API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/sessions');
    expect(res.status).toBe(401);
  });

  it('creates a session', async () => {
    prisma.chatSession.create.mockResolvedValue({ id: 's1', title: 'My chat', userId: 'u1' });
    const res = await auth(request(app).post('/api/sessions')).send({ title: 'My chat' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('My chat');
  });

  it('lists the user sessions', async () => {
    prisma.chatSession.findMany.mockResolvedValue([{ id: 's1', title: 'A' }]);
    const res = await auth(request(app).get('/api/sessions'));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('renames an owned session', async () => {
    prisma.chatSession.findFirst.mockResolvedValue({ id: 's1', userId: 'u1' });
    prisma.chatSession.update.mockResolvedValue({ id: 's1', title: 'Renamed' });
    const res = await auth(request(app).patch('/api/sessions/s1')).send({ title: 'Renamed' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Renamed');
  });

  it('returns 404 when deleting a session the user does not own', async () => {
    prisma.chatSession.findFirst.mockResolvedValue(null);
    const res = await auth(request(app).delete('/api/sessions/other'));
    expect(res.status).toBe(404);
  });
});
