/**
 * Normalizes voting type strings to a canonical format.
 * Handles legacy formats, case-insensitivity, and mixed separators.
 * 
 * Canonical values:
 * - 'plurality'
 * - 'approval'
 * - 'ranked-choice'
 * - 'plus-minus'
 */
export const normalizeVotingType = (type) => {
  if (!type || typeof type !== 'string') return 'plurality'; // Default fallback

  const normalized = type.toLowerCase().trim().replace(/[\s_]+/g, '-');

  // Specific mapping for common variants
  if (normalized === 'approval-voting' || normalized === 'approval') {
    return 'approval';
  }
  
  if (normalized === 'ranked-choice' || normalized === 'ranked' || normalized === 'rcv') {
    return 'ranked-choice';
  }

  if (normalized === 'plurality' || normalized === 'standard' || normalized === 'single-choice') {
    return 'plurality';
  }

  if (normalized === 'plus-minus' || normalized === 'score' || normalized === 'quadratic') {
    return 'plus-minus';
  }

  // Fallback to the normalized string if it matches any known pattern, 
  // or return plurality as safe default for unknown types
  const knownTypes = ['plurality', 'approval', 'ranked-choice', 'plus-minus'];
  if (knownTypes.includes(normalized)) {
    return normalized;
  }

  return 'plurality';
};
