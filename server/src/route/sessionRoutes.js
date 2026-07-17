import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  createSession, getSessions, getSession, renameSession, deleteSession,
} from '../controllers/sessionController.js';

const router = Router();
router.use(protect);
router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSession);
router.patch('/:id', renameSession);
router.delete('/:id', deleteSession);
export default router;