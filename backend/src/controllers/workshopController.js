import * as workshopService from '../services/workshopService.js';

export async function listWorkshops(req, res, next) {
  try {
    res.json(await workshopService.listWorkshops(req.query));
  } catch (error) {
    next(error);
  }
}

export async function getWorkshop(req, res, next) {
  try {
    res.json(await workshopService.getWorkshopById(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function createWorkshop(req, res, next) {
  try {
    res.status(201).json(await workshopService.createWorkshop(req.body));
  } catch (error) {
    next(error);
  }
}

export async function updateWorkshop(req, res, next) {
  try {
    res.json(await workshopService.updateWorkshop(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

export async function deleteWorkshop(req, res, next) {
  try {
    await workshopService.deleteWorkshop(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function addTutor(req, res, next) {
  try {
    res.json(await workshopService.addParticipant(req.params.id, req.body.participantId, 'tutor'));
  } catch (error) {
    next(error);
  }
}

export async function removeTutor(req, res, next) {
  try {
    res.json(await workshopService.removeParticipant(req.params.id, req.params.tutorId, 'tutor'));
  } catch (error) {
    next(error);
  }
}
