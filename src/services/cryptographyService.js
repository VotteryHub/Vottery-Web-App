import CryptoJS from 'crypto-js';


import EC from 'elliptic';
import jsrsasign from 'jsrsasign';

const ec = new EC.ec('secp256k1');

// =====================================================
// RSA ENCRYPTION LIBRARY
// =====================================================

export const RSACrypto = {
  /**
   * Generate RSA key pair (2048-bit)
   * @returns {Object} { publicKey, privateKey }
   */
  generateKeyPair() {
    const rsaKeypair = jsrsasign?.KEYUTIL?.generateKeypair('RSA', 2048);
    const publicKey = jsrsasign?.KEYUTIL?.getPEM(rsaKeypair?.pubKeyObj);
    const privateKey = jsrsasign?.KEYUTIL?.getPEM(rsaKeypair?.prvKeyObj, 'PKCS8PRV');
    
    return { publicKey, privateKey };
  },

  /**
   * Encrypt data with RSA public key
   * @param {string} data - Data to encrypt
   * @param {string} publicKeyPEM - Public key in PEM format
   * @returns {string} Base64 encoded encrypted data
   */
  encrypt(data, publicKeyPEM) {
    try {
      const publicKey = jsrsasign?.KEYUTIL?.getKey(publicKeyPEM);
      const encrypted = jsrsasign?.KJUR?.crypto?.Cipher?.encrypt(data, publicKey);
      return jsrsasign?.hextob64(encrypted);
    } catch (error) {
      console.error('RSA encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  },

  /**
   * Decrypt data with RSA private key
   * @param {string} encryptedData - Base64 encoded encrypted data
   * @param {string} privateKeyPEM - Private key in PEM format
   * @returns {string} Decrypted data
   */
  decrypt(encryptedData, privateKeyPEM) {
    try {
      const privateKey = jsrsasign?.KEYUTIL?.getKey(privateKeyPEM);
      const encryptedHex = jsrsasign?.b64tohex(encryptedData);
      const decrypted = jsrsasign?.KJUR?.crypto?.Cipher?.decrypt(encryptedHex, privateKey);
      return decrypted;
    } catch (error) {
      console.error('RSA decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  },

  /**
   * Sign data with RSA private key
   * @param {string} data - Data to sign
   * @param {string} privateKeyPEM - Private key in PEM format
   * @returns {string} Base64 encoded signature
   */
  sign(data, privateKeyPEM) {
    try {
      const sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
      sig?.init(privateKeyPEM);
      sig?.updateString(data);
      const signature = sig?.sign();
      return jsrsasign?.hextob64(signature);
    } catch (error) {
      console.error('RSA signing error:', error);
      throw new Error('Failed to sign data');
    }
  },

  /**
   * Verify signature with RSA public key
   * @param {string} data - Original data
   * @param {string} signatureB64 - Base64 encoded signature
   * @param {string} publicKeyPEM - Public key in PEM format
   * @returns {boolean} True if signature is valid
   */
  verify(data, signatureB64, publicKeyPEM) {
    try {
      const sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
      sig?.init(publicKeyPEM);
      sig?.updateString(data);
      const signatureHex = jsrsasign?.b64tohex(signatureB64);
      return sig?.verify(signatureHex);
    } catch (error) {
      console.error('RSA verification error:', error);
      return false;
    }
  }
};

// =====================================================
// ELGAMAL HOMOMORPHIC ENCRYPTION
// =====================================================

export const ElGamalCrypto = {
  /**
   * Generate ElGamal key pair
   * @returns {Object} { publicKey, privateKey }
   */
  generateKeyPair() {
    const keyPair = ec?.genKeyPair();
    return {
      publicKey: keyPair?.getPublic('hex'),
      privateKey: keyPair?.getPrivate('hex')
    };
  },

  /**
   * Encrypt vote with ElGamal (homomorphic)
   * @param {number} vote - Vote value (0 or 1 for binary votes)
   * @param {string} publicKeyHex - Public key in hex format
   * @returns {Object} { c1, c2 } - Encrypted vote components
   */
  encrypt(vote, publicKeyHex) {
    try {
      const publicKey = ec?.keyFromPublic(publicKeyHex, 'hex');
      const k = ec?.genKeyPair()?.getPrivate(); // Random ephemeral key
      
      // c1 = g^k
      const c1 = ec?.g?.mul(k);
      
      // c2 = m * h^k (where h is public key, m is message)
      const sharedSecret = publicKey?.getPublic()?.mul(k);
      const messagePoint = ec?.g?.mul(vote);
      const c2 = messagePoint?.add(sharedSecret);
      
      return {
        c1: c1?.encode('hex'),
        c2: c2?.encode('hex')
      };
    } catch (error) {
      console.error('ElGamal encryption error:', error);
      throw new Error('Failed to encrypt vote');
    }
  },

  /**
   * Decrypt ElGamal encrypted vote
   * @param {Object} ciphertext - { c1, c2 }
   * @param {string} privateKeyHex - Private key in hex format
   * @returns {number} Decrypted vote value
   */
  decrypt(ciphertext, privateKeyHex) {
    try {
      const privateKey = ec?.keyFromPrivate(privateKeyHex, 'hex');
      const c1Point = ec?.curve?.decodePoint(ciphertext?.c1, 'hex');
      const c2Point = ec?.curve?.decodePoint(ciphertext?.c2, 'hex');
      
      // m = c2 - c1^x (where x is private key)
      const sharedSecret = c1Point?.mul(privateKey?.getPrivate());
      const messagePoint = c2Point?.add(sharedSecret?.neg());
      
      // Discrete log to recover vote value (brute force for small values)
      for (let i = 0; i < 100; i++) {
        if (ec?.g?.mul(i)?.eq(messagePoint)) {
          return i;
        }
      }
      
      throw new Error('Failed to recover vote value');
    } catch (error) {
      console.error('ElGamal decryption error:', error);
      throw new Error('Failed to decrypt vote');
    }
  },

  /**
   * Homomorphic addition of encrypted votes
   * @param {Array} encryptedVotes - Array of { c1, c2 } objects
   * @returns {Object} { c1, c2 } - Sum of encrypted votes
   */
  homomorphicAdd(encryptedVotes) {
    try {
      let sumC1 = ec?.curve?.point(null, null);
      let sumC2 = ec?.curve?.point(null, null);
      
      encryptedVotes?.forEach(vote => {
        const c1 = ec?.curve?.decodePoint(vote?.c1, 'hex');
        const c2 = ec?.curve?.decodePoint(vote?.c2, 'hex');
        sumC1 = sumC1?.add(c1);
        sumC2 = sumC2?.add(c2);
      });
      
      return {
        c1: sumC1?.encode('hex'),
        c2: sumC2?.encode('hex')
      };
    } catch (error) {
      console.error('Homomorphic addition error:', error);
      throw new Error('Failed to add encrypted votes');
    }
  }
};

// =====================================================
// ZERO-KNOWLEDGE PROOFS (Schnorr Protocol)
// =====================================================

export const ZeroKnowledgeProof = {
  /**
   * Generate zero-knowledge proof that voter knows their vote
   * @param {string} voteHash - Hash of the vote
   * @param {string} privateKeyHex - Voter's private key
   * @returns {Object} { commitment, challenge, response }
   */
  generateProof(voteHash, privateKeyHex) {
    try {
      const keyPair = ec?.keyFromPrivate(privateKeyHex, 'hex');
      const r = ec?.genKeyPair()?.getPrivate(); // Random nonce
      
      // Commitment: R = g^r
      const commitment = ec?.g?.mul(r)?.encode('hex');
      
      // Challenge: c = H(R || voteHash)
      const challengeData = commitment + voteHash;
      const challenge = CryptoJS?.SHA256(challengeData)?.toString();
      
      // Response: s = r + c*x (mod n)
      const challengeHex = challenge?.substring(0, 64);
      const challengeBN = ec?.genKeyPair()?.getPrivate()?.fromBuffer(Buffer.from(challengeHex, 'hex'));
      const response = r?.add(challengeBN?.mul(keyPair?.getPrivate()))?.umod(ec?.curve?.n);
      
      return {
        commitment,
        challenge,
        response: response?.toString('hex')
      };
    } catch (error) {
      console.error('ZKP generation error:', error);
      throw new Error('Failed to generate zero-knowledge proof');
    }
  },

  /**
   * Verify zero-knowledge proof
   * @param {Object} proof - { commitment, challenge, response }
   * @param {string} voteHash - Hash of the vote
   * @param {string} publicKeyHex - Voter's public key
   * @returns {boolean} True if proof is valid
   */
  verifyProof(proof, voteHash, publicKeyHex) {
    try {
      const publicKey = ec?.keyFromPublic(publicKeyHex, 'hex');
      const R = ec?.curve?.decodePoint(proof?.commitment, 'hex');
      const s = ec?.genKeyPair()?.getPrivate()?.fromBuffer(Buffer.from(proof?.response, 'hex'));
      
      // Verify: g^s = R * Y^c (where Y is public key)
      const challengeHex = proof?.challenge?.substring(0, 64);
      const challengeBN = ec?.genKeyPair()?.getPrivate()?.fromBuffer(Buffer.from(challengeHex, 'hex'));
      const left = ec?.g?.mul(s);
      const right = R?.add(publicKey?.getPublic()?.mul(challengeBN));
      
      // Verify challenge
      const challengeData = proof?.commitment + voteHash;
      const expectedChallenge = CryptoJS?.SHA256(challengeData)?.toString();
      
      return left?.eq(right) && proof?.challenge === expectedChallenge;
    } catch (error) {
      console.error('ZKP verification error:', error);
      return false;
    }
  }
};

// =====================================================
// THRESHOLD CRYPTOGRAPHY (Shamir's Secret Sharing)
// =====================================================

export const ThresholdCrypto = {
  /**
   * Split decryption key among multiple trustees
   * @param {string} secret - Secret key to split
   * @param {number} totalShares - Total number of trustees
   * @param {number} threshold - Minimum trustees needed to decrypt
   * @returns {Array} Array of key shares
   */
  splitSecret(secret, totalShares, threshold) {
    try {
      const secretNum = BigInt('0x' + secret);
      const prime = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
      
      // Generate random coefficients for polynomial
      const coefficients = [secretNum];
      for (let i = 1; i < threshold; i++) {
        const randomCoeff = BigInt('0x' + CryptoJS?.lib?.WordArray?.random(32)?.toString());
        coefficients?.push(randomCoeff % prime);
      }
      
      // Evaluate polynomial at different points
      const shares = [];
      for (let x = 1; x <= totalShares; x++) {
        let y = BigInt(0);
        for (let i = 0; i < coefficients?.length; i++) {
          y = (y + coefficients?.[i] * BigInt(x) ** BigInt(i)) % prime;
        }
        shares?.push({ x, y: y?.toString(16) });
      }
      
      return shares;
    } catch (error) {
      console.error('Secret splitting error:', error);
      throw new Error('Failed to split secret');
    }
  },

  /**
   * Reconstruct secret from threshold shares
   * @param {Array} shares - Array of { x, y } shares
   * @returns {string} Reconstructed secret in hex
   */
  reconstructSecret(shares) {
    try {
      const prime = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
      let secret = BigInt(0);
      
      // Lagrange interpolation
      for (let i = 0; i < shares?.length; i++) {
        let numerator = BigInt(1);
        let denominator = BigInt(1);
        
        for (let j = 0; j < shares?.length; j++) {
          if (i !== j) {
            numerator = (numerator * BigInt(-shares?.[j]?.x)) % prime;
            denominator = (denominator * BigInt(shares?.[i]?.x - shares?.[j]?.x)) % prime;
          }
        }
        
        // Modular inverse
        const denominatorInv = this.modInverse(denominator, prime);
        const lagrangeCoeff = (numerator * denominatorInv) % prime;
        secret = (secret + BigInt('0x' + shares?.[i]?.y) * lagrangeCoeff) % prime;
      }
      
      return secret?.toString(16)?.padStart(64, '0');
    } catch (error) {
      console.error('Secret reconstruction error:', error);
      throw new Error('Failed to reconstruct secret');
    }
  },

  /**
   * Modular multiplicative inverse using Extended Euclidean Algorithm
   */
  modInverse(a, m) {
    a = ((a % m) + m) % m;
    let [oldR, r] = [a, m];
    let [oldS, s] = [BigInt(1), BigInt(0)];
    
    while (r !== BigInt(0)) {
      const quotient = oldR / r;
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
    }
    
    return ((oldS % m) + m) % m;
  }
};

// =====================================================
// MIXNET ANONYMITY LAYER
// =====================================================

export const MixnetCrypto = {
  /**
   * Shuffle encrypted votes with re-encryption (mixnet)
   * @param {Array} encryptedVotes - Array of encrypted votes
   * @param {string} publicKeyHex - Public key for re-encryption
   * @returns {Array} Shuffled and re-encrypted votes
   */
  shuffleVotes(encryptedVotes, publicKeyHex) {
    try {
      // Re-encrypt each vote with random factor
      const reencryptedVotes = encryptedVotes?.map(vote => {
        const randomFactor = ec?.genKeyPair()?.getPrivate();
        const publicKey = ec?.keyFromPublic(publicKeyHex, 'hex');
        
        // Add random encryption layer
        const c1Point = ec?.curve?.decodePoint(vote?.c1, 'hex');
        const c2Point = ec?.curve?.decodePoint(vote?.c2, 'hex');
        
        const newC1 = c1Point?.add(ec?.g?.mul(randomFactor));
        const newC2 = c2Point?.add(publicKey?.getPublic()?.mul(randomFactor));
        
        return {
          c1: newC1?.encode('hex'),
          c2: newC2?.encode('hex'),
          originalHash: vote?.voteHash
        };
      });
      
      // Fisher-Yates shuffle
      for (let i = reencryptedVotes?.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [reencryptedVotes[i], reencryptedVotes[j]] = [reencryptedVotes?.[j], reencryptedVotes?.[i]];
      }
      
      return reencryptedVotes;
    } catch (error) {
      console.error('Mixnet shuffle error:', error);
      throw new Error('Failed to shuffle votes');
    }
  },

  /**
   * Generate proof of correct shuffle (simplified)
   * @param {Array} inputVotes - Original votes
   * @param {Array} outputVotes - Shuffled votes
   * @returns {Object} Shuffle proof
   */
  generateShuffleProof(inputVotes, outputVotes) {
    try {
      // Simplified proof: hash of input and output sets
      const inputHash = CryptoJS?.SHA256(JSON.stringify(inputVotes))?.toString();
      const outputHash = CryptoJS?.SHA256(JSON.stringify(outputVotes))?.toString();
      
      return {
        inputHash,
        outputHash,
        timestamp: Date.now(),
        count: inputVotes?.length
      };
    } catch (error) {
      console.error('Shuffle proof generation error:', error);
      throw new Error('Failed to generate shuffle proof');
    }
  }
};

// =====================================================
// CRYPTOGRAPHIC AUDIT TRAILS
// =====================================================

export const AuditTrail = {
  /**
   * Generate tamper-evident hash chain
   * @param {Array} events - Array of audit events
   * @returns {Array} Events with hash chain
   */
  generateHashChain(events) {
    let previousHash = '0'?.repeat(64);
    
    return events?.map((event, index) => {
      const eventData = JSON.stringify({
        ...event,
        index,
        previousHash,
        timestamp: event?.timestamp || Date.now()
      });
      
      const currentHash = CryptoJS?.SHA256(eventData)?.toString();
      previousHash = currentHash;
      
      return {
        ...event,
        index,
        previousHash: index === 0 ? null : events?.[index - 1]?.hash,
        hash: currentHash
      };
    });
  },

  /**
   * Verify hash chain integrity
   * @param {Array} events - Events with hash chain
   * @returns {boolean} True if chain is valid
   */
  verifyHashChain(events) {
    try {
      for (let i = 0; i < events?.length; i++) {
        const event = events?.[i];
        let previousHash = i === 0 ? '0'?.repeat(64) : events?.[i - 1]?.hash;
        
        const eventData = JSON.stringify({
          ...event,
          index: i,
          previousHash,
          timestamp: event?.timestamp
        });
        
        const expectedHash = CryptoJS?.SHA256(eventData)?.toString();
        
        if (event?.hash !== expectedHash) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Hash chain verification error:', error);
      return false;
    }
  },

  /**
   * Generate Merkle tree root for bulletin board
   * @param {Array} votes - Array of vote hashes
   * @returns {string} Merkle root hash
   */
  generateMerkleRoot(votes) {
    if (votes?.length === 0) return null;
    if (votes?.length === 1) return votes?.[0];
    
    let currentLevel = votes?.map(v => CryptoJS?.SHA256(v)?.toString());
    
    while (currentLevel?.length > 1) {
      const nextLevel = [];
      
      for (let i = 0; i < currentLevel?.length; i += 2) {
        if (i + 1 < currentLevel?.length) {
          const combined = currentLevel?.[i] + currentLevel?.[i + 1];
          nextLevel?.push(CryptoJS?.SHA256(combined)?.toString());
        } else {
          nextLevel?.push(currentLevel?.[i]);
        }
      }
      
      currentLevel = nextLevel;
    }
    
    return currentLevel?.[0];
  },

  /**
   * Generate cryptographic timestamp
   * @param {string} data - Data to timestamp
   * @returns {Object} Timestamp proof
   */
  generateTimestamp(data) {
    const timestamp = Date.now();
    const hash = CryptoJS?.SHA256(data + timestamp)?.toString();
    
    return {
      timestamp,
      hash,
      data: CryptoJS?.SHA256(data)?.toString()
    };
  }
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export const CryptoUtils = {
  /**
   * Generate secure random bytes
   * @param {number} length - Number of bytes
   * @returns {string} Hex string
   */
  randomBytes(length) {
    return CryptoJS?.lib?.WordArray?.random(length)?.toString();
  },

  /**
   * Hash data with SHA-256
   * @param {string} data - Data to hash
   * @returns {string} Hash in hex format
   */
  hash(data) {
    return CryptoJS?.SHA256(data)?.toString();
  },

  /**
   * Generate vote receipt
   * @param {Object} voteData - Vote information
   * @returns {Object} Receipt with cryptographic proofs
   */
  generateVoteReceipt(voteData) {
    const receiptData = {
      voteId: voteData?.voteId,
      electionId: voteData?.electionId,
      timestamp: Date.now(),
      voteHash: this.hash(JSON.stringify(voteData)),
      blockchainHash: voteData?.blockchainHash
    };
    
    const receiptHash = this.hash(JSON.stringify(receiptData));
    
    return {
      ...receiptData,
      receiptHash,
      verificationUrl: `/vote-verification-portal?receipt=${receiptHash}`
    };
  }
};

export default {
  RSACrypto,
  ElGamalCrypto,
  ZeroKnowledgeProof,
  ThresholdCrypto,
  MixnetCrypto,
  AuditTrail,
  CryptoUtils
};