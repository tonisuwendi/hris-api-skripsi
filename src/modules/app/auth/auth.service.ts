import pool from '@/config/db.config';
import bcryptjs from 'bcryptjs';
import { LoginInput } from './auth.schema';
import { ApiError } from '@/utils/ApiError';
import envConfig from '@/config/env.config';
import jwt from 'jsonwebtoken';
import { EmployeeQuery, IEmployee } from '@/types/modules';

const login = async (
  input: LoginInput,
): Promise<{
  token: string;
  user: Partial<IEmployee>;
}> => {
  const errorMessage = "Email or password doesn't match";

  const [rows] = await pool.query<EmployeeQuery[]>(
    'SELECT * FROM employees WHERE email = ?',
    [input.email],
  );

  if (rows.length === 0) {
    throw new ApiError(404, errorMessage);
  }

  const user = rows[0];

  const isPasswordValid = await bcryptjs.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, errorMessage);
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'Your account is inactive. Please contact admin.');
  }

  const jwtPayload = { userId: user.id, role: 'employee' };

  const token = jwt.sign(jwtPayload, envConfig.jwtSecret, {
    expiresIn: '7d',
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const authService = {
  login,
};
