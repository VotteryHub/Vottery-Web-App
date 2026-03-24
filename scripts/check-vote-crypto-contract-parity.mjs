import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertContains(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

const webVotesService = read(
  path.resolve(webRoot, 'src', 'services', 'votesService.js')
);
const mobileVotingService = read(
  path.resolve(mobileRoot, 'lib', 'services', 'voting_service.dart')
);

// Web: castVote persists ZK proof contract fields.
assertContains(
  webVotesService,
  "await supabase?.from('zero_knowledge_proofs')?.insert({",
  'web zero_knowledge_proofs insert'
);
assertContains(webVotesService, 'commitment: zkProof?.commitment', 'web commitment field');
assertContains(webVotesService, 'challenge: zkProof?.challenge', 'web challenge field');
assertContains(webVotesService, 'response: zkProof?.response', 'web response field');
assertContains(webVotesService, 'public_key: elgamalKeys?.publicKey', 'web public_key field');
assertContains(webVotesService, 'verified: !!zkProofVerified', 'web verified field');
assertContains(webVotesService, 'verificationStatus:', 'web verification status payload');

// Mobile: castVoteWithReceipt persists same fields.
assertContains(
  mobileVotingService,
  "await _client.from('zero_knowledge_proofs').insert({",
  'mobile zero_knowledge_proofs insert'
);
assertContains(
  mobileVotingService,
  "'commitment': schnorrProof.commitmentHex",
  'mobile commitment field'
);
assertContains(
  mobileVotingService,
  "'challenge': schnorrProof.challengeHex",
  'mobile challenge field'
);
assertContains(
  mobileVotingService,
  "'response': schnorrProof.responseHex",
  'mobile response field'
);
assertContains(
  mobileVotingService,
  "'public_key': publicKeyHex",
  'mobile public_key field'
);
assertContains(
  mobileVotingService,
  "'verified': proofVerified",
  'mobile verified field'
);

// Mobile: verification API parity exists.
assertContains(
  mobileVotingService,
  'verifyVoteWithCryptography(String voteHash)',
  'mobile verifyVoteWithCryptography method'
);
assertContains(
  mobileVotingService,
  "'verificationStatus': verificationStatus",
  'mobile verification status payload'
);
assertContains(
  mobileVotingService,
  "'zkProofValid': proofValid",
  'mobile zkProofValid payload'
);

console.log('Vote crypto contract parity checks passed (Web <-> Mobile services).');
