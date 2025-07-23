import { Router } from 'express';
import {
  createAccount,
  deleteAccount,
  getAccounts,
  getAccountsTransactions,
  updateAccount,
} from '../controllers/accountController';

const router = Router();

router.get('/', getAccounts);
router.get('/transactions', getAccountsTransactions);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;
