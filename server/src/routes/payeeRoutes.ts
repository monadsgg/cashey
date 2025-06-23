import { Router } from 'express';
import {
  createPayee,
  deletePayee,
  getPayees,
  updatePayee,
} from '../controllers/payeeController';

const router = Router();

router.get('/', getPayees);
router.post('/', createPayee);
router.put('/:id', updatePayee);
router.delete('/:id', deletePayee);

export default router;
