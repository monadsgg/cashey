import { Request, Response } from 'express';
import { getCategorySpending } from '../services/reportService';

export async function getSpendingByCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const { month, year } = req.query;
  const userId = res.locals.user;
  try {
    const categorySpendingMap = await getCategorySpending(
      userId,
      Number(month),
      Number(year),
    );
    res.status(200).json(categorySpendingMap);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Failed to fetch other category spending map' });
  }
}
