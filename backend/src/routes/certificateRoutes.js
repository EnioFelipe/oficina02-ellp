import { Router } from 'express';
import { generateCertificate } from '../controllers/certificateController.js';
import { rateLimitByIp } from '../middlewares/rateLimitByIp.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { cpfParamValidator } from '../validators/enrollmentValidators.js';

const router = Router();

router.get('/:workshopId/:cpf', rateLimitByIp({ windowMs: 60000, max: 15 }), cpfParamValidator, validateRequest, generateCertificate);

export default router;
