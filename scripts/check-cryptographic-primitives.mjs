import path from 'node:path';
import { pathToFileURL } from 'node:url';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const serviceModuleUrl = pathToFileURL(
  path.resolve(process.cwd(), 'src', 'services', 'cryptographyService.js')
).href;
const serviceModule = await import(serviceModuleUrl);
const {
  ElGamalCrypto,
  MixnetCrypto,
  ZeroKnowledgeProof,
  ThresholdCrypto,
} = serviceModule;

// 1) Threshold split/reconstruct round-trip
const secret = `threshold-secret-${Date.now()}`;
const secretHex = Buffer.from(secret, 'utf8').toString('hex').padStart(64, '0').slice(0, 64);
const shares = ThresholdCrypto.splitSecret(secretHex, 5, 3);
assert(Array.isArray(shares), 'Threshold split did not return shares');
assert(shares.length === 5, 'Threshold split returned wrong share count');

const subset = [shares[0], shares[2], shares[4]];
const reconstructedHex = ThresholdCrypto.reconstructSecret(subset);
assert(
  reconstructedHex.toLowerCase() === secretHex.toLowerCase(),
  'Threshold reconstructed secret does not match original'
);

// 2) ZK proof generate + verify
const elgamal = ElGamalCrypto.generateKeyPair();
const voteHash = `vote-${Date.now()}-${Math.random().toString(16).slice(2)}`;
assert(voteHash, 'Failed to produce vote hash');

const proof = ZeroKnowledgeProof.generateProof(voteHash, elgamal.privateKey);

const verify = ZeroKnowledgeProof.verifyProof(
  {
    commitment: proof.commitment,
    challenge: proof.challenge,
    response: proof.response,
  },
  voteHash,
  elgamal.publicKey
);
assert(verify === true, 'Generated ZK proof failed verification');

// 3) Homomorphic addition behaves as encrypted tally combiner.
const enc1 = ElGamalCrypto.encrypt(1, elgamal.publicKey);
const enc2 = ElGamalCrypto.encrypt(2, elgamal.publicKey);
const homomorphicSum = ElGamalCrypto.homomorphicAdd([enc1, enc2]);
assert(homomorphicSum?.c1 && homomorphicSum?.c2, 'Homomorphic add did not return ciphertext');

// 4) Mixnet shuffle keeps cardinality and emits shuffle proof.
const sampleVotes = [
  { c1: enc1.c1, c2: enc1.c2, voteHash: `vh-1-${Date.now()}` },
  { c1: enc2.c1, c2: enc2.c2, voteHash: `vh-2-${Date.now()}` },
];
const mixed = MixnetCrypto.shuffleVotes(sampleVotes, elgamal.publicKey);
assert(Array.isArray(mixed), 'Mixnet shuffle did not return an array');
assert(mixed.length === sampleVotes.length, 'Mixnet shuffle changed vote count');
const shuffleProof = MixnetCrypto.generateShuffleProof(sampleVotes, mixed);
assert(shuffleProof?.inputHash, 'Mixnet shuffle proof missing input hash');
assert(shuffleProof?.outputHash, 'Mixnet shuffle proof missing output hash');
assert(shuffleProof?.count === sampleVotes.length, 'Mixnet shuffle proof count mismatch');

console.log('Cryptographic primitive checks passed (threshold + zkp + homomorphic + mixnet).');
