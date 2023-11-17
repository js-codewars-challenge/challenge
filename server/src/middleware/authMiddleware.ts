import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }

  try {
    const token = req.headers.authorization;

    if (!token) throw new Error();

    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) throw new Error();

    const decodedData = jwt.verify(token, secretKey);

    req.user = decodedData;
    next();
  } catch (err) {
    res.status(401).json({
      message:
        err?.message === 'jwt expired'
          ? 'Authorization token has been expired'
          : 'Authorization failed',
    });
  }
};
