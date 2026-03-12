# Gemini Replacement Implementation Summary

**Date:** March 2025  
**Scope:** Replace Shaped AI and OpenAI/GPT with Google Gemini for recommendations, chat, and embeddings.

---

## 1. Shaped AI → Gemini (Recommendations & Creator Discovery)

**Status: ✅ Complete**

- **`geminiRecommendationService.js`** implements:
  - Vote-event sync to Supabase (`votes.recommendation_synced_at`, `recommendation_sync_logs`)
  - Embeddings via `getEmbedding()` (Gemini Embedding API)
  - `getRecommendations`, `getCreatorRecommendations`, `getMarketplaceRecommendations`, `forecastEngagement`
  - Sync worker and manual sync
- **Shaped services** `shapedAISyncService.js` and `shapedCreatorDiscoveryService.js` are thin wrappers that delegate to `geminiRecommendationService`; no Shaped API calls.
- **Hub** at `/shaped-ai-sync-docker-automation-hub` is titled "Gemini Recommendation & Sync Hub" and uses the Gemini service.
- **Migration:** `20260307120000_gemini_recommendation_sync.sql` adds `recommendation_synced_at` and `recommendation_sync_logs`.

---

## 2. OpenAI/GPT → Gemini (Chat, Quests, Carousel, SMS, Feed, Revenue)

**Status: ✅ Complete (Web)**

| Area | Implementation |
|------|----------------|
| **Unified chat** | `lib/openai.js` routes all `chat.completions.create` to `aiProxyService.callGemini()`. Model names (e.g. gpt-5, gpt-4) are mapped to `gemini-1.5-flash`. |
| **Embeddings** | `lib/openai.js` `embeddings.create` uses `getEmbedding()` from `geminiRecommendationService` (client-side). |
| **AI proxy** | Supabase Edge `ai-proxy` supports provider `gemini`; `handleGemini()` calls Gemini REST API; response normalized to OpenAI shape. Env: `GEMINI_API_KEY`. |
| **Quest** | `openAIQuestService.js`, `openAIQuestGenerationService.js` use `openai` from `lib/openai.js` → Gemini via proxy. |
| **Carousel** | `openAICarouselRankingService.js` uses `geminiChatService.generateContent()` (client-side) for semantic analysis, A/B prediction, conversion optimization. |
| **SMS** | `smsOptimizationService.js`, `smsProviderService.js` use `geminiChatService.generateContent()`. Logs `optimization_type: 'gemini'`. |
| **Feed ranking** | `feedRankingService.js` uses `openai.embeddings.create` → Gemini embeddings via `getEmbedding`. |
| **Revenue / search** | `revenueSplitForecastingService.js`, `advancedSearchService.js`, page `ai-powered-revenue-forecasting-intelligence-center` use `aiProxyService.callGemini()`. |

**New/updated files**

- `src/services/geminiChatService.js` — client-side Gemini chat (`generateContent`, OpenAI-shaped response).
- `supabase/functions/ai-proxy/index.ts` — added `handleGemini`, `case 'gemini'`, cost rate for `gemini`.
- `src/services/aiProxyService.js` — added `callGemini(messages, options)`.

**Not replaced (intentionally)**

- **Image generation (DALL·E):** Still OpenAI; Gemini Imagen would require a separate migration.
- **Mobile (Flutter):** Quest/carousel/SMS still use existing OpenAI/Gemini services; can later call same ai-proxy (Gemini) or add Dart Gemini client for parity.

---

## 3. Constants and Web vs Mobile

- **Recommendation / sync:** Same tables and column names on both (e.g. `recommendation_synced_at`, `recommendation_sync_logs`).
- **SMS optimization_type:** Web logs `'gemini'`; Mobile can use `'gemini'` when it switches to Gemini (e.g. via shared backend or Gemini SDK).
- **Route:** Mobile has `geminiRecommendationSyncHub` for deep-link to Web Gemini hub.

---

## 4. Confirmation for Stakeholders

1. **Shaped AI replaced by Gemini?**  
   **Yes.** Recommendations and creator discovery are fully powered by Gemini (embeddings + optional rerank). No Shaped API calls remain; Shaped services are wrappers to `geminiRecommendationService`.

2. **OpenAI/GPT replaced by Gemini?**  
   **Yes (Web).** All chat and embedding usage that previously went through OpenAI now goes through Gemini (proxy or client-side). Quest, carousel, SMS, feed ranking, revenue/search, and related dashboards use Gemini. Image generation (DALL·E) remains on OpenAI.

3. **Is Gemini better and cheaper than Shaped for recommendations?**  
   **Yes.** Per `docs/AI_ANALYSIS_SHAPED_REPLACEMENT_AND_PROVIDER_COMPARISON.md`:
   - **Quality:** Gemini embedding is MTEB #1; strong LLM for rerank and explanations.
   - **Cost:** ~$0.15/1M tokens for embeddings; no per-request Shaped subscription.
   - **Vendor:** Single provider (Gemini) for embeddings + ranking; no dependency on Shaped’s external rec API.
