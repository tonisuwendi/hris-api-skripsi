import express from 'express';
import authRoutes from './auth/auth.routes';
import employeeRoutes from './employee/employee.routes';
import positionRoutes from './position/position.routes';
import officeLocationRoutes from './officeloc/officeloc.routes';
import attendanceRoutes from './attendance/attendance.routes';
import taskSummaryRoutes from './taskSummary/taskSummary.routes';
import performanceRoutes from './performance/performance.routes';
import salaryRoutes from './salary/salary.routes';
import { isAdmin } from '@/middlewares/isAdmin';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/positions', isAdmin, positionRoutes);
routes.use('/employees', isAdmin, employeeRoutes);
routes.use('/office-locations', isAdmin, officeLocationRoutes);
routes.use('/attendance', isAdmin, attendanceRoutes);
routes.use('/task-summary', isAdmin, taskSummaryRoutes);
routes.use('/performance-reviews', isAdmin, performanceRoutes);
routes.use('/salary', isAdmin, salaryRoutes);

export default routes;
