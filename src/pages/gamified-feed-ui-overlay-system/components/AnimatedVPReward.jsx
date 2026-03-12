import React, { useEffect, useState } from 'react';
import { Coins, Zap, TrendingUp } from 'lucide-react';

const AnimatedVPReward = ({ amount, source }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-bounce-in">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
          <Coins className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="text-2xl font-bold">+{amount} VP</span>
          </div>
          <p className="text-xs text-white/90">{source}</p>
        </div>
        <TrendingUp className="w-5 h-5 animate-pulse" />
      </div>
    </div>
  );
};

export default AnimatedVPReward;