import React, { useState, useEffect } from 'react';
import { Megaphone, DollarSign, Clock, CheckCircle, Send } from 'lucide-react';


const MOCK_OPPORTUNITIES = [
  { id: 1, brand: 'TechCorp Inc.', category: 'Technology', budget: '$500-$2,000', deadline: '2026-03-15', description: 'Seeking election creators for product launch campaign targeting tech enthusiasts.', status: 'open', requirements: ['Min 1K voters/election', 'Tech category', 'Gold tier+'] },
  { id: 2, brand: 'SportsBrand', category: 'Sports', budget: '$300-$1,500', deadline: '2026-03-20', description: 'Sports equipment brand looking for election creators to run fan polls.', status: 'open', requirements: ['Sports category', 'Silver tier+', 'Min 500 voters'] },
  { id: 3, brand: 'MediaCo', category: 'Entertainment', budget: '$1,000-$5,000', deadline: '2026-04-01', description: 'Major media company seeking creators for entertainment voting campaigns.', status: 'applied', requirements: ['Entertainment category', 'Platinum tier', 'Min 5K voters'] },
  { id: 4, brand: 'FinanceApp', category: 'Finance', budget: '$800-$3,000', deadline: '2026-03-25', description: 'Fintech startup seeking election creators for financial literacy campaigns.', status: 'open', requirements: ['Any category', 'Gold tier+', 'Min 2K voters'] },
];

const SponsorshipOpportunities = () => {
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
  const [applying, setApplying] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleApply = async (id) => {
    setApplying(id);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setOpportunities(prev => prev?.map(o => o?.id === id ? { ...o, status: 'applied' } : o));
    setApplying(null);
  };

  const filtered = filter === 'all' ? opportunities : opportunities?.filter(o => o?.status === filter);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Megaphone className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Sponsorship Opportunities</h2>
            <p className="text-gray-400 text-sm">Browse and apply for brand sponsorships</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'open', 'applied']?.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {filtered?.map(opp => (
          <div key={opp?.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold">{opp?.brand}</span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{opp?.category}</span>
                  {opp?.status === 'applied' && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />Applied
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{opp?.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-green-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">{opp?.budget}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Deadline: {opp?.deadline}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {opp?.requirements?.map((req, i) => (
                    <span key={i} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">{req}</span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                {opp?.status === 'applied' ? (
                  <div className="flex items-center gap-1.5 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Applied</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(opp?.id)}
                    disabled={applying === opp?.id}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {applying === opp?.id ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorshipOpportunities;
