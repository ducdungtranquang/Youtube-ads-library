-- Create search_cache table for caching search results
CREATE TABLE IF NOT EXISTS search_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  search_type TEXT NOT NULL CHECK (search_type IN ('mkt', 'quicksearch', 'brands', 'companies')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'error')),
  result_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_search_cache_payload_hash ON search_cache(payload_hash);
CREATE INDEX IF NOT EXISTS idx_search_cache_search_type ON search_cache(search_type);
CREATE INDEX IF NOT EXISTS idx_search_cache_status ON search_cache(status);
CREATE INDEX IF NOT EXISTS idx_search_cache_expires_at ON search_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_search_cache_created_at ON search_cache(created_at DESC);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_search_cache_lookup ON search_cache(payload_hash, search_type, expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_search_cache_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS search_cache_updated_at_trigger ON search_cache;
CREATE TRIGGER search_cache_updated_at_trigger
  BEFORE UPDATE ON search_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_search_cache_updated_at();

-- Create function for easy table creation from RPC
CREATE OR REPLACE FUNCTION create_search_cache_table()
RETURNS VOID AS $$
BEGIN
  -- This function is already handled by the above CREATE TABLE IF NOT EXISTS
  -- Just a placeholder for the RPC call from the application
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up expired entries (can be called periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_search_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM search_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get cache statistics
CREATE OR REPLACE FUNCTION get_search_cache_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_entries', (SELECT COUNT(*) FROM search_cache),
    'pending_entries', (SELECT COUNT(*) FROM search_cache WHERE status = 'pending'),
    'completed_entries', (SELECT COUNT(*) FROM search_cache WHERE status = 'completed'),
    'error_entries', (SELECT COUNT(*) FROM search_cache WHERE status = 'error'),
    'expired_entries', (SELECT COUNT(*) FROM search_cache WHERE expires_at < NOW()),
    'entries_by_type', (
      SELECT json_object_agg(search_type, count)
      FROM (
        SELECT search_type, COUNT(*) as count
        FROM search_cache
        GROUP BY search_type
      ) as type_counts
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies if needed (adjust based on your auth requirements)
-- ALTER TABLE search_cache ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations for service role" ON search_cache FOR ALL USING (true);