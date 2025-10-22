-- Favorites System Database Schema
-- Run this SQL script in your Supabase SQL editor

-- Create enum for favorite types
CREATE TYPE favorite_type AS ENUM ('video', 'offer', 'affiliate', 'brand', 'company');

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type favorite_type NOT NULL,
  item_id TEXT NOT NULL, -- External ID (YouTube video ID, offer ID, etc.)
  item_data JSONB NOT NULL, -- Store complete item data for faster retrieval
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure user can't favorite the same item twice
  UNIQUE(user_id, item_type, item_id)
);

-- Create indexes for better performance
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_user_type ON favorites(user_id, item_type);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_favorites_updated_at
  BEFORE UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can update their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;

-- Create RLS policies
-- Users can only see their own favorites
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own favorites
CREATE POLICY "Users can update their own favorites" ON favorites
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to get favorites count by type
CREATE OR REPLACE FUNCTION get_favorites_count_by_type(user_uuid UUID)
RETURNS TABLE(
  item_type favorite_type,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.item_type,
    COUNT(*) as count
  FROM favorites f
  WHERE f.user_id = user_uuid
  GROUP BY f.item_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if item is favorited
CREATE OR REPLACE FUNCTION is_item_favorited(
  user_uuid UUID,
  item_type_param favorite_type,
  item_id_param TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM favorites 
    WHERE user_id = user_uuid 
    AND item_type = item_type_param 
    AND item_id = item_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON favorites TO authenticated;
GRANT EXECUTE ON FUNCTION get_favorites_count_by_type(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_item_favorited(UUID, favorite_type, TEXT) TO authenticated;