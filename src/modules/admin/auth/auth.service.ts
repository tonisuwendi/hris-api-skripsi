import pool from '@/config/db.config';
import bcryptjs from 'bcryptjs';
import { LoginInput } from './auth.schema';
import { ApiError } from '@/utils/ApiError';
import envConfig from '@/config/env.config';
import jwt from 'jsonwebtoken';
import { AdminQuery, IAdmin } from '@/types/modules';

const login = async (
  input: LoginInput,
): Promise<{
  token: string;
  user: Partial<IAdmin>;
}> => {
  const errorMessage = "Email or password doesn't match";

  const [rows] = await pool.query<AdminQuery[]>(
    'SELECT * FROM admins WHERE email = ?',
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

  const jwtPayload = { userId: user.id, role: 'admin' };

  const token = jwt.sign(jwtPayload, envConfig.jwtSecret, {
    expiresIn: '1h',
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
