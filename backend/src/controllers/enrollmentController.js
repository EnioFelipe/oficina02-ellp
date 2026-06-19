import * as enrollmentService from '../services/enrollmentService.js';

export async function createEnrollment(req, res, next) {
  try {
    res.status(201).json(await enrollmentService.createEnrollment(req.body));
  } catch (error) {
    next(error);
  }
}

export async function findByCpf(req, res, next) {
  try {
    res.json(await enrollmentService.findEnrollmentsByCpf(req.params.cpf));
  } catch (error) {
    next(error);
  }
}

export async function findByWorkshop(req, res, next) {
  try {
    res.json(await enrollmentService.findEnrollmentsByWorkshop(req.params.workshopId));
  } catch (error) {
    next(error);
  }
}
