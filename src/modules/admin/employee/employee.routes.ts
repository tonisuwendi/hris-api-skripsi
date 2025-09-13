import express from 'express';
import multer from 'multer';
import { validateRequest } from '@/middlewares/validateRequest';
import { employeeSchema } from './employee.schema';
import { employeeController } from './employee.controller';

const router = express.Router();

const upload = multer();

// @ GET /admin/employees
router.get(
  '/',
  validateRequest(employeeSchema.getEmployees),
  employeeController.getEmployees,
);

// @ POST /admin/employees
router.post(
  '/',
  upload.single('photo'),
  validateRequest(employeeSchema.insertEmployee),
  employeeController.insertEmployee,
);

export default router;
