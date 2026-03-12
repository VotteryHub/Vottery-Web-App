# Vottery Ads System – Internal Design Document (v1.0)

## 1. Core objectives

- **Unified “Vottery Ads Studio”**: Single system for both **normal (non-gamified)** and **participatory/gamified** ads. No separate “Facebook-like” vs “Participatory” studios.
- **Engagement-first delivery**: Prioritize **Ad Relevance + User Engagement** over pure bid; discovery (70%) over retargeting (30%). Algorithm-driven, personalized ad density and blending.
- **Full parity Web + Mobile**: Same schema, same constants, same API semantics on React and Flutter.
- **Targeting**: 8 purchasing-power zones **and** country + sub-national (states/provinces/territories/regions/districts/cantons/oblasts/krais/emirates).
- **Analytics**: Cost-per-participant, conversion rates, reach by zones and by geography, ROI comparison across campaigns.
- **Real-time auction**: Vickrey–Clarke–Groves (VCG) style; Total Value Score = f(Bid, Estimated Action Rate, Quality Score). AdSense fallback for unfilled slots unchanged.

---

## 2. System architecture

### 2.1 Hierarchical account structure (TikTok/Facebook-like)

| Level | Purpose |
|-------|--------|
| **Campaign** | Business objective: Reach, Traffic, App Installs, Conversions. Top-level budget optional. |
| **Ad Group** | Targeting (zones, countries, regions), placement (automatic or manual slots), budget & schedule (daily/lifetime, dayparting). |
| **Ad** | Creative: normal (display/video) or participatory (election + optional gamification) or Spark (boost existing post). Bid, pricing model (CPM, CPC, oCPM, CPV). |

### 2.2 Ad types (single studio)

- **Normal (no gamification)**: Banner, video, in-feed static/video. No voting/election.
- **Participatory / gamified**: Sponsored election; optional prize pool, XP, mini-games. Tied to `elections` table.
- **Spark-style**: Boost existing organic post (Moments/Jolts). Dual-ID tracking: engagement on original post; attribution for paid views.

### 2.3 Placement slots (delivery positions)

**TikTok-style (immersive, full-screen, discovery)**  
Feed/Post, Moments, Jolts, TopView. Algorithm-driven; personalized ratio per user (no fixed 1:7). Heavier ad load where AI predicts tolerance.

**Facebook-style (auction, “Sponsored” label)**  
Creators Services/Marketplace, Recommended Groups, Trending Topics, Recommended Elections, Elections voting/verification/audit screens, Top Earners, Accuracy Champions, Right Column (web only).

**Premium**  
TopView (first video on open), Brand Takeovers, Platform Gamification board/slot. Premium CPM or flat rate.

### 2.4 Ad serving pipeline

1. **Candidate retrieval**: Filter ads by user (zone, country/region, interests), placement, status, budget. ~100 candidates.
2. **Quality / relevance**: Apply Quality Score (hook rate, completion, negative feedback); optional ML pCTR.
3. **Auction**: VCG second-price; winner = max Total Value Score; charge second-highest + $0.01.
4. **Fill**: If no internal winner → AdSense fallback (existing slot manager behavior).
5. **Event tracking**: Impression, VIEW_2S (hook), VIEW_6S, COMPLETE, CLICK, HIDE, REPORT → `ad_events`; aggregate into `ad_quality_metrics`.

### 2.5 Dynamic ad density (no fixed 1:7)

- Per-user ratio is **algorithm-driven** (e.g. 1:2, 1:3, 1:7) based on learned behavior.
- AI (Gemini + Grok super-agent concept) balances gamified vs non-gamified and slot mix; finds “most efficient delivery path.”
- Stored as user-level or segment-level config; no single global ratio.

### 2.6 Moderation & safety

- AI moderation on **organic** content before blending.
- **Negative feedback**: HIDE / REPORT in `ad_events`; SQL trigger “emergency brake” (e.g. >5 REPORTs → ad status PENDING_REVIEW).
- PyFlink (or equivalent) stream job: real-time Quality Score (hook/hold/negative) for auction use.

---

## 3. Data model (summary)

- **vottery_ad_campaigns**: Campaign-level (objective, status).
- **vottery_ad_groups**: Targeting (zones, countries, regions), placement, budget, schedule.
- **vottery_ads**: Creative, ad_type (display/video/participatory/spark), bid, pricing_model; election_id for participatory; source_post_id for Spark.
- **vottery_ad_targeting_geo**: Country + region codes per ad group.
- **ad_events**: Fact table (event_type: IMPRESSION, VIEW_2S, VIEW_6S, COMPLETE, CLICK, HIDE, REPORT).
- **ad_quality_metrics**: Aggregated hook_rate, hold_rate, neg_score, quality_score (refreshed by stream job).
- **spark_ad_references**: ad_id ↔ source_post_id (Moments/Jolts) for dual-ID and attribution.
- **vottery_placement_slots**: Slot definitions (TikTok vs Facebook style, platform).
- **vottery_ads_admin_config**: Admin-configurable minimums (e.g. daily $1–$5, campaign $100).

---

## 4. Auction (VCG)

- **Total Value Score** = Bid × pCTR × QualityScore (or similar; weights configurable).
- **Pricing**: Second-price (second-highest TV + $0.01).
- **Account-level quality**: Consistently low-quality advertisers get higher effective cost (platform-wide).

---

## 5. Pricing & budget

- **Minimums**: Low barrier; e.g. $1–$5/day per ad group; campaign minimum configurable from admin (e.g. $100). Stored in `vottery_ads_admin_config`.
- **Benchmarks**: CPM ~$3.20–$10; CPC ~$0.10–$1; premium slots ~$40k–$160k/day. Zone-based variation via 8 purchasing-power zones; super-agent keeps Vottery ~10% below competitor benchmarks while profitable.

---

## 6. Attribution & measurement

- **Vottery Pixel / Events API**: 7-day click, 1-day view default windows; Engaged View-Through (e.g. 6+ seconds); assisted conversions.
- **Spark**: Organic vs paid views on same post_id; unified like/share counters; paid view attribution for creator reporting.

---

## 7. Technical requirements

- **Inter-service**: gRPC for auction ↔ prediction where applicable.
- **Caching**: Redis for user profile and ad candidate list.
- **Consistency**: Eventual for engagement counters (likes/shares).
- **Fraud**: Anomaly detection; policy checks before ad enters auction.

---

## 8. Web vs mobile parity

- Same tables, same enums (ad_type, placement_slot_key, event_type, objective).
- Shared constants file (or generated from single source) for placements, objectives, pricing models.
- Vottery Ads Studio: one flow on web, one on mobile; both create Campaign → Ad Group → Ad (normal or gamified or Spark).
