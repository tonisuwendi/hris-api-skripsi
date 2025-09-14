import pool from '@/config/db.config';
import envConfig from '@/config/env.config';
import { ApiError } from '@/utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

type IEmployeeQuery = {
  id: number;
  email: string;
  status: 'active' | 'inactive';
} & RowDataPacket;

export const isEmployee = async (
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

    if (decoded.role !== 'employee') {
      throw new ApiError(403, 'Forbidden: Employee access only');
    }

    const [rows] = await pool.query<IEmployeeQuery[]>(
      'SELECT id, email, status FROM employees WHERE id = ? LIMIT 1',
      [decoded.userId],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new ApiError(401, 'Unauthorized: Employee not found');
    }

    if (rows[0].status !== 'active') {
      throw new ApiError(403, 'Forbidden: Employee account is inactive');
    }

    const employee = rows[0] as { id: number; email: string };

    (req as any).user = {
      id: employee.id,
      email: employee.email,
      role: 'employee',
    };
    next();
  } catch (err) {
    next(err);
  }
};
