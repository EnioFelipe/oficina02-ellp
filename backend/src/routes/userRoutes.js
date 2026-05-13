import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createUserValidators } from '../validators/userValidators.js';

const router = Router();

router.post('/', createUserValidators, validateRequest, userController.createUser);

export default router;
