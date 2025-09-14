import express from 'express';
import { validateRequest } from '@/middlewares/validateRequest';
import { attendanceSchema } from './attendance.schema';
import { attendanceController } from './attendance.controller';

const router = express.Router();

// @ GET /admin/attendance
router.get(
  '/',
  validateRequest(attendanceSchema.getAttendances),
  attendanceController.getAttendances,
);

// @ PUT /admin/attendance/:id
router.put(
  '/:id',
  validateRequest(attendanceSchema.updateAttendance),
  attendanceController.updateAttendance,
);

export default router;
