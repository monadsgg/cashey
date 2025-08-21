import { Request, Response } from 'express';
import {
  getCategorySpending,
  getStatsOverview,
} from '../services/reportService';

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
    res.status(500).json({ message: 'Failed to fetch category spending map' });
  }
}

export async function getOverviewStats(
  req: Request,
  res: Response,
): Promise<void> {
  const { month, year } = req.query;
  const userId = res.locals.user;
  try {
    const overview = await getStatsOverview(
      userId,
      Number(month),
      Number(year),
    );
    res.status(200).json(overview);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch overview' });
  }
}
