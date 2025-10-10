import express from 'express';
import { validateRequest } from '@/middlewares/validateRequest';
import { performanceSchema } from './performance.schema';
import { performanceController } from './performance.controller';

const router = express.Router();

// @ GET /admin/performance-reviews
router.get(
  '/',
  validateRequest(performanceSchema.getPerformance),
  performanceController.getPerformance,
);

// @ GET /admin/performance-reviews/:id
router.get('/:id', performanceController.getPerformanceById);

// @ POST /admin/performance-reviews
router.post(
  '/',
  validateRequest(performanceSchema.insertUpdatePerformance),
  performanceController.insertPerformance,
);

// @ PUT /admin/performance-reviews/:id
router.put(
  '/:id',
  validateRequest(performanceSchema.insertUpdatePerformance),
  performanceController.updatePerformance,
);

// @ DELETE /admin/performance-reviews/:id
router.delete('/:id', performanceController.deletePerformance);

export default router;
