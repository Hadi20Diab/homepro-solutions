/**
 * Firebase Admin SDK singleton — server-side only (API routes, Route Handlers).
 * Never import this in client components.
 */
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function getApp(): admin.app.App {
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    return admin.initializeApp({ credential: admin.credential.cert(sa), projectId });
  }

  const saPath = resolve(process.cwd(), 'serviceAccount.json');
  if (existsSync(saPath)) {
    const sa = JSON.parse(readFileSync(saPath, 'utf8'));
    return admin.initializeApp({ credential: admin.credential.cert(sa), projectId });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId });
  }

  throw new Error(
    'Firebase Admin: no credentials found. ' +
    'Provide FIREBASE_SERVICE_ACCOUNT env var or place serviceAccount.json in the project root.',
  );
}

// Lazy getters — initialization only happens when the value is first accessed,
// not at module load time. This prevents build failures when env vars are absent.
export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(_, prop) {
    return (getApp().auth() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop) {
    return (getApp().firestore() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
