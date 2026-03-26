import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // Only warn — the app can still run without Supabase if image upload isn't used
  if (typeof window !== 'undefined') {
    console.warn(
      '[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
      'Image uploads will not work until these are set in .env.local'
    );
  }
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
