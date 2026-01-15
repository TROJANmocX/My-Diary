import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DiaryEntry {
  id: string;
  content: string;
  mood?: string;
  is_pinned: boolean;
  signature?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_name: string;
  theme: string;
  sounds_enabled: boolean;
  sound_type: string;
  created_at: string;
  updated_at: string;
}
