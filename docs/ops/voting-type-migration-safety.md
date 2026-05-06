# Voting Type Migration Safety Report

## 1. Migration Review: `20260428133200_standardize_voting_types.sql`

### Changes Summary
- **Schema Modification**: Adds `voting_type_canonical` (TEXT) to the `elections` table.
- **Normalization Logic**: Implements `normalize_voting_type_string(TEXT)` PL/pgSQL function to map legacy/varied strings to canonical values (`plurality`, `approval`, `ranked-choice`, `plus-minus`).
- **Data Migration**: Performs a one-time backfill of `voting_type_canonical` for all existing elections.
- **Automation**: Adds a `BEFORE INSERT OR UPDATE` trigger (`trigger_maintain_voting_type_canonical`) to ensure the canonical column is always in sync with the legacy `voting_type` column.

### Backward Compatibility
> [!IMPORTANT]
> This migration is **100% backward compatible**. 
> - The original `voting_type` column remains intact and is never modified by the trigger (it only reads from it).
> - App code that has not yet been updated to read `voting_type_canonical` will continue to function without interruption.

### Rollback Strategy
To revert these changes, run the following compensating migration:

```sql
-- ROLLBACK SCRIPT
DROP TRIGGER IF EXISTS trigger_maintain_voting_type_canonical ON elections;
DROP FUNCTION IF EXISTS maintain_voting_type_canonical();
DROP FUNCTION IF EXISTS normalize_voting_type_string(TEXT);
ALTER TABLE elections DROP COLUMN IF EXISTS voting_type_canonical;
```

---

## 2. Verification Query Set

Run these queries in the Supabase SQL Editor to verify the migration success.

### Count of rows with non-canonical values
```sql
SELECT voting_type, COUNT(*) 
FROM elections 
WHERE voting_type NOT IN ('plurality', 'approval', 'ranked-choice', 'plus-minus')
GROUP BY voting_type;
```

### Count of rows successfully mapped to canonical values
```sql
SELECT voting_type_canonical, COUNT(*) 
FROM elections 
GROUP BY voting_type_canonical;
```

### Sample of problematic/legacy mappings
```sql
SELECT voting_type, voting_type_canonical 
FROM elections 
WHERE voting_type != voting_type_canonical 
LIMIT 10;
```

---

## 3. Application Side Normalization

The application utility `src/lib/votingTypeUtils.js` has been verified to handle legacy strings indefinitely. It uses the same mapping logic as the database function to ensure consistency even if the database backfill is incomplete or if new legacy strings are inserted via external API ports.

```javascript
// Verified: Accepts legacy strings and defaults to 'plurality' safely.
export const normalizeVotingType = (type) => { ... }
```
