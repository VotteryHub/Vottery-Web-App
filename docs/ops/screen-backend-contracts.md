# Screen-Backend Data Contracts (Phase S2)

> [!IMPORTANT]
> **OPERATIONAL SAFETY**: All SQL queries listed here are READ-ONLY. 
> Always run verification queries in **STAGING** first to confirm baseline counts before executing in **PRODUCTION**.

This document defines the expected data structures and API responses for critical Vottery screens to ensure front-end stability and database integrity.

## 1. Secure Voting Interface (`/secure-voting-interface`)

### GET `/api/elections/:id`
**Description**: Fetches election details and associated options.

**Response Schema**:
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string (html allowed)",
  "votingType": "plurality | ranked-choice | approval | plus-minus",
  "startDate": "YYYY-MM-DD",
  "startTime": "HH:mm:ss",
  "endDate": "YYYY-MM-DD",
  "endTime": "HH:mm:ss",
  "isGamified": "boolean",
  "showLiveResults": "boolean",
  "permissionType": "public | private",
  "media": {
    "url": "string",
    "type": "video | image",
    "minimumWatchTime": "number (seconds)"
  },
  "electionOptions": [
    {
      "id": "uuid",
      "title": "string",
      "imageUrl": "string",
      "description": "string"
    }
  ]
}
```

### Verification SQL (Voting Stability)
```sql
-- 1. Check if required election fields are non-null
SELECT id, title, voting_type, start_date, end_date
FROM elections
WHERE (title IS NULL OR voting_type IS NULL OR start_date IS NULL)
  AND status = 'active';

-- 2. Verify options existence for active elections
SELECT e.id, e.title, COUNT(o.id) as option_count
FROM elections e
LEFT JOIN election_options o ON e.id = o.election_id
WHERE e.status = 'active'
GROUP BY e.id, e.title
HAVING COUNT(o.id) = 0;

-- 3. Detect invalid voting_type mapping
SELECT id, title, voting_type 
FROM elections 
WHERE voting_type NOT IN ('plurality', 'approval', 'ranked-choice', 'plus-minus');
```

---

## 2. Home Feed Dashboard (`/home-feed-dashboard`)

### GET `/api/feed/carousels`
**Description**: Fetches all 4 premium carousels for the feed.

**Response Schema**:
```json
[
  {
    "type": "stories | horizontal-snap | vertical-stack | grid",
    "title": "string",
    "items": "array<FeedItem>"
  }
]
```

### Verification SQL (Feed Integrity)
```sql
-- 1. Check for empty carousels
SELECT carousel_type, COUNT(*) 
FROM feed_items 
WHERE is_active = true 
GROUP BY carousel_type;

-- 2. Detect missing media in feed items
SELECT id, title, carousel_type 
FROM feed_items 
WHERE (media_url IS NULL OR media_url = '') 
  AND is_active = true;
```

---

## 3. User Profile Hub (`/user-profile-hub`)

### GET `/api/profiles/:id`
**Description**: Fetches comprehensive user profile including stats and activity.

**Response Schema**:
```json
{
  "id": "uuid",
  "displayName": "string",
  "avatarUrl": "string",
  "stats": {
    "electionsParticipated": "number",
    "vpBalance": "number",
    "rank": "string"
  },
  "activity": "array<ActivityItem>"
}
```

### Verification SQL (Profile Integrity)
```sql
-- 1. Detect profiles with null display names
SELECT id, email, created_at 
FROM profiles 
WHERE display_name IS NULL OR display_name = '';

-- 2. Verify RLS: Count profiles visible to current role (run as authenticated)
-- If this returns 0 or >1 (excluding own), check RLS policies
SELECT count(*) FROM profiles;
```
