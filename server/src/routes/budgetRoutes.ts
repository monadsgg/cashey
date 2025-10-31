import { Router } from 'express';
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
  copyBudget,
} from '../controllers/budgetController';

const router = Router();

router.get('/', getBudgets);
router.post('/', createBudget);
router.post('/copy', copyBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
