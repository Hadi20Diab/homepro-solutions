import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, where, orderBy, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '@/types';

const COL = 'services';

export async function getServices(publishedOnly = false): Promise<Service[]> {
  const ref = collection(db, COL);
  const q = publishedOnly
    ? query(ref, where('isActive', '==', true))
    : query(ref, orderBy('order', 'asc'));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
  return publishedOnly
    ? docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : docs;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const q = query(collection(db, COL), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Service;
}

export async function getServiceById(id: string): Promise<Service | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Service;
}

export async function createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(db, COL), { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
