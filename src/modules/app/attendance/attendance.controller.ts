import { NextFunction, Request, Response } from 'express';
import { attendanceService } from './attendance.service';
import { ApiError } from '@/utils/ApiError';

const getAttendanceHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const params = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      start_date: String(req.query.start_date || ''),
      end_date: String(req.query.end_date || ''),
    };

    const historyData = await attendanceService.getAttendanceHistory(
      Number(userId),
      params,
    );

    res.status(200).json({
      success: true,
      message: 'Attendance history retrieved successfully',
      data: historyData,
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const params = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    };

    const requestData = await attendanceService.getAttendanceRequest(
      Number(userId),
      params,
    );

    res.status(200).json({
      success: true,
      message: 'Attendance request retrieved successfully',
      data: requestData,
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const currStatus = await attendanceService.getAttendanceStatus(
      Number(userId),
    );

    res.status(200).json({
      success: true,
      message: 'Attendance status retrieved successfully',
      data: currStatus,
    });
  } catch (error) {
    next(error);
  }
};

const clockIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new ApiError(400, 'Photo must be JPEG or PNG format');
      }
      if (req.file.size > 2 * 1024 * 1024) {
        throw new ApiError(400, 'Photo size must not exceed 2MB');
      }
    }

    const userId = (req as any).user?.id;
    const clockInData = await attendanceService.clockIn(
      req.body,
      Number(userId),
      req.file,
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
    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new ApiError(400, 'Photo must be JPEG or PNG format');
      }
      if (req.file.size > 2 * 1024 * 1024) {
        throw new ApiError(400, 'Photo size must not exceed 2MB');
      }
    }

    const userId = (req as any).user?.id;
    const clockOutData = await attendanceService.clockOut(
      req.body,
      Number(userId),
      req.file,
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

const requestAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const requestData = await attendanceService.requestAttendance(
      Number(userId),
      req.body,
    );

    res.status(201).json({
      success: true,
      message: 'Attendance request submitted successfully',
      data: requestData,
    });
  } catch (error) {
    next(error);
  }
};

export const attendanceController = {
  getAttendanceHistory,
  getAttendanceStatus,
  getAttendanceRequest,
  clockIn,
  clockOut,
  requestAttendance,
};
