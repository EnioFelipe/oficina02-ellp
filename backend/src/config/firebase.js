import admin from 'firebase-admin';
import fs from 'node:fs';

function buildCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const raw = fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf-8');
    return admin.credential.cert(JSON.parse(raw));
  }

  return admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  });
}

if (!admin.apps.length) {
  admin.initializeApp({ credential: buildCredential() });
}

export default admin;
