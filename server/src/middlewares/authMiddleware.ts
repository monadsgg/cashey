import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../utils/db';
import dotenv from 'dotenv';

dotenv.config();

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    const user = await db.user.findUnique({ where: { id: decoded.id } });
    if (!user)
      return res.status(401).json({ message: 'Invalid token provided' });

    (req as any).userId = user.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token provided' });
  }
};
