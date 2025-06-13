import { Router } from 'express';
import { getWalletById, getWallets } from '../controllers/walletController';

const router = Router();

router.get('/', getWallets);
router.get('/:id', getWalletById);

export default router;
