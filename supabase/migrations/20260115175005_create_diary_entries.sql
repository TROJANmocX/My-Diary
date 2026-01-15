/*
  # Create diary entries table

  1. New Tables
    - `diary_entries`
      - `id` (uuid, primary key)
      - `content` (text) - The diary entry text
      - `created_at` (timestamptz) - When the entry was created
      - `updated_at` (timestamptz) - When the entry was last modified
  
  2. Security
    - Enable RLS on `diary_entries` table
    - Add policy for public access (single-user diary)
    
  Note: This is a simple single-user diary without authentication.
  All entries are publicly accessible for demo purposes.
*/

CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON diary_entries
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON diary_entries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON diary_entries
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON diary_entries
  FOR DELETE
  TO anon
  USING (true);