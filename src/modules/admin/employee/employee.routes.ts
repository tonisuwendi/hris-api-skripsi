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

// @ GET /admin/employees/:id
router.get('/:id', employeeController.getEmployeeById);

// @ POST /admin/employees
router.post(
  '/',
  upload.single('photo'),
  validateRequest(employeeSchema.insertEmployee),
  employeeController.insertEmployee,
);

// @ PUT /admin/employees/:id
router.put(
  '/:id',
  upload.single('photo'),
  validateRequest(employeeSchema.updateEmployee),
  employeeController.updateEmployee,
);

// @ DELETE /admin/employees/:id
router.delete('/:id', employeeController.deleteEmployee);

export default router;
