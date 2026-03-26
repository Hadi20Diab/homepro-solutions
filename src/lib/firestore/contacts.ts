import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ContactSubmission } from '@/types';

const COL = 'contacts';

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactSubmission));
}

export async function createContactSubmission(
  data: Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>
): Promise<void> {
  await addDoc(collection(db, COL), {
    ...data,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export async function markContactRead(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { read: true });
}

export async function deleteContactSubmission(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
