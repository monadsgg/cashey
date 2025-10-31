import { Router } from 'express';
import {
  register,
  login,
  getUser,
  getUserCategories,
} from '../controllers/userController';
import { verifyJWT } from '../middlewares/authMiddleware';
import { checkOwnership } from '../middlewares/checkOwnership';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', getUser);
router.get('/:id/categories', verifyJWT, checkOwnership, getUserCategories);

export default router;
