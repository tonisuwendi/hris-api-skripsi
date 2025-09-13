import express from 'express';
import { validateRequest } from '@/middlewares/validateRequest';
import { authController } from './auth.controller';
import { authSchema } from './auth.schema';

const router = express.Router();

// @ POST /admin/auth/login
router.post('/login', validateRequest(authSchema.login), authController.login);

export default router;
