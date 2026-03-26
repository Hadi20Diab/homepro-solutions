import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { NewsPost } from '@/types';

const COL = 'news';

export async function getNewsPosts(publishedOnly = false): Promise<NewsPost[]> {
  const ref = collection(db, COL);
  const q = publishedOnly
    ? query(ref, where('isPublished', '==', true), orderBy('createdAt', 'desc'))
    : query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsPost));
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  const q = query(collection(db, COL), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as NewsPost;
}

export async function getNewsPostById(id: string): Promise<NewsPost | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as NewsPost;
}

export async function createNewsPost(data: Omit<NewsPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(db, COL), { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateNewsPost(id: string, data: Partial<NewsPost>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteNewsPost(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
