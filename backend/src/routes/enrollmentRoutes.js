import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollmentController.js';
import { rateLimitByIp } from '../middlewares/rateLimitByIp.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { cpfParamValidator, createEnrollmentValidators, workshopParamValidator } from '../validators/enrollmentValidators.js';

const router = Router();

router.post('/', rateLimitByIp({ windowMs: 60000, max: 10 }), createEnrollmentValidators, validateRequest, enrollmentController.createEnrollment);
router.get('/cpf/:cpf', rateLimitByIp({ windowMs: 60000, max: 20 }), cpfParamValidator, validateRequest, enrollmentController.findByCpf);
router.get(
  '/workshop/:workshopId',
  verifyFirebaseToken,
  authorizeRoles('professor', 'tutor'),
  workshopParamValidator,
  validateRequest,
  enrollmentController.findByWorkshop
);

export default router;
