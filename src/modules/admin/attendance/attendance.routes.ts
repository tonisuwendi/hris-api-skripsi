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

// @ GET /admin/attendance/request
router.get(
  '/request',
  validateRequest(attendanceSchema.getAttendanceRequest),
  attendanceController.getAttendanceRequest,
);

// @ GET /admin/attendance/:id
router.get('/:id', attendanceController.getAttendanceById);

// @ PUT /admin/attendance/request/update-status
router.put(
  '/request/update-status',
  validateRequest(attendanceSchema.updateStatusRequestSchema),
  attendanceController.updateStatusRequest,
);

// @ PUT /admin/attendance/:id
router.put(
  '/:id',
  validateRequest(attendanceSchema.updateAttendance),
  attendanceController.updateAttendance,
);

export default router;
