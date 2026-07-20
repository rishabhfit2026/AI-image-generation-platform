import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { generate, regenerate, getHistory } from '../controllers/imageController.js';

const router = Router();
router.use(protect);
router.post('/generate', generate);
router.post('/:id/regenerate', regenerate);
router.get('/history', getHistory);
export default router;