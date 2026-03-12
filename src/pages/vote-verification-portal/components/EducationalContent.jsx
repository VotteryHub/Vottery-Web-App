import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EducationalContent = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'how-it-works',
      title: 'How Vote Verification Works',
      icon: 'Info',
      content: `When you cast a vote, the system generates a unique cryptographic receipt (Vote ID) that serves as your verification key. This receipt is linked to your vote through a zero-knowledge proof - a mathematical method that proves your vote exists without revealing what you voted for.\n\nThe verification process checks three key elements:\n1. Your Vote ID matches a transaction on the blockchain\n2. The zero-knowledge proof validates authenticity\n3. The hash chain confirms the vote hasn't been tampered with\n\nAll of this happens while keeping your actual vote choices completely private and anonymous.`
    },
    {
      id: 'zkp-explained',title: 'Zero-Knowledge Proofs Explained',icon: 'Shield',
      content: `Zero-knowledge proofs (ZKPs) are cryptographic methods that allow one party to prove they know something without revealing what that something is.\n\nIn voting context:\n• You prove you cast a valid vote\n• Without revealing who you voted for\n• The blockchain verifies the proof mathematically\n• Your ballot remains completely anonymous\n\nThink of it like proving you know a password without typing it out - the system confirms you're legitimate without exposing your secret.`
    },
    {
      id: 'blockchain-security',
      title: 'Blockchain Security Measures',
      icon: 'Lock',
      content: `Every vote is recorded on an immutable blockchain ledger with multiple security layers:\n\n• SHA-256 Hashing: Creates unique fingerprints for each vote\n• Digital Signatures: Proves vote authenticity\n• Hash Chains: Links votes in tamper-evident sequences\n• Smart Contracts: Automates verification without human intervention\n• Distributed Consensus: Multiple nodes validate each transaction\n\nOnce recorded, votes cannot be altered, deleted, or manipulated - providing permanent, verifiable proof of election integrity.`
    },
    {
      id: 'privacy-protection',
      title: 'Privacy Protection Mechanisms',
      icon: 'Eye',
      content: `Vottery employs multiple privacy-preserving technologies:\n\n• End-to-End Encryption: Votes encrypted from submission to storage\n• Mixnets: Shuffle votes to break sender-receiver links\n• Anonymous Credentials: Verify eligibility without identity exposure\n• Separation of Concerns: Vote content stored separately from voter identity\n• Zero-Knowledge Proofs: Verify without revealing\n\nThese combined measures ensure that while every vote is verifiable, no one - not even system administrators - can link a specific vote to a specific voter.`
    }
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="BookOpen" size={20} color="var(--color-secondary)" />
        </div>
        <h3 className="text-lg md:text-xl font-heading font-bold text-foreground">
          Understanding Vote Verification
        </h3>
      </div>
      <div className="space-y-3">
        {sections?.map((section) => (
          <div key={section?.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section?.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted transition-all duration-250"
            >
              <div className="flex items-center gap-3">
                <Icon name={section?.icon} size={20} className="text-primary" />
                <span className="text-sm md:text-base font-heading font-semibold text-foreground">
                  {section?.title}
                </span>
              </div>
              <Icon 
                name="ChevronDown" 
                size={20} 
                className={`text-muted-foreground transition-transform duration-250 ${
                  expandedSection === section?.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedSection === section?.id && (
              <div className="px-4 pb-4 pt-2 bg-muted/50">
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section?.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-start gap-3">
          <Icon name="HelpCircle" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-medium text-foreground">Need More Help?</span> Visit our comprehensive help center or contact our support team for assistance with vote verification.
            </p>
            <button className="text-sm font-medium text-primary hover:underline">
              Visit Help Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalContent;