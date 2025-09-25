import { NextFunction, Request, Response } from 'express';
import { attendanceService } from './attendance.service';

const getAttendances = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.query;
    const result = await attendanceService.getAttendances(params);
    res.status(200).json({
      success: true,
      message: 'Attendance sessions retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await attendanceService.getAttendanceById(Number(id));
    res.status(200).json({
      success: true,
      message: 'Attendance session retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await attendanceService.updateAttendance(
      Number(id),
      req.body,
    );
    res.status(200).json({
      success: true,
      message: 'Attendance session updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const attendanceController = {
  getAttendances,
  getAttendanceById,
  updateAttendance,
};
