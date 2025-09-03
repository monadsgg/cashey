import { Request, Response, NextFunction } from 'express';

export const checkOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (res.locals.user !== Number(req.params.id)) {
    res
      .status(403)
      .json({ message: 'Forbidden: You can only access your own data' });

    return;
  }

  next();
};
