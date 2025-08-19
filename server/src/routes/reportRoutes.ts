import { Router } from 'express';
import { getSpendingByCategory } from '../controllers/reportController';

const router = Router();

router.get('/spending-by-category', getSpendingByCategory);

export default router;
