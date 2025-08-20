import { Router } from 'express';
import {
  getOverviewStats,
  getSpendingByCategory,
} from '../controllers/reportController';

const router = Router();

router.get('/spending-by-category', getSpendingByCategory);
router.get('/overview', getOverviewStats);

export default router;
