import prisma from '../config/db.js';

export const createSession = async (req, res, next) => {
  try {
    const session = await prisma.chatSession.create({
      data: { title: req.body.title || 'New Chat', userId: req.user.id },
    });
    res.status(201).json(session);
  } catch (err) { next(err); }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { generations: true } } },
    });
    res.json(sessions);
  } catch (err) { next(err); }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await prisma.chatSession.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { generations: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) { next(err); }
};

export const renameSession = async (req, res, next) => {
  try {
    const owned = await prisma.chatSession.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!owned) return res.status(404).json({ message: 'Session not found' });

    const session = await prisma.chatSession.update({
      where: { id: req.params.id },
      data: { title: req.body.title },
    });
    res.json(session);
  } catch (err) { next(err); }
};

export const deleteSession = async (req, res, next) => {
  try {
    const owned = await prisma.chatSession.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!owned) return res.status(404).json({ message: 'Session not found' });

    await prisma.chatSession.delete({ where: { id: req.params.id } });
    res.json({ message: 'Session deleted' });
  } catch (err) { next(err); }
};