import React, { useState, useEffect } from 'react';


import { CheckCircle, ChevronRight, User, CreditCard, Star, BookOpen, Trophy } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const STEPS = [
  { id: 1, label: 'Profile Completion', icon: User },
  { id: 2, label: 'Payout Setup', icon: CreditCard },
  { id: 3, label: 'Tier Selection', icon: Star },
  { id: 4, label: 'Content Guidelines', icon: BookOpen },
  { id: 5, label: 'First Election', icon: Trophy },
];

const OnboardingWorkflow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    category: '',
    payoutEmail: '',
    payoutMethod: 'stripe',
    selectedTier: 'bronze',
    agreedToGuidelines: false,
    electionTitle: '',
  });

  const handleNext = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Complete Your Creator Profile</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Display Name</label>
              <input
                type="text"
                value={formData?.displayName}
                onChange={e => setFormData(p => ({ ...p, displayName: e?.target?.value }))}
                placeholder="Your creator name"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio</label>
              <textarea
                value={formData?.bio}
                onChange={e => setFormData(p => ({ ...p, bio: e?.target?.value }))}
                placeholder="Tell voters about yourself..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                value={formData?.category}
                onChange={e => setFormData(p => ({ ...p, category: e?.target?.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a category</option>
                <option value="politics">Politics</option>
                <option value="entertainment">Entertainment</option>
                <option value="sports">Sports</option>
                <option value="technology">Technology</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Configure Payout Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              {['stripe', 'bank_transfer', 'paypal', 'crypto']?.map(method => (
                <button
                  key={method}
                  onClick={() => setFormData(p => ({ ...p, payoutMethod: method }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData?.payoutMethod === method
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' :'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {method === 'stripe' ? 'Stripe Connect' : method === 'bank_transfer' ? 'Bank Transfer' : method === 'paypal' ? 'PayPal' : 'Crypto'}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Payout Email</label>
              <input
                type="email"
                value={formData?.payoutEmail}
                onChange={e => setFormData(p => ({ ...p, payoutEmail: e?.target?.value }))}
                placeholder="payout@example.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            {formData?.payoutMethod === 'stripe' && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-400 text-sm">Stripe Connect will be linked after completing onboarding. You'll receive a secure link to connect your bank account.</p>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Select Your Subscription Tier</h3>
            <div className="space-y-3">
              {[
                { id: 'bronze', label: 'Bronze', price: '$9/mo', features: ['5 elections/month', 'Basic analytics', 'Standard support'] },
                { id: 'silver', label: 'Silver', price: '$29/mo', features: ['20 elections/month', 'Advanced analytics', 'Priority support'] },
                { id: 'gold', label: 'Gold', price: '$79/mo', features: ['Unlimited elections', 'Full analytics suite', 'Dedicated support'] },
              ]?.map(tier => (
                <button
                  key={tier?.id}
                  onClick={() => setFormData(p => ({ ...p, selectedTier: tier?.id }))}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    formData?.selectedTier === tier?.id
                      ? 'border-amber-500 bg-amber-500/10' :'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{tier?.label}</span>
                    <span className="text-amber-400 font-bold">{tier?.price}</span>
                  </div>
                  <ul className="space-y-1">
                    {tier?.features?.map(f => (
                      <li key={f} className="text-gray-400 text-sm flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />{f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Content Guidelines</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
              {[
                'Elections must be factual and not misleading',
                'No hate speech, discrimination, or harassment',
                'Sponsored content must be clearly labeled',
                'Voter data must be handled per privacy policy',
                'MCQ questions must have verifiable correct answers',
                'Prize distributions must comply with local regulations',
                'Content must be appropriate for all ages unless age-gated',
              ]?.map((guideline, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{guideline}</p>
                </div>
              ))}
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.agreedToGuidelines}
                onChange={e => setFormData(p => ({ ...p, agreedToGuidelines: e?.target?.checked }))}
                className="w-4 h-4 rounded border-gray-600"
              />
              <span className="text-gray-300 text-sm">I agree to the content guidelines and terms of service</span>
            </label>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Create Your First Election</h3>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-400 text-sm">Launch your first election to start earning! You can always create more from the Elections Dashboard.</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Election Title</label>
              <input
                type="text"
                value={formData?.electionTitle}
                onChange={e => setFormData(p => ({ ...p, electionTitle: e?.target?.value }))}
                placeholder="What should voters decide?"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Politics', 'Entertainment', 'Sports']?.map(cat => (
                <button key={cat} className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm hover:border-blue-500 hover:text-blue-400 transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8">
        {STEPS?.map((step, idx) => {
          const Icon = step?.icon;
          const isCompleted = completedSteps?.includes(step?.id);
          const isCurrent = currentStep === step?.id;
          return (
            <React.Fragment key={step?.id}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted ? 'bg-green-500 border-green-500' : isCurrent ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-800 border-gray-700'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : <Icon className={`w-5 h-5 ${isCurrent ? 'text-blue-400' : 'text-gray-500'}`} />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isCurrent ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                }`}>{step?.label}</span>
              </div>
              {idx < STEPS?.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  completedSteps?.includes(step?.id) ? 'bg-green-500' : 'bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Step Content */}
      <div className="min-h-64">{renderStepContent()}</div>
      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
        <button
          onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Back
        </button>
        <div className="flex items-center gap-2">
          {STEPS?.map(s => (
            <div key={s?.id} className={`w-2 h-2 rounded-full ${
              s?.id === currentStep ? 'bg-blue-500' : completedSteps?.includes(s?.id) ? 'bg-green-500' : 'bg-gray-700'
            }`} />
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentStep === 4 && !formData?.agreedToGuidelines}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {currentStep === 5 ? 'Complete Setup' : 'Continue'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingWorkflow;
