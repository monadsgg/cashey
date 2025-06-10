import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../utils/db';
import dotenv from 'dotenv';

dotenv.config();

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers?.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    const user = await db.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      res.status(401).json({ message: 'Invalid token provided' });
      return;
    }

    res.locals.user = user.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token provided' });
  }
};
