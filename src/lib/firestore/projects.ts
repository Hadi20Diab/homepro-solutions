import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Project, ProjectSubmission } from '@/types';

const COL = 'projects';
const SUB_COL = 'projectSubmissions';

export async function getProjects(publishedOnly = false): Promise<Project[]> {
  const ref = collection(db, COL);
  const q = publishedOnly
    ? query(ref, where('isActive', '==', true), orderBy('order', 'asc'))
    : query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(collection(db, COL), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Project;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Project;
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = new Date().toISOString();
  const ref = await addDoc(collection(db, COL), { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// ─── Project Submissions ──────────────────────────────────────────────────────
export async function getProjectSubmissions(): Promise<ProjectSubmission[]> {
  const snap = await getDocs(query(collection(db, SUB_COL), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectSubmission));
}

export async function createProjectSubmission(data: Omit<ProjectSubmission, 'id' | 'createdAt' | 'read'>): Promise<void> {
  await addDoc(collection(db, SUB_COL), {
    ...data,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export async function markProjectSubmissionRead(id: string): Promise<void> {
  await updateDoc(doc(db, SUB_COL, id), { read: true });
}

export async function deleteProjectSubmission(id: string): Promise<void> {
  await deleteDoc(doc(db, SUB_COL, id));
}
