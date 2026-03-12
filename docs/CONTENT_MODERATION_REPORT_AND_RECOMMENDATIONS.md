# Content Moderation: Comprehensive Report & Industry-Standard Recommendations

**Project:** Vottery (Web + Mobile)  
**Scope:** AI moderation, human review, appeals, analytics, and policy enforcement.

---

## 1. Executive Summary

Vottery has a **multi-layer content moderation foundation**: AI analysis (Claude in Edge, Claude/Gemini in Mobile), human review (Content Moderation Control Center on Web), appeals (content_appeals), and creator-level comment moderation. Gaps include: **no automatic trigger** when content is created, **two disconnected data models** (content_flags vs content_moderation_results), **schema mismatch** for elections, **missing tables** for Mobile’s moderation_log/config, and limited **user-facing reporting/appeals** and **transparency**. This report maps what exists, what’s missing, and what to implement to reach industry-standard moderation.

---

## 2. Current Implementation Overview

### 2.1 Backend & AI

| Component | Location | What it does |
|----------|----------|----------------|
| **content-moderation-trigger** | `supabase/functions/content-moderation-trigger/index.ts` | Edge function: accepts `{ type, table, record }` for `posts`, `comments`, or `elections`. Calls **Anthropic Claude** (claude-3-haiku) for policy analysis; returns confidence, categories (hate_speech, spam, violence, misinformation, safe), reasoning, auto_remove. Writes to **content_moderation_results**; if confidence ≥ 0.85 or auto_remove, updates source table (elections → `status: 'rejected'`, posts/comments → `status: 'removed'`). |
| **content_moderation_results** | Migration `20260227120000` | Stores AI result per content: content_id, content_type (**post** \| **comment** only in CHECK), confidence_score, categories, primary_category, reasoning, auto_removed, moderated_at. UNIQUE(content_id, content_type). |
| **content_flags** | Migration `20260302100000` | User/AI flags for review: content_type (post \| comment \| election), content_id, violation_type (misinformation, spam, policy_violation, hate_speech, harassment, election_integrity, other), severity, confidence_score, detection_method (ai \| manual \| user_report), status (pending_review, under_review, auto_removed, approved, content_removed, user_warned, escalated). |
| **moderation_actions** | Same migration | Audit of moderator decisions: flag_id, moderator_id, action (content_removed, user_warned, account_restricted, approved, escalated, dismissed), reason. |
| **content_appeals** | Same migration | Appeals against flags: flag_id, content_id, appellant_id, reason, status (pending, upheld, overturned, dismissed), outcome, reviewed_by, reviewed_at. |

**Invocation of AI moderation:** The Edge function is **only** invoked **manually** from the Web via `aiContentModerationService.moderateContent()` (e.g. “moderate this post/comment”). There is **no database trigger or webhook** that runs moderation automatically on insert to `posts`, `comments`, or `elections`.

### 2.2 Web (React)

| Component | Location | What it does |
|----------|----------|----------------|
| **Content Moderation Control Center** | `src/pages/content-moderation-control-center/` | Admin UI: Dashboard (ModerationOverview), Flagged Content (FlaggedContentPanel), Moderator Queue, Violations (ViolationAnalytics), Actions (ModerationActionsPanel), Appeals (ContentAppealsPanel). Data from **moderationService** (content_flags, moderation_actions, content_appeals). |
| **moderationService** | `src/services/moderationService.js` | getContentAnalytics (content_flags counts), getFlaggedContent, getViolationsByCategory, getModerationActions, getModelPerformance (hardcoded metrics), performModerationAction (writes to moderation_actions + updates content_flags), getAppeals, resolveAppeal. |
| **aiContentModerationService** | `src/services/aiContentModerationService.js` | filterByModeration (filters feed/carousel items using **content_moderation_results**), getModerationStatus, moderateContent (invokes content-moderation-trigger). |
| **ContentModerationBadge** | `src/pages/enhanced-home-feed-dashboard/components/ContentModerationBadge.jsx` | Displays Safe / Review / Flagged by score/status. |
| **Claude AI Dispute Moderation Center** | `src/pages/claude-ai-dispute-moderation-center/` | Separate route for dispute resolution (distinct from main moderation center). |

**Data split:**  
- **Control Center** and **moderationService** use **content_flags** and **moderation_actions** (and content_appeals linked to flags).  
- **Feed filtering** and **AI results** use **content_moderation_results**.  
- There is **no automatic flow** that creates **content_flags** from **content_moderation_results** or from the Edge function, so AI-flagged items do not automatically appear in the moderator queue unless a separate “flag” path exists.

### 2.3 Mobile (Flutter)

| Component | Location | What it does |
|----------|----------|----------------|
| **ContentModerationService** | `lib/services/content_moderation_service.dart` | Calls **Claude** (ClaudeService) for text (+ optional media URLs). Parses JSON (violations with category, severity, confidence, action). Logs to **moderation_log**; reads **moderation_config** for per-category thresholds and auto-removal; on auto-remove updates moderation_log and **user_moderation_history**. submitAppeal writes to **content_appeals** (content_id, appellant_user_id, appeal_reason, evidence_urls, status). getModerationStats uses moderation_log, moderation_reviews, content_appeals. |
| **Election comment moderation** | `lib/services/election_comment_service.dart` | moderateComment (creator only): sets is_approved, approved_by, approved_at on election_comments. getModerationQueue: unapproved, non-deleted comments for election creator. |
| **Other** | multi_ai_orchestration_service (content_moderation → Claude), marketplace_dispute_service / dispute_resolution_service (AnthropicService.moderateContent), mcq_service (moderation_flag/reason), openai_service (moderation fields) | Moderation used in disputes, MCQ, and orchestration; not a single shared pipeline. |
| **Unified analytics** | `lib/services/unified_analytics_service.dart` | getContentModerationAnalytics reads **moderation_log** and **moderation_reviews**; get_moderation_impact RPC. |

**Schema dependency:** Mobile assumes **moderation_log**, **moderation_config**, **moderation_reviews**, **user_moderation_history**. These tables are **not** created in the reviewed Supabase migrations; they are either missing or defined elsewhere. content_appeals exists (content_flags migration); moderation_log/config/reviews/history do not in the migrations checked.

### 2.4 Schema & Consistency Issues

- **content_moderation_results.content_type:** CHECK allows only `('post', 'comment')`. The Edge function writes `contentType = 'election'` for elections. This will **fail** at insert unless the constraint was relaxed or the column extended (e.g. add `'election'`).
- **Two pipelines:**  
  - **AI pipeline:** content-moderation-trigger → content_moderation_results → (optional) source table update (removed/rejected).  
  - **Review pipeline:** content_flags → moderation_actions, content_appeals.  
  No automatic creation of content_flags from content_moderation_results, so “AI-flagged for review” (below auto-remove threshold) does not populate the Control Center queue unless another process creates flags.
- **Appeals:** content_appeals is tied to **flag_id** (content_flags). If content is only in content_moderation_results (e.g. auto-removed by Edge), there is no flag; users would need a path to appeal by content_id/content_type when there is no flag, or you create a flag when AI auto-removes.

---

## 3. Gaps vs. Industry Practice

Industry standards (e.g. Meta, Twitter/X, YouTube, TikTok, Discord) typically include:

1. **Proactive moderation** – Content is evaluated at creation time (or shortly after), not only on manual request.
2. **Unified queue** – One place for “needs review”: AI flags, user reports, and automated rules.
3. **Clear user communication** – In-product notices when content is removed or restricted, with reason and policy link.
4. **Appeals** – Simple in-app appeal flow; deadlines and status visible to user.
5. **Transparency** – Policy page, categories of violations, and (where applicable) high-level stats.
6. **Structured policies** – Documented categories (hate, harassment, spam, misinformation, etc.) and severity.
7. **Human oversight** – Escalation, quality checks on AI, and reviewer training.
8. **Audit trail** – Immutable log of actions (who did what, when, why).
9. **Consistency** – Same rules and categories across Web and Mobile.
10. **Media moderation** – Image/video scanning where user-generated media is allowed.

---

## 4. Recommendations (Prioritized)

### 4.1 Critical: Unify and Automate AI → Review Pipeline

- **Add DB trigger or Supabase webhook** on `posts`, `comments`, and (if desired) `elections` INSERT (and optionally UPDATE) that invokes **content-moderation-trigger** with the new row. So every new post/comment (and optionally election) is moderated without manual “moderate this” action.
- **Create content_flags from AI results:** When content-moderation-trigger returns `flagged_for_review` (below auto-remove threshold), insert a row into **content_flags** (content_id, content_type, violation_type from primary_category, confidence_score, detection_method = 'ai', status = 'pending_review'). That way AI-flagged content appears in the existing Control Center and Moderator Queue.
- **Schema fix:** Add `'election'` to content_moderation_results.content_type CHECK (or use a separate table/column for elections) so Edge can persist election results without constraint errors.

### 4.2 Critical: Align Web and Mobile Data Model

- **Option A:** Extend Supabase with **moderation_log**, **moderation_config**, **user_moderation_history**, **moderation_reviews** as in Mobile, and have Web (and Edge) also write/read where appropriate; **or**
- **Option B:** Migrate Mobile to use **content_moderation_results** + **content_flags** + **content_appeals** as the single source of truth, and have Mobile call the same Edge function for AI moderation instead of Claude directly.
- Prefer **one** set of tables and one AI entry point (Edge function) so metrics, appeals, and policies are consistent.

### 4.3 High: Connect Appeals to All Removal Paths

- When **AI auto-removes** content, create a **content_flags** row (or a dedicated “removal” record) so that **content_appeals** can reference it (e.g. by flag_id or by content_id + content_type).
- **User-facing appeal entry:** Ensure users can start an appeal from the app (Web + Mobile) when their content is removed (e.g. “Your post was removed for [category]. Appeal?”). resolveAppeal already exists; expose a “Submit appeal” flow that inserts into content_appeals and, if needed, creates/links a flag.

### 4.4 High: User-Facing Notifications and Transparency

- When content is **removed** (AI or human), notify the author (in-app and/or email) with:  
  - Short reason (e.g. “Policy violation: hate speech”)  
  - Link to community guidelines  
  - Clear “Appeal” CTA and deadline (e.g. 30 days).
- Add a **Help/Policy** page that lists violation categories and what happens (warning, removal, restriction).

### 4.5 High: Real Model Performance and Analytics

- **Replace hardcoded** “Model Performance” (accuracy, precision, recall, F1) with metrics derived from **content_moderation_results** and **moderation_actions** (e.g. human overrides, appeals overturned). Compute precision/recall per category where possible.
- **Dashboard:** Optionally add a view that joins content_moderation_results with content_flags and moderation_actions so admins can see AI vs human decisions and false positive/negative rates.

### 4.6 Medium: Media and Elections

- **Image/Video:** If posts or comments can have media, add a moderation step (e.g. Gemini Vision or a dedicated media API) in the Edge function or a separate “media-moderation” function, and store result (e.g. in content_moderation_results metadata or a linked table).
- **Elections:** Decide if elections should be moderated the same way (already in Edge); ensure schema (content_type + elections.status, moderation_notes) and RLS support it, and that creators see a clear status (e.g. “Rejected – policy violation”).

### 4.7 Medium: Policy and Audit

- **Structured policy list:** Store in DB or config (e.g. policy_categories: id, name, description, severity_default, auto_remove_threshold) and use in Edge and Control Center so labels and thresholds are consistent.
- **Audit:** moderation_actions already gives “who did what”; ensure all AI-driven updates (e.g. status = removed) are also reflected in a log (e.g. content_moderation_results + optional audit table) so you have a full timeline.

### 4.8 Medium: Mobile Parity

- **Moderation Control Center on Mobile:** If moderators use phones, add a minimal Moderation Queue + Appeals screen on Flutter that uses the same APIs/tables as Web (content_flags, content_appeals, resolveAppeal).
- **Single AI entry point:** Prefer Mobile calling **content-moderation-trigger** (or a shared “moderate” API) instead of calling Claude/Gemini directly, so all results land in content_moderation_results (and optionally content_flags) and stay in sync with Web.

### 4.9 Lower: Rate Limits and Safety

- **Rate limit** calls to content-moderation-trigger (per user or per tenant) to avoid abuse and cost.
- **Fallback:** If Claude is down, consider a fallback (e.g. Gemini in the same Edge) so moderation still runs.
- **PII:** Ensure content sent to AI is stripped or scoped so it fits your privacy policy and data processing agreements.

---

## 5. Implementation Checklist (Summary)

| Priority | Action |
|----------|--------|
| Critical | Add DB trigger or webhook to run content-moderation-trigger on post/comment (and optionally election) insert. |
| Critical | When AI returns “flagged_for_review”, insert into content_flags so Control Center queue is populated. |
| Critical | Add `election` to content_moderation_results.content_type (or equivalent) and ensure elections table has status + moderation_notes. |
| Critical | Create missing tables for Mobile (moderation_log, moderation_config, user_moderation_history, moderation_reviews) **or** migrate Mobile to content_moderation_results + content_flags + content_appeals. |
| High | When AI auto-removes, create a content_flags (or equivalent) row so appeals can be linked. |
| High | Add in-app/email notification to author on removal with reason and appeal CTA. |
| High | Replace hardcoded model performance with real metrics from moderation data. |
| Medium | Add media moderation (image/video) if UGC includes media. |
| Medium | Expose “Submit appeal” and “Appeal status” in Web and Mobile. |
| Medium | Document policy categories and thresholds in one place (DB or config). |
| Medium | Consider Moderation Queue + Appeals UI on Mobile for moderator use. |

---

## 6. Conclusion

Vottery already has the building blocks: AI (Claude) in an Edge function, content_moderation_results, content_flags, moderation_actions, content_appeals, and a full Control Center on Web. The main gaps are: **no automatic run of moderation on create**, **disconnection between AI results and the human queue**, **schema mismatch for elections**, **missing or divergent tables for Mobile**, and **limited user-facing communication and appeals**. Addressing the critical and high items above will bring the system in line with industry expectations and make moderation consistent, transparent, and auditable across Web and Mobile.
