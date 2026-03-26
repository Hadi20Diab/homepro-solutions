/**
 * Create Admin User Script
 * ────────────────────────
 * Creates a Firebase Auth user AND the matching Firestore /users/{uid} document
 * with role = 'admin'.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts
 *
 * Credentials are read from these env vars (or prompted):
 *   ADMIN_EMAIL    (default: admin@homepro.com)
 *   ADMIN_PASSWORD (default: HomePro@2025!)
 *
 * Requires the same Firebase Admin credentials as the seed script:
 *   - serviceAccount.json  in project root, OR
 *   - FIREBASE_SERVICE_ACCOUNT env var, OR
 *   - GOOGLE_APPLICATION_CREDENTIALS env var
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function initAdmin() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error('❌  NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing from .env.local');
    process.exit(1);
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)), projectId });
    return;
  }
  const saPath = resolve(process.cwd(), 'serviceAccount.json');
  if (existsSync(saPath)) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(saPath, 'utf8'))), projectId });
    return;
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId });
    return;
  }
  console.error('❌  No Firebase Admin credentials found. See scripts/seed.ts for setup instructions.');
  process.exit(1);
}

async function createAdmin() {
  initAdmin();

  const email    = process.env.ADMIN_EMAIL    ?? 'admin@homepro.com';
  const password = process.env.ADMIN_PASSWORD ?? 'HomePro@2025!';
  const name     = 'Admin';

  console.log(`\n👤  Creating admin user: ${email}\n`);

  let uid: string;

  // Check if user already exists in Auth
  try {
    const existing = await admin.auth().getUserByEmail(email);
    uid = existing.uid;
    console.log(`  ℹ  Auth user already exists (uid: ${uid}), updating password…`);
    await admin.auth().updateUser(uid, { password, displayName: name });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === 'auth/user-not-found') {
      const created = await admin.auth().createUser({ email, password, displayName: name });
      uid = created.uid;
      console.log(`  ✓  Firebase Auth user created (uid: ${uid})`);
    } else if (code === 'auth/configuration-not-found') {
      console.error(`
❌  Firebase Authentication is not enabled for this project.

   To fix this:
   1. Go to https://console.firebase.google.com → your project
   2. Left sidebar → Authentication → Get started
   3. Sign-in method tab → Email/Password → Enable → Save
   4. Run this script again: npm run db:create-admin
`);
      process.exit(1);
    } else {
      throw err;
    }
  }

  // Upsert Firestore /users/{uid}
  await admin.firestore().doc(`users/${uid}`).set(
    { email, name, role: 'admin', createdAt: new Date().toISOString() },
    { merge: true },
  );
  console.log(`  ✓  Firestore users/${uid} set with role = admin`);

  console.log(`
✅  Admin user ready!

   URL:      http://localhost:3000/login
   Email:    ${email}
   Password: ${password}

   Change the password after first login.
`);
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('\n❌  Failed:', err);
  process.exit(1);
});
