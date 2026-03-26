import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { HomeContent, AboutContent } from '@/types';

// ─── Home Content ─────────────────────────────────────────────────────────────
export async function getHomeContent(): Promise<HomeContent | null> {
  const snap = await getDoc(doc(db, 'siteContent', 'home'));
  if (!snap.exists()) return null;
  return snap.data() as HomeContent;
}

export async function setHomeContent(data: HomeContent): Promise<void> {
  await setDoc(doc(db, 'siteContent', 'home'), data);
}

// ─── About Content ────────────────────────────────────────────────────────────
export async function getAboutContent(): Promise<AboutContent | null> {
  const snap = await getDoc(doc(db, 'siteContent', 'about'));
  if (!snap.exists()) return null;
  return snap.data() as AboutContent;
}

export async function setAboutContent(data: AboutContent): Promise<void> {
  await setDoc(doc(db, 'siteContent', 'about'), data);
}
