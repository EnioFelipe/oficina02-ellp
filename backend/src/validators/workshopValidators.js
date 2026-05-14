import { body } from 'express-validator';

export const workshopValidators = [
  body('name').notEmpty().withMessage('Nome e obrigatorio'),
  body('description').notEmpty().withMessage('Descricao e obrigatoria'),
  body('date').isISO8601().withMessage('Data invalida'),
  body('workload').isInt({ min: 1 }).withMessage('Carga horaria deve ser maior que zero'),
  body('professor').isMongoId().withMessage('Responsavel invalido'),
  body('status').optional().isIn(['ativa', 'finalizada']).withMessage('Status invalido')
];

export const participantValidator = [
  body('participantId').isMongoId().withMessage('Participante invalido')
];
