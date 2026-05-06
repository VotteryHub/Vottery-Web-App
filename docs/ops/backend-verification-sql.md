# Vottery Backend Stability Verification SQL
**Run in STAGING first; then PRODUCTION.**

This file consolidates all read-only SQL verification snippets for easy copy-pasting into the Supabase SQL Editor.

## 1. Core Election & Voting Stability
```sql
-- Detect active elections with missing critical data
SELECT id, title, voting_type, start_date, end_date
FROM elections
WHERE (title IS NULL OR voting_type IS NULL OR start_date IS NULL)
  AND status = 'active';

-- Detect elections with ZERO options (prevents rendering errors)
SELECT e.id, e.title, COUNT(o.id) as option_count
FROM elections e
LEFT JOIN election_options o ON e.id = o.election_id
WHERE e.status = 'active'
GROUP BY e.id, e.title
HAVING COUNT(o.id) = 0;

-- Detect non-canonical voting_type strings (Legacy mapping check)
SELECT id, title, voting_type 
FROM elections 
WHERE voting_type NOT IN ('plurality', 'approval', 'ranked-choice', 'plus-minus');

-- Detect orphaned votes (Integrity check)
SELECT COUNT(*) 
FROM votes v
LEFT JOIN elections e ON v.election_id = e.id
WHERE e.id IS NULL;
```

## 2. Home Feed & Content Integrity
```sql
-- Verify carousel distribution
SELECT carousel_type, COUNT(*) 
FROM feed_items 
WHERE is_active = true 
GROUP BY carousel_type;

-- Detect feed items without media (prevents "white screen" carousels)
SELECT id, title, carousel_type 
FROM feed_items 
WHERE (media_url IS NULL OR media_url = '') 
  AND is_active = true;
```

## 3. User & Role Integrity
```sql
-- Detect profiles with missing display names
SELECT id, email, created_at 
FROM profiles 
WHERE display_name IS NULL OR display_name = '';

-- RLS Sanity Check: Run as 'authenticated' role
-- Expected: 1 (if viewing own) or 0 (if RLS is strict)
-- If returns >1000, RLS may be misconfigured for public visibility
SELECT count(*) FROM profiles;
```

## 4. Telemetry & Retention Audit
```sql
-- Verify telemetry signals exist for today
SELECT event_name, COUNT(*) 
FROM user_engagement_signals 
WHERE created_at >= CURRENT_DATE 
GROUP BY event_name;

-- Check maintenance logs for last retention run
SELECT * FROM maintenance_logs 
ORDER BY executed_at DESC 
LIMIT 5;
```
