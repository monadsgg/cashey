import { Router } from 'express';
import {
  createTag,
  deleteTag,
  getTags,
  updateTag,
} from '../controllers/tagController';

const router = Router();

router.get('/', getTags);
router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
