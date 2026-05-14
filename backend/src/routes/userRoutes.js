import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';
import { createUserValidators, updateUserValidators } from '../validators/userValidators.js';

const router = Router();

router.post('/', createUserValidators, validateRequest, userController.createUser);

router.use(verifyFirebaseToken);
router.get('/', authorizeRoles('professor', 'tutor'), userController.listUsers);
router.get('/me', userController.getMe);
router.get('/:id', userController.getUser);
router.put('/:id', authorizeRoles('professor'), updateUserValidators, validateRequest, userController.updateUser);
router.delete('/:id', authorizeRoles('professor'), userController.deleteUser);

export default router;
