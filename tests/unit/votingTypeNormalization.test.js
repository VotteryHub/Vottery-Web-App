import { expect, test } from 'vitest';
import { normalizeVotingType } from '../../src/lib/votingTypeUtils';

test('normalizeVotingType should handle various string formats', () => {
  // Ranked Choice variants
  expect(normalizeVotingType('Ranked Choice')).toBe('ranked-choice');
  expect(normalizeVotingType('ranked choice')).toBe('ranked-choice');
  expect(normalizeVotingType('Ranked-Choice')).toBe('ranked-choice');
  expect(normalizeVotingType('ranked-choice')).toBe('ranked-choice');
  expect(normalizeVotingType('RCV')).toBe('ranked-choice');
  
  // Approval variants
  expect(normalizeVotingType('Approval Voting')).toBe('approval');
  expect(normalizeVotingType('approval')).toBe('approval');
  
  // Plurality variants
  expect(normalizeVotingType('Plurality')).toBe('plurality');
  expect(normalizeVotingType('standard')).toBe('plurality');
  expect(normalizeVotingType('single choice')).toBe('plurality');
  
  // Plus Minus variants
  expect(normalizeVotingType('Plus Minus')).toBe('plus-minus');
  expect(normalizeVotingType('score')).toBe('plus-minus');
  
  // Edge cases
  expect(normalizeVotingType('')).toBe('plurality');
  expect(normalizeVotingType(null)).toBe('plurality');
  expect(normalizeVotingType(undefined)).toBe('plurality');
  expect(normalizeVotingType('unknown')).toBe('plurality');
});
