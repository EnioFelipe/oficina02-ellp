import * as userService from '../services/userService.js';

export async function createUser(req, res, next) {
  try {
    res.status(201).json(await userService.createUser(req.body));
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
}
