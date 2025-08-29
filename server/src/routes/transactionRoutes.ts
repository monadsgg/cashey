import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  importTransactions,
  transferFundsTransaction,
  updateTransaction,
} from '../controllers/transactionController';

const router = Router();

router.get('/', getTransactions);
router.post('/', createTransaction);
router.post('/transfer', transferFundsTransaction);
router.post('/import-transactions', importTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
