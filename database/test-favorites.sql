-- Test favorites system
-- Run this after setting up the schema to verify everything works

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'favorites';

-- Check if enum type exists
SELECT typname 
FROM pg_type 
WHERE typname = 'favorite_type';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'favorites';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'favorites';

-- Test inserting a favorite (replace with your user UUID)
-- INSERT INTO favorites (user_id, item_type, item_id, item_data) 
-- VALUES (
--   auth.uid(), 
--   'video', 
--   'test-video-123', 
--   '{"title": "Test Video", "channel": "Test Channel", "thumbnail": "test.jpg"}'
-- );

-- Test functions
-- SELECT get_favorites_count_by_type(auth.uid());
-- SELECT is_item_favorited(auth.uid(), 'video', 'test-video-123');