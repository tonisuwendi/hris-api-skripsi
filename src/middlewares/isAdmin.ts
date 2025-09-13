import pool from '@/config/db.config';
import envConfig from '@/config/env.config';
import { ApiError } from '@/utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, 'Unauthorized: Missing token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Unauthorized: Invalid token format');
    }

    const decoded = jwt.verify(token, envConfig.jwtSecret) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== 'admin') {
      throw new ApiError(403, 'Forbidden: Admin access only');
    }

    const [rows] = await pool.query(
      'SELECT id, email FROM admins WHERE id = ? LIMIT 1',
      [decoded.userId],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new ApiError(401, 'Unauthorized: Admin not found');
    }

    const admin = rows[0] as { id: number; email: string };

    (req as any).user = { id: admin.id, email: admin.email, role: 'admin' };
    next();
  } catch (err) {
    next(err);
  }
};
