import { body, param } from 'express-validator';
import { isValidCpf } from '../utils/cpf.js';

export const createEnrollmentValidators = [
  body('name').trim().notEmpty().withMessage('Nome e obrigatorio').escape(),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Idade invalida'),
  body('cpf').custom((value) => isValidCpf(value)).withMessage('CPF invalido'),
  body('workshop').isMongoId().withMessage('Oficina invalida')
];

export const cpfParamValidator = [
  param('cpf').custom((value) => isValidCpf(value)).withMessage('CPF invalido')
];

export const workshopParamValidator = [
  param('workshopId').isMongoId().withMessage('Oficina invalida')
];
