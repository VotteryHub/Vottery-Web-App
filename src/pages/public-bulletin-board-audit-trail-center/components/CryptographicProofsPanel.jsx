import React, { useState } from 'react';
import { Lock, Download, CheckCircle, Code } from 'lucide-react';
import { RSACrypto, ElGamalCrypto, ZeroKnowledgeProof, AuditTrail } from '../../../services/cryptographyService';

const CryptographicProofsPanel = () => {
  const [selectedProofType, setSelectedProofType] = useState('rsa');
  const [proofData, setProofData] = useState(null);

  const generateSampleProof = () => {
    let proof;

    switch (selectedProofType) {
      case 'rsa':
        const rsaKeys = RSACrypto?.generateKeyPair();
        const sampleData = 'Sample vote data for demonstration';
        const encrypted = RSACrypto?.encrypt(sampleData, rsaKeys?.publicKey);
        const signature = RSACrypto?.sign(sampleData, rsaKeys?.privateKey);
        proof = {
          type: 'RSA Encryption & Signature',
          publicKey: rsaKeys?.publicKey?.substring(0, 100) + '...',
          encryptedData: encrypted?.substring(0, 100) + '...',
          signature: signature?.substring(0, 100) + '...',
          verified: RSACrypto?.verify(sampleData, signature, rsaKeys?.publicKey)
        };
        break;

      case 'elgamal':
        const elgamalKeys = ElGamalCrypto?.generateKeyPair();
        const vote = 1;
        const encryptedVote = ElGamalCrypto?.encrypt(vote, elgamalKeys?.publicKey);
        proof = {
          type: 'ElGamal Homomorphic Encryption',
          publicKey: elgamalKeys?.publicKey?.substring(0, 100) + '...',
          c1: encryptedVote?.c1?.substring(0, 100) + '...',
          c2: encryptedVote?.c2?.substring(0, 100) + '...',
          homomorphic: 'Supports vote tallying without decryption'
        };
        break;

      case 'zkp':
        const zkpKeys = ElGamalCrypto?.generateKeyPair();
        const voteHash = AuditTrail?.generateTimestamp('vote-data')?.hash;
        const zkProof = ZeroKnowledgeProof?.generateProof(voteHash, zkpKeys?.privateKey);
        proof = {
          type: 'Zero-Knowledge Proof (Schnorr Protocol)',
          commitment: zkProof?.commitment?.substring(0, 100) + '...',
          challenge: zkProof?.challenge?.substring(0, 100) + '...',
          response: zkProof?.response?.substring(0, 100) + '...',
          verified: ZeroKnowledgeProof?.verifyProof(zkProof, voteHash, zkpKeys?.publicKey)
        };
        break;

      case 'merkle':
        const votes = ['vote1', 'vote2', 'vote3', 'vote4', 'vote5'];
        const merkleRoot = AuditTrail?.generateMerkleRoot(votes);
        proof = {
          type: 'Merkle Tree Root',
          totalVotes: votes?.length,
          merkleRoot: merkleRoot,
          purpose: 'Efficient verification of vote inclusion'
        };
        break;

      default:
        proof = null;
    }

    setProofData(proof);
  };

  const downloadProof = () => {
    if (!proofData) return;

    const dataStr = JSON.stringify(proofData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cryptographic-proof-${selectedProofType}-${Date.now()}.json`;
    link?.click();
  };

  const proofTypes = [
    { id: 'rsa', name: 'RSA Encryption', description: 'Public-key cryptography for vote encryption' },
    { id: 'elgamal', name: 'ElGamal Homomorphic', description: 'Tally votes without decryption' },
    { id: 'zkp', name: 'Zero-Knowledge Proofs', description: 'Verify without revealing vote content' },
    { id: 'merkle', name: 'Merkle Tree', description: 'Efficient vote inclusion verification' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cryptographic Proofs</h2>
          <p className="text-gray-600">Downloadable cryptographic proofs and mathematical verification tools</p>
        </div>
        <Lock className="w-12 h-12 text-indigo-600" />
      </div>

      {/* Proof Type Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {proofTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => {
              setSelectedProofType(type?.id);
              setProofData(null);
            }}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedProofType === type?.id
                ? 'border-indigo-600 bg-indigo-50' :'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-1">{type?.name}</h3>
            <p className="text-sm text-gray-600">{type?.description}</p>
          </button>
        ))}
      </div>

      {/* Generate Proof Button */}
      <div className="mb-6">
        <button
          onClick={generateSampleProof}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Code className="w-5 h-5" />
          <span>Generate Sample Proof</span>
        </button>
      </div>

      {/* Proof Display */}
      {proofData && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{proofData?.type}</h3>
            <button
              onClick={downloadProof}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(proofData)?.map(([key, value]) => {
              if (key === 'type') return null;
              return (
                <div key={key} className="bg-white rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}
                      </p>
                      <p className="text-sm font-mono text-gray-900 break-all">
                        {typeof value === 'boolean' ? (
                          <span className={value ? 'text-green-600' : 'text-red-600'}>
                            {value ? '✓ Verified' : '✗ Failed'}
                          </span>
                        ) : (
                          value
                        )}
                      </p>
                    </div>
                    {typeof value === 'boolean' && value && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cryptographic Methods Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">RSA Encryption</h4>
          <p className="text-sm text-blue-800">
            2048-bit RSA encryption ensures vote confidentiality. Each vote is encrypted with the election authority's public key, ensuring only authorized parties can decrypt results.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Homomorphic Encryption</h4>
          <p className="text-sm text-green-800">
            ElGamal encryption allows votes to be tallied without decryption, preserving voter privacy throughout the counting process while ensuring accurate results.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">Zero-Knowledge Proofs</h4>
          <p className="text-sm text-purple-800">
            Schnorr protocol enables voters to prove their vote was recorded correctly without revealing their choice, ensuring both privacy and verifiability.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Merkle Trees</h4>
          <p className="text-sm text-yellow-800">
            Merkle tree structures provide efficient verification of vote inclusion in the final tally, allowing anyone to verify their vote was counted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptographicProofsPanel;