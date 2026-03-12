# Why Certain AI Decisions Were Made (and What We’re Fixing)

This doc answers: why was OpenAI→Gemini only on Web, why wasn’t image generation replaced with Gemini, why weren’t all doc-listed “center” pages created, and why there was still a Mobile Gemini discrepancy. It also records what we’re doing to fix each.

---

## 1. Why was OpenAI/GPT → Gemini only on Web?

**Reason at the time:**  
The replacement work was done in the **Web (React)** codebase first. The handoff and scope emphasized Web services (`lib/openai.js`, `aiProxyService`, quest/carousel/SMS/feed). Mobile (Flutter) uses different entry points: **Supabase Edge** (`openai-text-generation`, `openai-quest-generation`, etc.) and in one place **direct OpenAI** (e.g. `OpenAISMSOptimizerService` with Dio). Doing Mobile as well meant either (a) changing every Edge function to use Gemini, or (b) adding a Gemini path on Mobile (e.g. call `ai-proxy` with provider `gemini`). It was scoped as “Web first”; Mobile was left for a follow-up.

**What we’re doing:**  
- Adding **Mobile Gemini parity**: a Mobile service that calls the same **ai-proxy** Edge with `provider: 'gemini'`, and using it for SMS optimization (and optionally other chat flows) so Mobile matches Web.

---

## 2. Why didn’t you replace image generation with Gemini?

**Reason at the time:**  
Image generation was treated as a **separate product** (DALL·E). The analysis and replacement plan focused on **text and embeddings** (quests, carousel, SMS, feed, recommendations). Replacing image generation would mean:
- Switching to **Gemini/Imagen** (Imagen 3 is in the Gemini API).
- Either changing the **Lambda** to support Gemini/Imagen or adding a **Supabase Edge** image endpoint.
- Avoiding breaking existing flows without a clear “replace images too” ask.

So it was **deliberately not** replaced in the first pass.

**What we’re doing:**  
- **Replacing image generation with Gemini** where possible: defaulting to **GEMINI** in the Web image flow, and adding a **Supabase Edge function** for Gemini/Imagen so the app can use Gemini for images without depending on the Lambda. If the Lambda already supports GEMINI, we still default the client to Gemini.

---

## 3. Why didn’t you create new page components for every doc-listed “center”?

**Reason at the time:**  
The audit listed many “centers” that appear in **nav only** and have **no page folder** (e.g. `anthropic-advanced-content-analysis-center`, `perplexity-strategic-planning-center`, `advanced-ml-threat-detection-center`). Creating “every” one would mean **20+ new pages**. That was treated as **out of scope** to avoid:
- Many placeholder screens with no real behavior.
- Product/UX decisions about what each center should do.

So only **routes for existing pages** were added; no new page components were created for doc-only centers.

**What we’re doing:**  
- **Creating placeholder page components** for every doc-listed “center” that appears in the nav but has no page: one **reusable placeholder** component and a **route per path** so no nav link 404s. Content can be filled in later.

---

## 4. Why was there still a Mobile Gemini discrepancy?

**Reason at the time:**  
- **Web** was fully switched to Gemini (chat, embeddings, quest, carousel, SMS, feed, revenue).
- **Mobile** still used:  
  - **Edge functions** named for OpenAI (`openai-text-generation`, `openai-quest-generation`, etc.) that may still call OpenAI on the backend.  
  - **OpenAISMSOptimizerService** calling the **OpenAI API directly** with Dio.  
So Mobile had no **first-class “use Gemini” path** like Web.

**What we’re doing:**  
- **Removing the discrepancy** by:  
  - Adding a **Gemini chat service** on Mobile that calls **ai-proxy** with `provider: 'gemini'`.  
  - Using that for **SMS optimization** (and any other chat flows we align) so Mobile uses the same Gemini backend as Web.  
  - Logging **optimization_type: 'gemini'** on Mobile to match Web.  
- Backend Edge functions (e.g. `openai-quest-generation`) can later be updated to call Gemini so Mobile quest/fraud flows also use Gemini; the immediate fix is SMS + any other flows we route through ai-proxy.

---

## Summary

| Gap | Why it happened | Fix |
|-----|------------------|-----|
| OpenAI→Gemini only on Web | Scope was Web-first; Mobile uses different APIs. | Mobile Gemini service + SMS (and other chat) via ai-proxy. |
| Image generation not Gemini | Treated as separate; no explicit “replace images” in first pass. | Default to GEMINI + Edge (or Lambda) for image gen. |
| No new “center” pages | Avoid 20+ empty pages; only added routes for existing pages. | One placeholder component + routes for all nav-listed centers. |
| Mobile Gemini discrepancy | Mobile still used OpenAI Edge names and direct OpenAI (Dio). | Gemini path on Mobile via ai-proxy; same constants (e.g. `optimization_type: 'gemini'`). |
