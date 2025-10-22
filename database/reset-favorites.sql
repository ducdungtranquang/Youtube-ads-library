-- Reset and recreate favorites system
-- Run this if you need to start fresh

-- Drop existing objects
DROP TABLE IF EXISTS favorites CASCADE;
DROP TYPE IF EXISTS favorite_type CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_favorites_count_by_type(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_item_favorited(UUID, favorite_type, TEXT) CASCADE;

-- Now run the main schema file
-- Copy and paste the content from favorites-schema.sql after running this