import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedScript = path.resolve(__dirname, '../../backend/scripts/e2e-seed.mjs');

export default async function globalSetup() {
  execSync(`node "${seedScript}"`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/oficina02-e2e'
    }
  });
}
