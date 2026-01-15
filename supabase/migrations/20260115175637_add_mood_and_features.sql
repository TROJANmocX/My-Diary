/*
  # Add mood, pinned entries, and settings

  1. Modified Tables
    - `diary_entries`
      - `mood` (text) - The mood associated with entry (melancholy, hopeful, unhinged, etc)
      - `is_pinned` (boolean) - Whether entry is in Memory Drawer
      - `signature` (text) - Custom signature for entry
  
  2. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_name` (text) - User's name for signatures
      - `theme` (text) - Current theme (light, candle)
      - `sounds_enabled` (boolean) - Whether ambient sounds are enabled
      - `sound_type` (text) - Type of ambient sound (typewriter, rain, fireplace)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  3. Security
    - RLS enabled on user_settings for single-user diary (public read/write)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'diary_entries' AND column_name = 'mood'
  ) THEN
    ALTER TABLE diary_entries ADD COLUMN mood text DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'diary_entries' AND column_name = 'is_pinned'
  ) THEN
    ALTER TABLE diary_entries ADD COLUMN is_pinned boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'diary_entries' AND column_name = 'signature'
  ) THEN
    ALTER TABLE diary_entries ADD COLUMN signature text DEFAULT NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text DEFAULT 'Diarist',
  theme text DEFAULT 'vintage',
  sounds_enabled boolean DEFAULT false,
  sound_type text DEFAULT 'typewriter',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON user_settings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON user_settings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON user_settings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);