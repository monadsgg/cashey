import db from '../utils/db';

export async function getAllPayees(userId: number) {
  const payees = await db.payee.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    omit: {
      userId: true,
    },
  });

  return payees;
}

export async function addPayee(name: string, userId: number) {
  if (!name) throw new Error('Name is required');

  const payeeExists = await db.payee.findFirst({
    where: { name, userId },
  });
  if (payeeExists) throw new Error('Payee name already exists');

  const newPayee = await db.payee.create({
    data: {
      name,
      userId,
    },
    omit: {
      userId: true,
    },
  });

  return newPayee;
}

export async function editPayee(id: number, name: string, userId: number) {
  const payee = await db.payee.findUnique({ where: { id } });

  if (!payee || payee.userId !== userId)
    throw new Error('Payee not found or not allowed to edit');

  return db.payee.update({
    where: { id },
    data: { name },
    omit: {
      userId: true,
    },
  });
}

export async function removePayee(id: number, userId: number) {
  const payee = await db.payee.findUnique({ where: { id } });

  if (!payee || payee.userId !== userId)
    throw new Error('Payee not found or not allowed to delete');

  return db.payee.delete({ where: { id } });
}
