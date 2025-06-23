import db from '../utils/db';

export async function getAllTags(userId: number) {
  const tags = await db.tag.findMany({
    where: { userId },
  });

  return tags;
}

export async function addTag(name: string, userId: number) {
  if (!name) throw new Error('Name is required');

  const tagExists = await db.tag.findFirst({
    where: { name, userId },
  });
  if (tagExists) throw new Error('Tag name already exists');

  const newTag = await db.tag.create({
    data: {
      name,
      userId,
    },
  });

  return newTag;
}

export async function editTag(id: number, name: string, userId: number) {
  const tag = await db.tag.findUnique({ where: { id } });

  if (!tag || tag.userId !== userId)
    throw new Error('Tag not found or not allowed to edit');

  return db.tag.update({ where: { id }, data: { name } });
}

export async function removeTag(id: number, userId: number) {
  const tag = await db.tag.findUnique({ where: { id } });

  if (!tag || tag.userId !== userId)
    throw new Error('Tag not found or not allowed to delete');

  return db.tag.delete({ where: { id } });
}
