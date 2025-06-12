import { Router } from 'express';
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from '../controllers/budgetController';

const router = Router();

router.get('/', getBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
