import { z } from 'zod';

const login = z.object({
  email: z.string({ required_error: 'Email is required' }),
  password: z.string({ required_error: 'Password is required' }),
});

export const authSchema = {
  login,
};

export type LoginInput = z.infer<typeof authSchema.login>;
