import { Router } from 'express';
import * as reportController from '../controllers/reportController.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';

const router = Router();

router.use(verifyFirebaseToken);
router.get('/workshop-participants', authorizeRoles('professor', 'tutor'), reportController.workshopParticipants);
router.get('/workshop-history', reportController.workshopHistory);
router.get('/dashboard', reportController.dashboard);

export default router;
