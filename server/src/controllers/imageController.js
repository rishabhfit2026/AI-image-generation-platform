import prisma from '../config/db.js';
import { generateImage } from '../services/imageService.js';

export const generate = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    let { sessionId } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ message: 'Prompt is required' });

    if (!sessionId) {
      const created = await prisma.chatSession.create({
        data: { title: prompt.slice(0, 40), userId: req.user.id },
      });
      sessionId = created.id;
    } else {
      const owned = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId: req.user.id },
      });
      if (!owned) return res.status(404).json({ message: 'Session not found' });
    }

    const imageUrl = await generateImage(prompt);

    const generation = await prisma.imageGeneration.create({
      data: { prompt, imageUrl, sessionId },
    });

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({ generation, sessionId });
  } catch (err) { next(err); }
};

export const regenerate = async (req, res, next) => {
  try {
    const original = await prisma.imageGeneration.findFirst({
      where: { id: req.params.id, session: { userId: req.user.id } },
    });
    if (!original) return res.status(404).json({ message: 'Generation not found' });

    const imageUrl = await generateImage(original.prompt);
    const generation = await prisma.imageGeneration.create({
      data: { prompt: original.prompt, imageUrl, sessionId: original.sessionId },
    });

    await prisma.chatSession.update({
      where: { id: original.sessionId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({ generation, sessionId: original.sessionId });
  } catch (err) { next(err); }
};

export const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const where = {
      session: { userId: req.user.id },
      prompt: { contains: search, mode: 'insensitive' },
    };

    const [items, total] = await Promise.all([
      prisma.imageGeneration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { session: { select: { id: true, title: true } } },
      }),
      prisma.imageGeneration.count({ where }),
    ]);

    res.json({ items, page, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};
