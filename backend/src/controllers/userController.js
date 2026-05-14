import * as userService from '../services/userService.js';

export async function listUsers(req, res, next) {
  try {
    res.json(await userService.listUsers(req.query));
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    res.json(await userService.getUserById(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    res.json(await userService.getUserByFirebaseUid(req.firebaseUser.uid));
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    res.status(201).json(await userService.createUser(req.body));
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    res.json(await userService.updateUser(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
