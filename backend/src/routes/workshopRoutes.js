import { Router } from 'express';
import * as workshopController from '../controllers/workshopController.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';
import { participantValidator, workshopValidators } from '../validators/workshopValidators.js';

const router = Router();

router.get('/', workshopController.listWorkshops);
router.get('/:id', workshopController.getWorkshop);

router.use(verifyFirebaseToken);
router.post('/', authorizeRoles('professor', 'tutor'), workshopValidators, validateRequest, workshopController.createWorkshop);
router.put('/:id', authorizeRoles('professor', 'tutor'), workshopValidators, validateRequest, workshopController.updateWorkshop);
router.delete('/:id', authorizeRoles('professor', 'tutor'), workshopController.deleteWorkshop);
router.post('/:id/tutors', authorizeRoles('professor', 'tutor'), participantValidator, validateRequest, workshopController.addTutor);
router.delete('/:id/tutors/:tutorId', authorizeRoles('professor', 'tutor'), workshopController.removeTutor);

export default router;
