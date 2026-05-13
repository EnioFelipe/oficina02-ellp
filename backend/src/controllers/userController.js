import * as userService from '../services/userService.js';

export async function createUser(req, res, next) {
  try {
    res.status(201).json(await userService.createUser(req.body));
  } catch (error) {
    next(error);
  }
}
