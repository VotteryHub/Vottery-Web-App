# V1 Gap Audit — Phase F0

## Requirement Group Audit

| Requirement | Status | Evidence | Implementation | Fix Plan |
| :--- | :--- | :--- | :--- | :--- |
| **A) Ads Slot Manager ON** | Partial | `src/services/adSlotManagerService.js` (logic exists) | `adSlotManagerService.js`, `ad-slot-manager-inventory-control-center/index.jsx` | Implement global/per-network toggles in Admin UI; add keyless mode fallback logic. |
| **B) Ads Injection Rules** | Partial | `adSlotManagerService.js` (mapping exists) | `adSlotManagerService.js`, `AdSlotRenderer.jsx` | Update ratios to 1:3/4; add Jolts/Search/Marketplace/Desktop Right Column placements. |
| **C) Algorithm Command Center UI** | Missing | No route found | N/A | Create 4-quadrant UI + 3D globe heatmap in `src/pages/admin/algorithm-command-center`. |
| **D) Constitution Middleware** | Missing | No logic found | N/A | Implement middleware for logic audit, integrity checks, and redemption path. |
| **E) vIQ + Reach Penalty** | Partial | `feedRankingService.js` (personalization exists) | `feedRankingService.js`, `adSlotManagerService.js` | Integrate vIQ/Penalty logic into ranking; implement 70/30 discovery logic. |
| **F) Responsive Navigation** | Partial | `src/components/layout/AppShell.jsx` | `AppShell.jsx`, `navigationHubRoutes.js` | Audit menu/search categories against PDF specs; ensure high-fidelity parity. |
| **G) Final Preview Scripts** | Partial | `package.json` (minimal `preview:critical`) | `package.json`, `tests/e2e/responsive-stability.spec.js` | Enhance `preview:critical` to include full E2E flow (Login -> Vote -> Profile). |

---

## Technical Debt & Compliance Audit

### 1. Tooling Compliance (CRITICAL)
- **Status**: Non-Compliant
- **Finding**: Project heavily uses `openai` and `perplexity` in core services (`feedRankingService.js`, `perplexityStrategicPlanningService.js`, etc.).
- **Requirement**: Use Gemini + Claude + Shaped AI only.
- **Fix**: Migration task required to swap OpenAI/Perplexity calls to Gemini/Claude.

### 2. Module Discipline
- **Status**: Pending Review
- **Finding**: Cross-module imports may exist.
- **Requirement**: Kernel + Modules discipline; event bus only.
- **Fix**: Audit `src/services` for direct module dependencies and replace with `eventBus.js`.

### 3. Feature Flags
- **Status**: Partial
- **Finding**: `FeatureGate.jsx` exists, but global nav/routes hiding needs verification.
- **Requirement**: Hide nav/routes/UI instantly when flag is OFF.

---

## Open Clarifying Questions

> [!IMPORTANT]
> 1. **PDF Specifications**: The prompt refers to "PDFs already provided". Are there specific image files or text documents in the repo (e.g., in `docs/specs`) that I should use as the ground truth for UI layouts?
> 2. **vIQ/Reach Penalty Logic**: Are the specific formulas for vIQ and Reach Penalty defined in a separate document, or should I implement standard "Merit-based" ranking algorithms?
> 3. **OpenAI Replacement**: Should I immediately begin swapping OpenAI calls for Gemini/Claude as part of the implementation, or is there a separate "AI Migration" phase?
> 4. **Mobile App Parity**: Should the audit and implementation focus strictly on the Web App (`Vottery-Web-App`), or are simultaneous changes required in the Mobile App (`Vottery-Mobile-App`) to maintain parity?
> 5. **Ads Networks**: For the split (Ezoic 27%, etc.), do we have the production API keys/IDs, or should I use placeholders for the V1 release?
