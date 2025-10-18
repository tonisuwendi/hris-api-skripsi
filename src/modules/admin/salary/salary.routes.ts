import express from 'express';
import { validateRequest } from '@/middlewares/validateRequest';
import { salarySchema } from './salary.schema';
import { salaryController } from './salary.controller';

const router = express.Router();

// @ GET /admin/salary/recommendations
router.get(
  '/recommendations',
  validateRequest(salarySchema.getSalaryRecommendations),
  salaryController.getSalaryRecommendations,
);

// @ GET /admin/salary/recommendations/:employeeId
router.get(
  '/recommendations/:employeeId',
  validateRequest(salarySchema.getSalaryRecommendationDetail),
  salaryController.getSalaryRecommendationDetail,
);

export default router;
