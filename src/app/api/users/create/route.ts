import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    // Verify caller is an admin
    const idToken = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(idToken);
    const callerSnap = await adminDb.doc(`users/${decoded.uid}`).get();
    if (callerSnap.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }

    const { email, password, name, role } = await req.json();
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the Firebase Auth user
    const authUser = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Write the Firestore document
    await adminDb.doc(`users/${authUser.uid}`).set({
      email,
      name,
      displayName: name,
      role,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ uid: authUser.uid, email, name, role });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // Firebase "email already exists" error code
    const status = (err as { code?: string }).code === 'auth/email-already-exists' ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
