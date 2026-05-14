import { body } from 'express-validator';

export const createUserValidators = [
  body('name').notEmpty().withMessage('Nome e obrigatorio'),
  body('email').isEmail().withMessage('E-mail invalido'),
  body('type').isIn(['professor', 'tutor']).withMessage('Tipo invalido'),
  body('firebaseUid').notEmpty().withMessage('UID do Firebase e obrigatorio')
];

export const updateUserValidators = [
  body('name').optional().notEmpty().withMessage('Nome nao pode ser vazio'),
  body('email').optional().isEmail().withMessage('E-mail invalido'),
  body('type').optional().isIn(['professor', 'tutor']).withMessage('Tipo invalido')
];
