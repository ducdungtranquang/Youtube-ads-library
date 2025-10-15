-- Create search_cache table for caching VidTao API responses
-- This table stores cached search results to reduce API calls and improve performance

CREATE TABLE search_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'error')),
    data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes for efficient querying
CREATE UNIQUE INDEX idx_search_cache_unique ON search_cache (cache_key, payload_hash);
CREATE INDEX idx_search_cache_status ON search_cache (status);
CREATE INDEX idx_search_cache_endpoint ON search_cache (endpoint);
CREATE INDEX idx_search_cache_expires ON search_cache (expires_at);
CREATE INDEX idx_search_cache_created ON search_cache (created_at DESC);

-- Add Row Level Security (RLS)
ALTER TABLE search_cache ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role access (for API routes)
CREATE POLICY "Service role can manage search cache" 
ON search_cache FOR ALL 
TO service_role 
USING (true);

-- Optional: Create policy for authenticated users to read their cached searches
-- (if you want to expose cache data to frontend)
CREATE POLICY "Users can read search cache" 
ON search_cache FOR SELECT 
TO authenticated 
USING (true);

-- Create function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM search_cache 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get cache statistics
CREATE OR REPLACE FUNCTION get_cache_stats()
RETURNS TABLE (
    endpoint TEXT,
    total_entries BIGINT,
    pending_entries BIGINT,
    completed_entries BIGINT,
    error_entries BIGINT,
    hit_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sc.endpoint,
        COUNT(*) as total_entries,
        COUNT(*) FILTER (WHERE sc.status = 'pending') as pending_entries,
        COUNT(*) FILTER (WHERE sc.status = 'completed') as completed_entries,
        COUNT(*) FILTER (WHERE sc.status = 'error') as error_entries,
        ROUND(
            (COUNT(*) FILTER (WHERE sc.status = 'completed')::NUMERIC / 
             NULLIF(COUNT(*), 0) * 100), 2
        ) as hit_rate
    FROM search_cache sc
    WHERE sc.expires_at > NOW()
    GROUP BY sc.endpoint;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_cache() TO service_role;
GRANT EXECUTE ON FUNCTION get_cache_stats() TO service_role;

-- Create a scheduled job to clean up expired entries (if using pg_cron extension)
-- Uncomment the following line if you have pg_cron enabled:
-- SELECT cron.schedule('cleanup-search-cache', '0 2 * * *', 'SELECT cleanup_expired_cache();');

-- Insert some sample data for testing (optional)
-- You can remove this section in production
/*
INSERT INTO search_cache (cache_key, payload_hash, endpoint, status, data) VALUES 
('quicksearch', 'sample_hash_1', 'quicksearch', 'completed', '{"ads": [], "total": 0}'),
('mkt_ads', 'sample_hash_2', 'mkt', 'pending', null),
('mkt_brands', 'sample_hash_3', 'mkt', 'completed', '{"brands": [], "total": 0}');
*/

-- View cache statistics
-- SELECT * FROM get_cache_stats();