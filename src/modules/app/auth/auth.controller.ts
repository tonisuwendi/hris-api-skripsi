import { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginData = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: loginData,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
};
