import express from 'express';
import multer from 'multer';
import { validateRequest } from '@/middlewares/validateRequest';
import { attendanceSchema } from './attendance.schema';
import { attendanceController } from './attendance.controller';

const router = express.Router();

const upload = multer();

// @ GET /app/attendance/history
router.get(
  '/history',
  validateRequest(attendanceSchema.getAttendanceHistory),
  attendanceController.getAttendanceHistory,
);

// @ GET /app/attendance/request
router.get(
  '/request',
  validateRequest(attendanceSchema.getAttendanceRequest),
  attendanceController.getAttendanceRequest,
);

// @ GET /app/attendance/status
router.get('/status', attendanceController.getAttendanceStatus);

// @ POST /app/attendance/start
router.post(
  '/start',
  upload.single('photo'),
  validateRequest(attendanceSchema.clockInOutSchema),
  attendanceController.clockIn,
);

// @ POST /app/attendance/request
router.post(
  '/request',
  validateRequest(attendanceSchema.requestAttendanceSchema),
  attendanceController.requestAttendance,
);

// @ POST /app/attendance/end
router.post(
  '/end',
  upload.single('photo'),
  validateRequest(attendanceSchema.clockInOutSchema),
  attendanceController.clockOut,
);

export default router;
