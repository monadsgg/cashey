import { Router } from 'express';
import {
  getWalletById,
  getWallets,
  updateWallet,
} from '../controllers/walletController';

const router = Router();

router.get('/', getWallets);
router.get('/:id', getWalletById);
router.put('/:id', updateWallet);

export default router;
