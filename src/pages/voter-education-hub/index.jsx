import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, FileCheck, Key, ChevronRight, ChevronLeft, CheckCircle, Send, Bot, User, Loader, BookOpen, Play } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { securityFeatureAdoptionService } from '../../services/securityFeatureAdoptionService';
import toast from 'react-hot-toast';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';

const TOPICS = [
  {
    id: 'blockchain',
    title: 'Blockchain Verification',
    icon: Shield,
    color: 'from-blue-500 to-blue-700',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
    iconColor: 'text-blue-600',
    steps: [
      { title: 'What is Blockchain?', desc: 'A blockchain is a distributed ledger — a chain of blocks, each containing a batch of vote records. Once written, no block can be altered without changing all subsequent blocks.', animation: 'blocks' },
      { title: 'Immutable Records', desc: 'Every vote is cryptographically hashed and linked to the previous block. Tampering with any vote would break the chain, making fraud immediately detectable.', animation: 'hash' },
      { title: 'Distributed Consensus', desc: 'Multiple independent nodes verify each transaction. A vote is only confirmed when a majority of nodes agree it is valid, eliminating single points of failure.', animation: 'nodes' },
      { title: 'Public Auditability', desc: 'Anyone can inspect the public blockchain ledger to verify election results without revealing individual voter identities — transparency without privacy loss.', animation: 'audit' },
    ],
  },
  {
    id: 'zkp',
    title: 'Zero-Knowledge Proofs',
    icon: Key,
    color: 'from-purple-500 to-purple-700',
    bgLight: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
    iconColor: 'text-purple-600',
    steps: [
      { title: 'The Core Idea', desc: 'A Zero-Knowledge Proof (ZKP) lets you prove you know something — like your eligibility to vote — without revealing the secret itself. You prove the fact, not the data.', animation: 'zkp-intro' },
      { title: 'Proving Eligibility', desc: 'Vottery uses ZKPs so you can prove you are a registered voter without disclosing your identity. The system verifies your eligibility cryptographically, not by checking your name.', animation: 'zkp-eligibility' },
      { title: 'Vote Privacy', desc: 'Your vote is encrypted with a ZKP that proves it is a valid choice (e.g., one of the allowed options) without revealing which option you chose. Privacy is mathematically guaranteed.', animation: 'zkp-privacy' },
      { title: 'Verification Without Exposure', desc: 'Auditors can verify that all votes are valid and counted correctly using ZKP proofs — without ever seeing individual votes. The math does the work, not trust.', animation: 'zkp-verify' },
    ],
  },
  {
    id: 'mcq',
    title: 'MCQ Encryption',
    icon: Lock,
    color: 'from-green-500 to-green-700',
    bgLight: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700',
    iconColor: 'text-green-600',
    steps: [
      { title: 'Why Encrypt MCQ Questions?', desc: 'Multiple-choice questions used in pre-voting quizzes contain sensitive election data. Encrypting them prevents manipulation, leaking of answers, or injection of fraudulent questions.', animation: 'mcq-why' },
      { title: 'End-to-End Encryption', desc: 'MCQ questions are encrypted at rest in the database and in transit. Only authorized election participants with the correct decryption keys can view the question content.', animation: 'mcq-e2e' },
      { title: 'Tamper Detection', desc: 'Each MCQ question carries a cryptographic signature. If any character in the question or answer options is changed, the signature verification fails and the question is rejected.', animation: 'mcq-tamper' },
      { title: 'Secure Delivery', desc: 'Questions are delivered over TLS-encrypted channels with additional payload encryption. Even if network traffic is intercepted, the question content remains unreadable.', animation: 'mcq-delivery' },
    ],
  },
  {
    id: 'receipt',
    title: 'Vote Receipt Validation',
    icon: FileCheck,
    color: 'from-orange-500 to-orange-700',
    bgLight: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-700',
    iconColor: 'text-orange-600',
    steps: [
      { title: 'Your Vote Receipt', desc: 'After voting, you receive a unique cryptographic receipt — a hash that represents your vote without revealing its content. This receipt is your proof of participation.', animation: 'receipt-intro' },
      { title: 'How to Verify', desc: 'Enter your receipt code in the Vote Verification Portal. The system checks the blockchain to confirm your vote was recorded exactly as cast, with no modifications.', animation: 'receipt-verify' },
      { title: 'Anonymity Preserved', desc: 'Your receipt proves your vote exists on the blockchain without linking it to your identity. The cryptographic design ensures verification without de-anonymization.', animation: 'receipt-anon' },
      { title: 'Audit Trail', desc: 'All receipts are part of the public audit trail. Independent auditors can verify the total vote count matches the number of valid receipts, ensuring no votes were added or removed.', animation: 'receipt-audit' },
    ],
  },
];

const AnimatedStep = ({ animation, isActive }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setFrame(f => (f + 1) % 4), 800);
    return () => clearInterval(interval);
  }, [isActive]);

  const blocks = [
    { label: 'Block #1', hash: '0xa3f2...', color: 'bg-blue-500' },
    { label: 'Block #2', hash: '0xb7c1...', color: 'bg-blue-600' },
    { label: 'Block #3', hash: '0xd9e4...', color: 'bg-blue-700' },
  ];

  if (animation === 'blocks' || animation === 'hash') {
    return (
      <div className="flex items-center gap-2 justify-center py-4">
        {blocks?.map((b, i) => (
          <React.Fragment key={i}>
            <div className={`${b?.color} text-white rounded-lg p-3 text-center transition-all duration-500 ${isActive && frame === i ? 'scale-110 shadow-lg' : 'scale-100'}`}>
              <div className="text-xs font-bold">{b?.label}</div>
              <div className="text-xs opacity-75 font-mono">{b?.hash}</div>
            </div>
            {i < blocks?.length - 1 && <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (animation === 'nodes') {
    const nodes = ['Node A', 'Node B', 'Node C', 'Node D'];
    return (
      <div className="grid grid-cols-2 gap-2 py-4 max-w-xs mx-auto">
        {nodes?.map((n, i) => (
          <div key={i} className={`rounded-lg p-2 text-center text-xs font-semibold transition-all duration-500 ${isActive && frame % 4 === i ? 'bg-green-500 text-white scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            ✓ {n}
          </div>
        ))}
      </div>
    );
  }

  if (animation === 'zkp-intro' || animation === 'zkp-eligibility' || animation === 'zkp-privacy' || animation === 'zkp-verify') {
    return (
      <div className="flex items-center justify-center gap-4 py-4">
        <div className={`rounded-xl p-3 text-center transition-all duration-500 ${isActive && frame % 2 === 0 ? 'bg-purple-500 text-white' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'}`}>
          <Key size={20} className="mx-auto mb-1" />
          <div className="text-xs font-semibold">Secret</div>
        </div>
        <div className="text-2xl text-gray-400">→</div>
        <div className={`rounded-xl p-3 text-center transition-all duration-500 ${isActive && frame % 2 === 1 ? 'bg-green-500 text-white' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
          <CheckCircle size={20} className="mx-auto mb-1" />
          <div className="text-xs font-semibold">Proof</div>
        </div>
        <div className="text-2xl text-gray-400">→</div>
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl p-3 text-center">
          <Shield size={20} className="mx-auto mb-1" />
          <div className="text-xs font-semibold">Verified</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {[0, 1, 2]?.map(i => (
        <div key={i} className={`w-10 h-10 rounded-full transition-all duration-500 ${isActive && frame % 3 === i ? 'bg-orange-500 scale-125' : 'bg-gray-200 dark:bg-gray-700'}`} />
      ))}
    </div>
  );
};

const TopicWalkthrough = ({ topic, onComplete }) => {
  const [step, setStep] = useState(0);
  const currentStep = topic?.steps?.[step];
  const TopicIcon = topic?.icon;

  return (
    <div className={`rounded-2xl border ${topic?.borderColor} ${topic?.bgLight} p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 bg-gradient-to-br ${topic?.color} rounded-xl`}>
          <TopicIcon size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{topic?.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Step {step + 1} of {topic?.steps?.length}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-5">
        <div
          className={`h-1.5 rounded-full bg-gradient-to-r ${topic?.color} transition-all duration-500`}
          style={{ width: `${((step + 1) / topic?.steps?.length) * 100}%` }}
        />
      </div>
      <AnimatedStep animation={currentStep?.animation} isActive={true} />
      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">{currentStep?.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">{currentStep?.desc}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex gap-1.5">
          {topic?.steps?.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === step ? `bg-gradient-to-r ${topic?.color} w-5` : 'bg-gray-300 dark:bg-gray-600'}`}
            />
          ))}
        </div>
        {step < topic?.steps?.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className={`flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${topic?.color} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => { setStep(0); onComplete(topic?.id); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircle size={16} /> Complete
          </button>
        )}
      </div>
    </div>
  );
};

const ClaudeChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Vottery education assistant powered by Claude. Ask me anything about blockchain verification, zero-knowledge proofs, MCQ encryption, or vote receipt validation!' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const { response, isLoading, error, sendMessage } = useChat('ANTHROPIC', 'claude-sonnet-4-5-20250929', false);

  useEffect(() => {
    if (error) toast?.error(error?.message);
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      setMessages(prev => {
        const last = prev?.[prev?.length - 1];
        if (last?.role === 'assistant' && last?.content === response) return prev;
        return [...prev?.filter(m => m?.role !== 'assistant' || m?.content !== '...'), { role: 'assistant', content: response }];
      });
    }
  }, [response, isLoading]);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input?.trim() || isLoading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const apiMessages = [
      { role: 'system', content: 'You are a Vottery platform education assistant. Explain blockchain verification, zero-knowledge proofs, MCQ encryption, and vote receipt validation in simple, clear terms. Keep answers concise (2-4 sentences). Use analogies when helpful.' },
      ...messages?.filter(m => m?.role !== 'assistant' || m?.content !== '...')?.map(m => ({ role: m?.role, content: m?.content })),
      { role: 'user', content: input },
    ];
    sendMessage(apiMessages, { temperature: 0.7, max_tokens: 400 });
    setInput('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-96">
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Claude Education Assistant</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ask anything about voting security</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-600 font-medium">Online</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg?.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg?.role === 'assistant' && (
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-xs rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              msg?.role === 'user' ?'bg-indigo-600 text-white rounded-br-sm' :'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
            }`}>
              {msg?.content}
            </div>
            {msg?.role === 'user' && (
              <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-3 py-2">
              <Loader size={14} className="animate-spin text-indigo-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e?.target?.value)}
            onKeyDown={e => e?.key === 'Enter' && handleSend()}
            placeholder="Ask about blockchain, ZKP, encryption..."
            disabled={isLoading}
            className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input?.trim()}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const VoterEducationHub = () => {
  const { user } = useAuth();
  const [activeTopic, setActiveTopic] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(new Set());

  const handleComplete = (topicId) => {
    const next = new Set([...completedTopics, topicId]);
    setCompletedTopics(next);
    setActiveTopic(null);
    securityFeatureAdoptionService?.recordVoterEducationCompletion?.(user?.id, topicId, next?.size)?.catch(() => null);
    toast?.success('Topic completed! Great learning!');
  };

  return (
    <GeneralPageLayout title="Voter Education" showSidebar={true}>
      <div className="w-full py-0">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              Knowledge Hub
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl">
              Understand the cryptographic foundation of Vottery. Learn how we protect your vote, your identity, and the integrity of every election.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery Level</span>
              <span className="text-sm font-black text-white">{completedTopics?.size}/{TOPICS?.length}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 border border-white/5 p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000 shadow-lg shadow-indigo-500/20"
                style={{ width: `${(completedTopics?.size / TOPICS?.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {!activeTopic && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {TOPICS?.map(topic => {
                  const TopicIcon = topic?.icon;
                  const isCompleted = completedTopics?.has(topic?.id);
                  return (
                    <button
                      key={topic?.id}
                      onClick={() => setActiveTopic(topic?.id)}
                      className="text-left premium-glass rounded-3xl border border-white/10 p-8 transition-all hover:border-primary/50 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TopicIcon size={80} />
                      </div>
                      
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className={`w-14 h-14 bg-gradient-to-br ${topic?.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <TopicIcon size={24} className="text-white" />
                        </div>
                        {isCompleted && (
                          <div className="flex items-center gap-2 bg-green-500/20 text-green-500 px-4 py-1.5 rounded-full border border-green-500/30">
                            <CheckCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Mastered</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight relative z-10">{topic?.title}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 relative z-10">{topic?.steps?.length} Interactive Modules</p>
                      
                      <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-4 transition-all relative z-10">
                        <span>Begin Sequence</span>
                        <ChevronRight size={14} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTopic && (() => {
              const topic = TOPICS?.find(t => t?.id === activeTopic);
              return (
                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                  <button
                    onClick={() => setActiveTopic(null)}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all mb-8"
                  >
                    <ChevronLeft size={16} /> Back to Hub
                  </button>
                  <TopicWalkthrough topic={topic} onComplete={handleComplete} />
                </div>
              );
            })()}

            {!activeTopic && (
              <div className="premium-glass rounded-3xl border border-white/10 p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Security Schematics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Blockchain', value: 'Immutable distributed ledger recording all votes.', icon: Shield, color: 'text-blue-500' },
                    { label: 'ZKP', value: 'Prove eligibility without revealing identity.', icon: Key, color: 'text-purple-500' },
                    { label: 'Encryption', value: 'Questions encrypted end-to-end with signatures.', icon: Lock, color: 'text-green-500' },
                    { label: 'Receipt', value: 'Cryptographic proof your vote was counted.', icon: FileCheck, color: 'text-orange-500' },
                  ]?.map((item, i) => {
                    const ItemIcon = item?.icon;
                    return (
                      <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                        <ItemIcon size={18} className={`${item?.color} mt-1 flex-shrink-0 group-hover:scale-110 transition-transform`} />
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item?.label}</p>
                          <p className="text-xs font-medium text-slate-500 leading-relaxed">{item?.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
              <ClaudeChatbot />
            </div>
            
            <div className="premium-glass rounded-3xl p-8 border border-indigo-500/20 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                  <Bot size={18} className="text-indigo-500" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Suggested Queries</h4>
              </div>
              
              <div className="space-y-3">
                {[
                  'How does blockchain prevent vote tampering?',
                  'What is a zero-knowledge proof?',
                  'How do I verify my vote receipt?',
                  'Why are MCQ questions encrypted?',
                ]?.map((q, i) => (
                  <button key={i} className="w-full text-left p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default VoterEducationHub;
