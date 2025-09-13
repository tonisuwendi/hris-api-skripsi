import express from 'express';
import authRoutes from './auth/auth.routes';
import employeeRoutes from './employee/employee.routes';
import positionRoutes from './position/position.routes';
import { isAdmin } from '@/middlewares/isAdmin';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/positions', isAdmin, positionRoutes);
routes.use('/employees', isAdmin, employeeRoutes);

export default routes;
