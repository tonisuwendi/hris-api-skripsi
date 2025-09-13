import express from 'express';
import { validateRequest } from '@/middlewares/validateRequest';
import { positionSchema } from './position.schema';
import { positionController } from './position.controller';

const router = express.Router();

// @ GET /admin/positions
router.get(
  '/',
  validateRequest(positionSchema.getPositions),
  positionController.getPositions,
);

// @ POST /admin/positions
router.post(
  '/',
  validateRequest(positionSchema.insertUpdatePosition),
  positionController.insertPosition,
);

// @ PUT /admin/positions/:id
router.put(
  '/:id',
  validateRequest(positionSchema.insertUpdatePosition),
  positionController.updatePosition,
);

// @ DELETE /admin/positions/:id
router.delete('/:id', positionController.deletePosition);

export default router;
