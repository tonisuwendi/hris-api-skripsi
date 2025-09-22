import express from 'express';
import { validateRequest } from '@/middlewares/validateRequest';
import { taskSummarySchema } from './taskSummary.schema';
import { taskSummaryController } from './taskSummary.controller';

const router = express.Router();

// @ GET /admin/task-summary
router.get(
  '/',
  validateRequest(taskSummarySchema.getTaskSummary),
  taskSummaryController.getTaskSummary,
);

// @ GET /admin/task-summary/:id
router.get('/:id', taskSummaryController.getTaskSummaryById);

// @ POST /admin/task-summary
router.post(
  '/',
  validateRequest(taskSummarySchema.insertUpdateTaskSummary),
  taskSummaryController.insertTaskSummary,
);

// @ PUT /admin/task-summary/:id
router.put(
  '/:id',
  validateRequest(taskSummarySchema.insertUpdateTaskSummary),
  taskSummaryController.updateTaskSummary,
);

// @ DELETE /admin/task-summary/:id
router.delete('/:id', taskSummaryController.deleteTaskSummary);

export default router;
