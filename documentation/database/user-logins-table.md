Below is a robust User-Logins table schema for Supabase (Postgres)

```sql
-- Create enum type for login status
CREATE TYPE public.login_status AS ENUM ('success', 'failed', 'blocked', 'suspicious');

-- Drop existing table if you want to recreate (CAUTION: This will delete data)
-- DROP TABLE IF EXISTS public.user_logins CASCADE;

-- Create improved user_logins table with UUID primary key
CREATE TABLE public.user_logins (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    user_id UUID NULL,
                                    user_name VARCHAR(255) NOT NULL,
                                    email VARCHAR(255) NOT NULL,
                                    ip_address INET NOT NULL,
                                    device_info JSONB NOT NULL DEFAULT '{}',
                                    login_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                    status public.login_status NOT NULL DEFAULT 'success',
                                    failure_reason TEXT NULL,
                                    session_id UUID NULL,
                                    location JSONB NULL,
                                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                                    CONSTRAINT user_logins_user_id_fkey
                                        FOREIGN KEY (user_id)
                                            REFERENCES auth.users (id)
                                            ON DELETE CASCADE
);

-- Add table comment
COMMENT ON TABLE public.user_logins IS 'Tracks all user login attempts (successful and failed)';
COMMENT ON COLUMN public.user_logins.device_info IS 'JSON containing browser, OS, device type, etc.';
COMMENT ON COLUMN public.user_logins.location IS 'JSON containing country, city, region from IP lookup';

-- Create indexes for better query performance
CREATE INDEX idx_user_logins_user_id ON public.user_logins USING BTREE (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_user_logins_email ON public.user_logins USING BTREE (email);
CREATE INDEX idx_user_logins_login_time ON public.user_logins USING BTREE (login_time DESC);
CREATE INDEX idx_user_logins_status ON public.user_logins USING BTREE (status);
CREATE INDEX idx_user_logins_ip_address ON public.user_logins USING BTREE (ip_address);
CREATE INDEX idx_user_logins_session_id ON public.user_logins USING BTREE (session_id) WHERE session_id IS NOT NULL;

-- Composite index for common query patterns
CREATE INDEX idx_user_logins_user_time ON public.user_logins USING BTREE (user_id, login_time DESC);
CREATE INDEX idx_user_logins_email_time ON public.user_logins USING BTREE (email, login_time DESC);

-- GIN index for JSONB columns
CREATE INDEX idx_user_logins_device_info ON public.user_logins USING GIN (device_info);
CREATE INDEX idx_user_logins_location ON public.user_logins USING GIN (location);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_logins
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Users can view their own login history
CREATE POLICY "Users can view their own login history"
  ON public.user_logins
  FOR SELECT
                 TO authenticated
                 USING (auth.uid() = user_id);

-- Policy: Service role has full access (for backend operations)
CREATE POLICY "Service role has full access"
  ON public.user_logins
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can insert their own login records
CREATE POLICY "Users can insert their own login records"
  ON public.user_logins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Optional: Create a view for recent login activity
CREATE OR REPLACE VIEW public.recent_login_activity AS
SELECT
    ul.id,
    ul.user_id,
    ul.email,
    ul.ip_address,
    ul.device_info->>'browser' AS browser,
    ul.device_info->>'os' AS os,
    ul.location->>'country' AS country,
    ul.location->>'city' AS city,
    ul.login_time,
    ul.status,
    ul.failure_reason
FROM public.user_logins ul
ORDER BY ul.login_time DESC
    LIMIT 100;

-- Grant permissions on the view
GRANT SELECT ON public.recent_login_activity TO authenticated;

-- Optional: Create function to clean up old login records (data retention)
CREATE OR REPLACE FUNCTION public.cleanup_old_login_records(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
deleted_count INTEGER;
BEGIN
DELETE FROM public.user_logins
WHERE login_time < NOW() - (retention_days || ' days')::INTERVAL;

GET DIAGNOSTICS deleted_count = ROW_COUNT;
RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a function to get login statistics
CREATE OR REPLACE FUNCTION public.get_login_stats(p_user_id UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  total_logins BIGINT,
  successful_logins BIGINT,
  failed_logins BIGINT,
  unique_ips BIGINT,
  last_login TIMESTAMPTZ
) AS $$
BEGIN
RETURN QUERY
SELECT
    COUNT(*)::BIGINT AS total_logins,
    COUNT(*) FILTER (WHERE status = 'success')::BIGINT AS successful_logins,
    COUNT(*) FILTER (WHERE status IN ('failed', 'blocked'))::BIGINT AS failed_logins,
    COUNT(DISTINCT ip_address)::BIGINT AS unique_ips,
    MAX(login_time) AS last_login
FROM public.user_logins
WHERE user_id = p_user_id
  AND login_time >= NOW() - (days_back || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Why these columns

- id (UUID): Primary key generated with `gen_random_uuid()` for safe client exposure and deduping across ingestion paths.
- user_id: Optional FK to `auth.users(id)` for attempts associated with a Supabase user. Nullable to record pre-auth or unknown-user attempts.
- user_name: Display/user-provided identifier at login time (may differ from canonical profile). Capturing the raw input aids forensics.
- email: Email used during the attempt. Indexed for quick lookups and alerting; denormalized for easy queries without joins.
- ip_address (INET): Native IP type supports fast comparisons, indexing, and CIDR operations (e.g., `<<` for subnet checks).
- device_info (JSONB): Flexible capture of user agent details: browser, OS, device type, bot flags. GIN-indexed for key/value queries.
- login_time (timestamptz): Event time, defaults to `now()`; indexed for time-range analytics and recent-activity endpoints.
- status (enum): Constrained outcome: `success|failed|blocked|suspicious`. Enum prevents typos and standardizes dashboards.
- failure_reason: Free-text explanation or error code (e.g., wrong_password, rate_limited) to aid support and tuning.
- session_id (UUID): If you create a session upon success, linking the session simplifies correlation and cleanup.
- location (JSONB): Optional geolocation (country, city, region) derived from IP. GIN-indexed for ad-hoc filtering.
- created_at / updated_at: Auditing. `updated_at` maintained by trigger to reflect moderation changes or enrichment updates.

Indexes
- By user, email, time, status, ip, session: Mirrors common queries for feeds, risk detection, and account pages.
- Composite `(user_id, login_time desc)` and `(email, login_time desc)`: Efficient pagination of recent activity per principal.
- GIN on JSONB: Enables queries like `device_info @> '{"bot": true}'` or `location->>'country' = 'US'` with good performance.

Triggers
- `handle_updated_at`: Keeps `updated_at` in sync on updates.

RLS policies
- Authenticated users: Can select and insert only their own rows (`auth.uid() = user_id`).
- Service role: Full access for backend pipelines, batch enrichment, retention jobs.

Notes and options you can tweak

- Data retention: Implement periodic cleanup via `cleanup_old_login_records(…)` (default 90 days). Adjust to your compliance needs.
- PII minimization: Consider hashing or truncating emails for failed attempts, and avoid storing raw user agents if not needed.
- IP anonymization: For GDPR, store only a truncated IP (e.g., zero the last octet for IPv4) for non-success events.
- Bot/risk flags: Extend `device_info` with keys like `bot`, `vpn`, `proxy`, `risk_score`; add partial indexes (e.g., on suspicious only).
- Deduping bursts: Add a unique partial index over `(email, ip_address, date_trunc('minute', login_time)) where status = 'failed'` if you want to collapse brute-force noise.
- Webhooks/alerts: Create a trigger on `status = 'suspicious'` to notify via webhook or insert into a `security_events` table.
- Admin queries: Create views scoped for support (e.g., last N attempts per user), and grant `select` to a custom role instead of broadening RLS.
- Partitioning: If the table grows large, consider time-based partitioning by month to keep indexes small and retention cheap.