# Vottery V1 Ads Specification

## 1. Approved Placements

Ads MUST only render in the following approved placements. Any other injection is strictly prohibited.

| Placement ID | Description | Style |
| :--- | :--- | :--- |
| `FEED_VERTICAL` | Vertical feed items (TikTok-style) | Full-screen vertical |
| `JOLTS_INTERSTITIAL` | Between Jolt transitions | Modal overlay |
| `JOLTS_OVERLAY` | Small overlay on Jolt bottom | Semi-transparent bar |
| `JOLTS_POST_LOOP` | After Jolt loop completion | End-card |
| `SEARCH_SPONSORED` | Top of search results | Highlighted row |
| `MARKETPLACE_LISTING` | In Creator Marketplace grid | Native card |
| `INSTREAM_PRE` | Before video/moment start | Pre-roll |
| `INSTREAM_MID` | Middle of video content | Mid-roll |
| `INSTREAM_POST` | After video content | Post-roll |
| `RIGHT_COLUMN_PINNED` | Desktop sidebar (pinned) | Static banner |

## 2. Routing Logic (Waterfall)

Primary routing is determined by the **Ads Slot Manager**.

### Step 1: Internal Participatory Ads
- **Priority**: 1 (Highest)
- **Ratio**: 1 ad per 3-4 organic items.
- **Filling**: If internal campaign budget exists and matches targeting.

### Step 2: External Web Networks (The Split)
If Internal fails to fill, traffic is split according to these hardcoded percentages:
- **Ezoic**: 27%
- **PropellerAds**: 27%
- **HilltopAds**: 28%
- **AdSense**: 18%

### Step 3: Global Fallback
- If a network is chosen but has no valid API keys or is disabled, the system MUST fallback to **Google AdSense** (if keys exist).
- If AdSense keys are also missing, the system MUST fallback to **Internal House Ads / Placeholders**.

## 3. Keyless Fallback Mode
- System must never crash or show "empty/broken" slots due to missing keys.
- House ads should display Vottery-specific content (e.g., "Join Vottery Premium", "Create an Election").
- Admin UI must show a "Key Missing" warning for any configured network lacking production credentials.

## 4. Admin Controls
- **Global Toggle**: Instant ON/OFF for all ads.
- **Per-Network Toggles**: Enable/Disable specific providers.
- **Placement Enforcement**: Audit logs for any blocked injection attempts.
