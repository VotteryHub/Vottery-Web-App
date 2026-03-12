# Vottery AI: Shaped Replacement & Provider Comparison (Gemini vs Grok vs OpenAI)

**Date:** March 2025  
**Purpose:** (1) Choose the best provider to replace Shaped AI for recommendations and creator discovery. (2) Compare Google Gemini, xAI Grok, and OpenAI/ChatGPT for the roles/tasks currently assigned to OpenAI in Vottery, including cost.

---

## Part 1: Replacing Shaped AI

### What Shaped AI Does in Vottery

- **Vote event sync:** Pushes vote events to Shaped’s API so their model can learn from engagement.
- **Recommendations:** Calls Shaped `/recommend` and `/recommendations` for election and creator recommendations.
- **Creator discovery:** `shapedCreatorDiscoveryService` uses Shaped to rank and recommend creators.
- **Forecast:** Optional forecasting endpoint.

So we need a replacement that can:

1. Use engagement data (votes, preferences) to personalize recommendations.
2. Provide **embeddings** or semantic similarity for ranking.
3. Support **creator discovery** (ranking creators by relevance to the user).
4. Stay cost-effective at scale.

### Candidates to Replace Shaped

| Provider | Embeddings | Ranking / Rerank | Creator discovery (LLM) | Cost (embeddings) | Already in Vottery |
|----------|------------|------------------|--------------------------|-------------------|---------------------|
| **OpenAI** | text-embedding-3-small/large | GPT-4 for explanations | Yes | ~$0.02/1M (small) to **$130/1M** (large) | Yes |
| **Anthropic Claude** | No native embeddings* | Claude for reasoning/ranking | Yes | N/A | Yes |
| **Google Gemini** | **gemini-embedding-001** (GA) | Gemini Pro/Flash for rerank & explanations | Yes | **$0.15/1M** | Yes |
| **Perplexity** | No | Sonar for search-style reasoning | Possible but search-focused | N/A | Yes |
| **xAI Grok** | Collections API (embeddings) | Grok 4 / 4.1 Fast for text | Yes | Not clearly published for embeddings | No |

*Claude can be used for semantic tasks but does not offer a dedicated, cheap embeddings API like Gemini or OpenAI.

### Benchmark: Embeddings Quality (MTEB)

- **Gemini embedding:** MTEB **#1** (score ~68.32), multilingual, 20K tokens, **$0.15/1M tokens**.
- **OpenAI text-embedding-3-large:** ~64.6; **~$130/1M tokens** (per 1K pricing).
- **OpenAI text-embedding-3-small:** ~62.3; cheaper but lower quality than Gemini.

So for **recommendation + creator discovery**, Gemini gives the best combination of:

- **Quality:** Top-tier embeddings + strong LLM for rerank and “why this creator” explanations.
- **Cost:** Far cheaper than OpenAI for embeddings; comparable or cheaper for generation (Flash).
- **Already integrated:** Gemini is already used (monitoring, fallback); no new vendor.
- **Single vendor:** One provider for both embeddings and ranking simplifies ops and failover.

### Recommendation: Replace Shaped with **Google Gemini**

- Use **Gemini Embedding** for:
  - User interest vectors (from votes, preferences).
  - Election/content and creator profile vectors.
  - Similarity search for candidate ranking.
- Use **Gemini Pro or Flash** for:
  - Reranking top-N candidates.
  - Generating “why we recommend this” explanations.
  - Creator discovery reasoning (match user interests to creators).

Implementation outline:

- **Event “sync”:** Continue storing vote/engagement events in Supabase (e.g. `votes` with optional `recommendation_synced_at` or a small `recommendation_events` table). No external Shaped API.
- **Recommendation API:** New `geminiRecommendationService` that:
  - Builds or caches embeddings for users and items (elections, creators) via Gemini Embedding.
  - Retrieves candidates (from Supabase), scores by similarity, optionally reranks with Gemini Pro/Flash.
  - Returns ranked list + short explanations.
- **Creator discovery:** Same pipeline: creator profiles → embeddings → similarity to user vector → optional Gemini rerank + explanation.

This fully replaces Shaped’s roles with one already-approved provider and keeps cost low.

---

## Part 2: Gemini vs Grok vs OpenAI for Current “OpenAI” Roles in Vottery

### Current OpenAI / GPT-4 Roles in Vottery

From the codebase and docs:

| Role / Task | Where used | Needs |
|-------------|------------|--------|
| Quest generation | `openAIQuestService`, `openAIQuestGenerationService` | Strong text generation, structure (JSON), creativity |
| Carousel ranking | `openAICarouselRankingService` | Relevance scoring, explanations |
| SMS optimization | Open AI SMS Optimization Studio | Short copy, A/B variants, character efficiency |
| Feed ranking | `feedRankingService` | **Embeddings** (semantic similarity) + optional LLM |
| AI-guided tutorials | Tutorial system | Step-by-step generation, personalization |
| Image generation | DALL·E via proxy | Image generation (Gemini/Grok have separate image models) |

Below we compare **Gemini**, **Grok**, and **OpenAI** on these (excluding image, which is model-specific).

### 2.1 Capability Comparison (Text + Embeddings)

| Criterion | OpenAI (GPT-4 class) | Google Gemini (Pro / Flash) | xAI Grok (4 / 4.1 Fast) |
|-----------|----------------------|-----------------------------|-------------------------|
| **Reasoning / complex tasks** | Strong | **Strong (e.g. Gemini 2.5 “thinking”, 1M+ context)** | Good (2M context on 4.1 Fast) |
| **Structured output (JSON)** | Strong | Strong | Strong |
| **Embeddings** | Yes (expensive for large) | **Yes, MTEB #1, cheap** | Collections API (embeddings), less documented |
| **Multilingual** | Good | **Very strong** | Good |
| **Context window** | 128K typical | **1M–2M** (Pro/Flash) | 131K–256K (Grok 3/4), 2M (4.1 Fast) |
| **Speed (latency)** | Good | Flash: very fast; Pro: good | **4.1 Fast: very fast** |
| **Cost (input / output)** | High | Medium (Flash low) | **Lowest (4.1 Fast)** |

For **quest generation, carousel ranking, SMS optimization, tutorials**:

- **Quality:** Gemini Pro and GPT-4 are both top tier; Grok is slightly behind on hardest reasoning but strong for many product tasks.
- **Context / scale:** Gemini wins on context (1M+ tokens) and fits long user histories.
- **Embeddings:** Gemini is best (quality + price); OpenAI large is expensive; Grok is not a standard embeddings API.
- **Cost:** Grok 4.1 Fast is the cheapest; Gemini Flash next; then Gemini Pro and GPT-4.

### 2.2 Cost Comparison (Approximate, per 1M tokens)

| Model | Input ($/1M) | Output ($/1M) | Notes |
|-------|-------------|----------------|-------|
| **OpenAI GPT-4o / GPT-5.2** | ~$1.75–2.50 | ~$10–14 | Flagship |
| **OpenAI text-embedding-3-large** | ~$130/1M | — | Embeddings only |
| **Gemini 3.1 Pro** | $2.00 | $12.00 | Flagship |
| **Gemini 3.1 Flash** | ~$0.50 | ~$3.00 | Fast, cheap |
| **Gemini Embedding** | **$0.15** | — | Best value for embeddings |
| **Grok 4** | $3.00 | $15.00 | Flagship |
| **Grok 4.1 Fast** | **$0.20** | **$0.50** | Fastest, cheapest |

So for the **same job roles** (text generation + embeddings):

- **Cheapest:** Grok 4.1 Fast (by a large margin for text); Gemini Embedding for embeddings.
- **Best quality/cost balance:** Gemini (Embedding + Pro or Flash).
- **Highest cost:** OpenAI (GPT-4 + text-embedding-3-large).

### 2.3 Fit for Vottery’s OpenAI-Assigned Tasks

| Task | Best quality | Best value (quality/cost) | Lowest cost |
|------|----------------|----------------------------|-------------|
| Quest generation | Gemini Pro / GPT-4 | **Gemini Pro or Flash** | Grok 4.1 Fast |
| Carousel ranking | Gemini Pro / GPT-4 | **Gemini Flash** | Grok 4.1 Fast |
| SMS optimization | Any of three | **Gemini Flash** | Grok 4.1 Fast |
| Feed ranking (embeddings) | **Gemini** | **Gemini** | **Gemini** |
| Tutorials | Gemini Pro / GPT-4 | **Gemini Pro/Flash** | Grok 4.1 Fast |

### 2.4 Overall Recommendation (Gemini vs Grok vs OpenAI)

- **Best overall for Vottery (quality + cost + embeddings):** **Google Gemini**
  - Use **Gemini Embedding** for all embedding-based tasks (feed ranking, recommendations, creator discovery).
  - Use **Gemini Pro** for the most demanding generation (quests, complex carousel reasoning).
  - Use **Gemini Flash** for SMS, simple ranking, tutorials, and high-volume paths.
  - One vendor for embeddings + generation simplifies security, failover, and billing.

- **If minimizing cost is the top priority:** **xAI Grok 4.1 Fast**
  - Use for high-volume, less critical text (e.g. SMS variants, simple explanations).
  - Keep Gemini (or OpenAI) for quests and any task where reasoning quality is critical.
  - Note: Grok does not offer a dedicated, documented embeddings API like Gemini; for embeddings we still recommend Gemini.

- **When to keep OpenAI:**
  - DALL·E image generation (until you adopt Imagen/Grok Imagine and migrate).
  - Any legacy integration that must stay on OpenAI for now.

**Summary:** For the roles and functions currently assigned to OpenAI in Vottery, **Google Gemini is the best choice** when considering quality, cost, and embeddings together. **Grok 4.1 Fast is the best on cost** for text-only, high-volume tasks. Replacing Shaped with **Gemini** is the best option for recommendations and creator discovery.

---

## Part 3: Implementation Choices (Summary)

| Decision | Recommendation |
|----------|-----------------|
| Replace Shaped with | **Google Gemini** (embeddings + Pro/Flash for ranking and explanations) |
| Primary provider for current “OpenAI” text tasks | **Gemini** (Pro for complex, Flash for volume) |
| Embeddings everywhere | **Gemini Embedding** (replace OpenAI embeddings in feed ranking where appropriate) |
| Optional cost optimization | Use **Grok 4.1 Fast** for selected high-volume, non-critical text (e.g. some SMS or simple copy) |
| Image generation | Keep **OpenAI DALL·E** unless you explicitly migrate to Imagen / Grok Imagine |

These choices align with your preference to move away from Shaped and to favor Gemini and Grok over OpenAI where they are better on roles, tasks, and cost.
