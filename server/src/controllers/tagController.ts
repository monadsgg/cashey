import { Request, Response } from 'express';
import { addTag, editTag, getAllTags, removeTag } from '../services/tagService';

export async function getTags(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;

  try {
    const tags = await getAllTags(userId);
    res.status(200).json(tags);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch tags' });
  }
}

export async function createTag(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;
  const { name, color } = req.body;

  try {
    const tag = await addTag(name, color, userId);
    res.status(201).json(tag);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateTag(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;
  const { id } = req.params;
  const { name, color } = req.body;

  try {
    const tag = await editTag(Number(id), name, color, userId);
    res.status(200).json(tag);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteTag(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = res.locals.user;

  try {
    await removeTag(Number(id), userId);
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
