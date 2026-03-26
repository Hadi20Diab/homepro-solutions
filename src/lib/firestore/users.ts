import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AppUser } from '@/types';

const COL = 'users';

export async function getUsers(): Promise<AppUser[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() } as AppUser));
}

export async function getUserById(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, COL, uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as AppUser;
}

export async function createUser(user: AppUser): Promise<void> {
  await setDoc(doc(db, COL, user.uid), {
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt,
  });
}

export async function updateUserRole(uid: string, role: AppUser['role']): Promise<void> {
  await updateDoc(doc(db, COL, uid), { role });
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, COL, uid));
}
