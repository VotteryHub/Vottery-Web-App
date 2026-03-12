/**
 * Vottery Auction Service (Web)
 * Engagement-first scoring for ad ranking + second-price payment (Vickrey-style).
 *
 * This is intentionally lightweight and deterministic; the “pCTR” portion is a placeholder
 * until ML predictions are available.
 */

export function normalizeQualityScore(qs) {
  const n = Number(qs);
  if (!Number.isFinite(n)) return 100;
  return Math.max(0, Math.min(200, n));
}

export function estimateActionRate({ qualityScore }) {
  // Placeholder for ML pCTR / pConversion.
  // Map qualityScore 0..200 to ~0.02..0.25.
  const q = normalizeQualityScore(qualityScore);
  return 0.02 + (q / 200) * 0.23;
}

export function totalValueScore({ bidCents, qualityScore }) {
  const bid = Math.max(0, Number(bidCents) || 0);
  const p = estimateActionRate({ qualityScore });
  const qFactor = normalizeQualityScore(qualityScore) / 100; // 1.0 at 100
  return bid * p * qFactor;
}

/**
 * Choose winner and compute second-price payment.
 *
 * Returns:
 * - winner: candidate
 * - runnerUp: candidate | null
 * - clearingPriceCents: minimum cents to beat runner-up (approx)
 */
export function runSecondPriceAuction(candidates) {
  const scored = (candidates || [])
    .map((c) => ({
      ...c,
      qualityScore: normalizeQualityScore(c?.qualityScore),
      tvs: totalValueScore({ bidCents: c?.bidCents, qualityScore: c?.qualityScore }),
    }))
    .sort((a, b) => (b.tvs || 0) - (a.tvs || 0));

  const winner = scored[0] || null;
  const runnerUp = scored[1] || null;
  if (!winner) {
    return { winner: null, runnerUp: null, clearingPriceCents: null, scored: [] };
  }

  // Second-price: charge the minimum bid that would have tied the runner-up TVS.
  // clearingBid ≈ runnerUpTVS / (p * qFactor)
  let clearingPriceCents = 1;
  if (runnerUp) {
    const p = estimateActionRate({ qualityScore: winner.qualityScore });
    const qFactor = normalizeQualityScore(winner.qualityScore) / 100;
    const denom = p * qFactor;
    const neededBid = denom > 0 ? Math.ceil((runnerUp.tvs || 0) / denom) : winner.bidCents;
    clearingPriceCents = Math.min(winner.bidCents || 0, Math.max(1, neededBid + 1));
  } else {
    clearingPriceCents = Math.min(winner.bidCents || 0, 1);
  }

  return { winner, runnerUp, clearingPriceCents, scored };
}

