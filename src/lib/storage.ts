/**
 * Supabase Storage helpers
 * ─────────────────────────
 * All images are stored in a single Supabase bucket (NEXT_PUBLIC_SUPABASE_BUCKET).
 * Files are organised into sub-folders by content type, e.g.:
 *   projects/before-1716000000000-photo.jpg
 *   blog/cover-1716000000000-hero.png
 *
 * Setup:
 *   1. Create a Supabase project at https://supabase.com
 *   2. Go to Storage → New bucket → name it  homepro-images  (or whatever you set
 *      in NEXT_PUBLIC_SUPABASE_BUCKET) → enable "Public bucket"
 *   3. Add the env vars listed in .env.local.example
 */

import { supabase } from './supabase';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? 'homepro-images';

/**
 * Upload a single file to Supabase Storage.
 * @returns The public URL of the uploaded file.
 */
export async function uploadImage(
  file: File,
  folder: string = 'general',
): Promise<string> {
  // Sanitise the original filename: lowercase, replace spaces/special chars
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('Could not get public URL for uploaded image');

  return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage by its full public URL.
 * Safe to call with an external URL (e.g., Unsplash) — it will be a no-op.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  if (!publicUrl) return;

  const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  if (!publicUrl.startsWith(storageBase)) return; // not our file, skip

  const path = publicUrl.replace(storageBase, '');
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn('Could not delete image:', error.message);
}
