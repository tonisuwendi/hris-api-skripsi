import express from 'express';
import { validateRequest } from '@/middlewares/validateRequest';
import { officeLocationSchema } from './officeloc.schema';
import { officeLocationController } from './officeloc.controller';

const router = express.Router();

// @ GET /admin/office-locations
router.get(
  '/',
  validateRequest(officeLocationSchema.getOfficeLocation),
  officeLocationController.getOfficeLocations,
);

// @ POST /admin/office-locations
router.post(
  '/',
  validateRequest(officeLocationSchema.insertUpdateOfficeLocation),
  officeLocationController.insertOfficeLocation,
);

// @ PUT /admin/office-locations/:id
router.put(
  '/:id',
  validateRequest(officeLocationSchema.insertUpdateOfficeLocation),
  officeLocationController.updateOfficeLocation,
);

// @ DELETE /admin/office-locations/:id
router.delete('/:id', officeLocationController.deleteOfficeLocation);

export default router;
