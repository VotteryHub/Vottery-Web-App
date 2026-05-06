# No-Mocks Implementation Plan

## Mock Data Inventory

| Component | File Path | Mock Data Type | Replacement Service / Query |
| :--- | :--- | :--- | :--- |
| **Home Feed** | `src/pages/home-feed-dashboard/index.jsx` | `INITIAL_MOCK_CONTENTS` | `postsService.getAll()` with blended ad injection. |
| **Jolts Carousel** | `src/pages/home-feed-dashboard/index.jsx` | `setJolts` | Query `posts` table for `type='jolt'` or dedicated `jolts` table. |
| **Live Elections** | `src/pages/home-feed-dashboard/index.jsx` | `loadLiveElections` fallback | `electionsService.getAll({ status: 'active', is_live: true })`. |
| **Suggested Connections** | `src/pages/home-feed-dashboard/index.jsx` | `loadSuggestedConnections` fallback | `userService.getRecommendations()` via Shaped AI integration. |
| **Recommended Groups** | `src/pages/home-feed-dashboard/index.jsx` | `loadRecommendedGroups` fallback | `groupsService.getRecommended()` based on user interests. |
| **Winners Ribbon** | `src/pages/home-feed-dashboard/index.jsx` | `loadRecentWinners` | `gamificationService.getRecentWinners()` from `winners` table. |
| **Top Earners** | `src/pages/home-feed-dashboard/index.jsx` | `loadTopEarners` | `analyticsService.getTopEarners()` from `creator_payouts` data. |

## Data Contracts (Zod Schemas)

### Election Summary
```typescript
const ElectionSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  cover_image: z.string().url().nullable(),
  voter_count: z.number().int().nonnegative(),
  participation_rate: z.number().min(0).max(100),
  prize_pool: z.number().nonnegative().optional(),
  is_live: z.boolean().default(false),
  category: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled']),
});
```

### Jolt Content
```typescript
const JoltSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  thumbnail_url: z.string().url(),
  creator: z.object({
    username: z.string(),
    avatar_url: z.string().url().nullable(),
    is_verified: z.boolean(),
  }),
  metrics: z.object({
    views: z.number().int(),
    likes: z.number().int(),
  }),
});
```

## Implementation Phases

1. **Phase 1**: Audit and clean up `src/services` to ensure all necessary real-data methods exist.
2. **Phase 2**: Replace `loadFeedData` and carousel loaders in `HomeFeedDashboard` with real service calls.
3. **Phase 3**: Implement the "1-3-1" injection logic in the feed assembler.
4. **Phase 4**: Add Zod validation to service response layers.
