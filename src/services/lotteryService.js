import { supabase } from '../lib/supabase';

// Shared lottery service for Web, aligned with Flutter's EnhancedLotteryService

function generateCryptographicSeed(lotteryId) {
  const timestamp = Date.now();
  const randomPart =
    typeof crypto !== 'undefined' && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint32Array(1))[0]
      : Math.floor(Math.random() * 1_000_000);

  const combined = `${lotteryId}:${timestamp}:${randomPart}`;

  // Simple SHA-256 implementation using SubtleCrypto when available
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const encoder = new TextEncoder();
    return crypto.subtle.digest('SHA-256', encoder.encode(combined)).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    });
  }

  // Fallback: allow backend to re-hash, we still provide high-entropy input
  return Promise.resolve(combined);
}

export async function initializeLotteryDraw(electionId) {
  const { data, error } = await supabase.rpc('initialize_lottery_draw', {
    p_election_id: electionId,
  });

  if (error) {
    throw error;
  }

  return data; // expected to be lottery_id
}

export async function selectLotteryWinners({ lotteryId, winnerCount = 3 }) {
  const randomSeed = await generateCryptographicSeed(lotteryId);

  const { data, error } = await supabase.rpc('select_lottery_winners', {
    p_lottery_id: lotteryId,
    p_random_seed: randomSeed,
    p_winner_count: winnerCount,
  });

  if (error) {
    throw error;
  }

  return {
    lotteryId,
    randomSeed,
    winners: data ?? [],
  };
}

export async function getLotteryAuditTrail(lotteryId) {
  const { data, error } = await supabase
    .from('lottery_audit_trail')
    .select('*')
    .eq('lottery_id', lotteryId)
    .order('timestamp', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

