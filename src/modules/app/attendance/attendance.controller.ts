import { NextFunction, Request, Response } from 'express';
import { attendanceService } from './attendance.service';

const clockIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const clockInData = await attendanceService.clockIn(
      req.body,
      Number(userId),
    );

    res.status(201).json({
      success: true,
      message: 'Clock-in successful',
      data: clockInData,
    });
  } catch (error) {
    next(error);
  }
};

const clockOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const clockOutData = await attendanceService.clockOut(
      req.body,
      Number(userId),
    );

    res.status(200).json({
      success: true,
      message: 'Clock-out successful',
      data: clockOutData,
    });
  } catch (error) {
    next(error);
  }
};

export const attendanceController = {
  clockIn,
  clockOut,
};
