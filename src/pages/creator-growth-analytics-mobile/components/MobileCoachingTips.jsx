import React, { useState } from 'react';
import { ChevronRight, Brain } from 'lucide-react';

const TIPS = [
  { id: 1, category: 'Growth', tip: 'Post 3-5 carousels per week to maintain Gold tier momentum', priority: 'high', icon: '📈' },
  { id: 2, category: 'Earnings', tip: 'Gradient Flow carousels earn 31% more — increase their share', priority: 'high', icon: '💰' },
  { id: 3, category: 'Retention', tip: 'Engage with comments within 2 hours to boost algorithm ranking', priority: 'medium', icon: '💬' },
  { id: 4, category: 'Templates', tip: 'Your top template has 89% reuse rate — create a sequel', priority: 'medium', icon: '🎨' }
];

const MobileCoachingTips = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={18} className="text-purple-400" />
        <p className="text-white font-bold">AI Coaching Tips</p>
      </div>
      <div className="space-y-2">
        {TIPS?.map(tip => (
          <button
            key={tip?.id}
            onClick={() => setExpanded(expanded === tip?.id ? null : tip?.id)}
            className="w-full text-left bg-gray-800/50 hover:bg-gray-800 rounded-xl p-3 transition-colors touch-manipulation active:scale-98"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{tip?.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-gray-400 text-xs">{tip?.category}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    tip?.priority === 'high' ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'
                  }`}>{tip?.priority}</span>
                </div>
                <p className={`text-gray-300 text-sm ${expanded === tip?.id ? '' : 'truncate'}`}>{tip?.tip}</p>
              </div>
              <ChevronRight size={14} className={`text-gray-600 flex-shrink-0 transition-transform ${expanded === tip?.id ? 'rotate-90' : ''}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileCoachingTips;
