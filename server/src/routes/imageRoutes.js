import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { generate, getHistory } from '../controllers/imageController.js';

const router = Router();
router.use(protect);
router.post('/generate', generate);
router.get('/history', getHistory);
export default router;