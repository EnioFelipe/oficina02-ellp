import admin from '../config/firebase.js';
import User from '../models/User.js';

export async function verifyFirebaseToken(req, _res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      return next({ statusCode: 401, message: 'Token Firebase nao informado' });
    }

    const token = header.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return next({ statusCode: 401, message: 'Usuario nao cadastrado no sistema' });
    }

    req.firebaseUser = decodedToken;
    req.user = user;
    next();
  } catch (_error) {
    next({ statusCode: 401, message: 'Token Firebase invalido ou expirado' });
  }
}
