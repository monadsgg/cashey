import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  transferFundsTransaction,
  updateTransaction,
} from '../controllers/transactionController';

const router = Router();

router.get('/', getTransactions);
router.post('/', createTransaction);
router.post('/transfer', transferFundsTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
