import express from 'express';
import { validateRequest } from '@/middlewares/validateRequest';
import { attendanceSchema } from './attendance.schema';
import { attendanceController } from './attendance.controller';

const router = express.Router();

// @ POST /app/attendance/start
router.post(
  '/start',
  validateRequest(attendanceSchema.clockInOutSchema),
  attendanceController.clockIn,
);

// @ POST /app/attendance/end
router.post(
  '/end',
  validateRequest(attendanceSchema.clockInOutSchema),
  attendanceController.clockOut,
);

export default router;
