import { Router } from 'express';
import {
  createSavingAccount,
  deleteSavingAccounts,
  getSavingAccounts,
  updateSavingAccounts,
} from '../controllers/savingAccountController';

const router = Router();

router.get('/', getSavingAccounts);
router.post('/', createSavingAccount);
router.put('/:id', updateSavingAccounts);
router.delete('/:id', deleteSavingAccounts);

export default router;
