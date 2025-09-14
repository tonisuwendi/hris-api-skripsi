import express from 'express';
import authRoutes from './auth/auth.routes';
import attendanceRoutes from './attendance/attendance.routes';
import { isEmployee } from '@/middlewares/isEmployee';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/attendance', isEmployee, attendanceRoutes);

export default routes;
