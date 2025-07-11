import { Router } from 'express';
import {
  createSavingAccount,
  deleteSavingAccounts,
  getSavingAccounts,
  getSavingsTransactions,
  updateSavingAccounts,
} from '../controllers/savingAccountController';

const router = Router();

router.get('/', getSavingAccounts);
router.get('/transactions', getSavingsTransactions);
router.post('/', createSavingAccount);
router.put('/:id', updateSavingAccounts);
router.delete('/:id', deleteSavingAccounts);

export default router;
