import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { motion } from 'framer-motion';

const JackpotDisplay = ({
  prizePool,
  numberOfWinners,
  totalVoters,
  endDate,
  endTime
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!endDate || !endTime) return;

    const updateTimer = () => {
      const endDateTime = new Date(`${endDate}T${endTime}`);
      const now = new Date();
      const diff = endDateTime - now;

      if (diff <= 0) {
        setIsEnded(true);
        setTimeRemaining('Drawing in progress...');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate, endTime]);

  const prizeAmount = prizePool ? parseFloat(prizePool?.replace(/[^0-9.]/g, '')) : 0;
  const prizePerWinner = numberOfWinners > 0 ? prizeAmount / numberOfWinners : 0;

  return (
    <div className="card bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-1 shadow-2xl">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6">
        {/* Jackpot Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="inline-flex items-center gap-2 mb-2"
          >
            <Icon name="Sparkles" size={24} className="text-yellow-400" />
            <h2 className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400">
              JACKPOT
            </h2>
            <Icon name="Sparkles" size={24} className="text-yellow-400" />
          </motion.div>
        </div>

        {/* Prize Pool Display */}
        <div className="bg-black/50 rounded-xl p-6 mb-4 border-2 border-yellow-500/30">
          <p className="text-center text-white/70 text-sm mb-2">Total Prize Pool</p>
          <motion.p
            animate={{ 
              textShadow: [
                '0 0 20px rgba(250, 204, 21, 0.5)',
                '0 0 40px rgba(250, 204, 21, 0.8)',
                '0 0 20px rgba(250, 204, 21, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 font-data"
          >
            {prizePool || '$0'}
          </motion.p>
        </div>

        {/* Prize Breakdown */}
        <div className="space-y-3 mb-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Trophy" size={18} className="text-yellow-400" />
                <span className="text-sm text-white/70">Per Winner:</span>
              </div>
              <span className="text-lg font-heading font-bold text-green-400 font-data">
                ${prizePerWinner?.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Users" size={18} className="text-blue-400" />
                <span className="text-sm text-white/70">Total Winners:</span>
              </div>
              <span className="text-lg font-heading font-bold text-blue-400 font-data">
                {numberOfWinners || 0}
              </span>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Vote" size={18} className="text-purple-400" />
                <span className="text-sm text-white/70">Participants:</span>
              </div>
              <span className="text-lg font-heading font-bold text-purple-400 font-data">
                {totalVoters || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg p-4 border border-red-500/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="Clock" size={20} className="text-red-400" />
            <span className="text-sm text-white/70">
              {isEnded ? 'Status:' : 'Time Remaining:'}
            </span>
          </div>
          <motion.p
            animate={isEnded ? { 
              scale: [1, 1.1, 1],
              color: ['#fbbf24', '#f59e0b', '#fbbf24']
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-center text-2xl font-heading font-bold text-white font-data"
          >
            {timeRemaining || 'Calculating...'}
          </motion.p>
        </div>

        {/* Excitement Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Excitement Level</span>
            <span className="text-xs text-yellow-400 font-bold">MAX!</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JackpotDisplay;