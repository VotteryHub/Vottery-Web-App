import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const SlotMachine3D = ({ election }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState(['0', '0', '0', '0', '0', '0']);
  const [winners, setWinners] = useState([]);
  const [showWinners, setShowWinners] = useState(false);
  const audioContextRef = useRef(null);

  const isElectionEnded = election?.status === 'completed' || 
    (election?.endDate && new Date(election?.endDate) < new Date());
  const hasVoters = election?.totalVoters >= 2;
  const shouldSpin = hasVoters && !isElectionEnded;

  useEffect(() => {
    if (shouldSpin) {
      startSpinning();
    } else if (isElectionEnded && election?.winnerNotifications?.length > 0) {
      setWinners(election?.winnerNotifications);
      setShowWinners(true);
    }
  }, [shouldSpin, isElectionEnded]);

  const playBeep = () => {
    if (!audioContextRef?.current) {
      audioContextRef.current = new (window?.AudioContext || window?.webkitAudioContext)();
    }
    
    const ctx = audioContextRef?.current;
    const oscillator = ctx?.createOscillator();
    const gainNode = ctx?.createGain();
    
    oscillator?.connect(gainNode);
    gainNode?.connect(ctx?.destination);
    
    oscillator?.frequency?.setValueAtTime(800, ctx?.currentTime);
    gainNode?.gain?.setValueAtTime(0.1, ctx?.currentTime);
    gainNode?.gain?.exponentialRampToValueAtTime(0.01, ctx?.currentTime + 0.1);
    
    oscillator?.start(ctx?.currentTime);
    oscillator?.stop(ctx?.currentTime + 0.1);
  };

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10)?.toString();
  };

  const startSpinning = () => {
    setIsSpinning(true);
    
    const interval = setInterval(() => {
      setDisplayNumbers(prev => prev?.map(() => generateRandomNumber()));
      playBeep();
    }, 100);

    return () => clearInterval(interval);
  };

  const revealWinner = async (winnerIndex) => {
    const winner = winners?.[winnerIndex];
    if (!winner) return;

    // Animate to winner's voter ID
    const voterIdDigits = winner?.lotteryTicketId?.replace(/[^0-9]/g, '')?.split('') || [];
    const paddedDigits = voterIdDigits?.slice(0, 6)?.concat(Array(6 - voterIdDigits?.length)?.fill('0'));
    
    setDisplayNumbers(paddedDigits);
    setIsSpinning(false);
    
    // Play celebration sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playBeep(), i * 100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Sparkles" size={28} className="text-primary" />
          3D Slot Machine - Gamified Drawing
        </h2>
        <p className="text-muted-foreground mb-6">
          {shouldSpin ? 'Spinning until election ends...' : isElectionEnded ?'Election ended - Winners revealed!': 'Waiting for at least 2 voters to start spinning'}
        </p>

        <div className="relative">
          {/* Slot Machine Display */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border-4 border-yellow-500/50">
            <div className="flex justify-between items-center mb-6">
              <div className="text-yellow-400 font-bold text-sm">
                <Icon name="Calendar" size={16} className="inline mr-2" />
                {election?.endDate ? new Date(election?.endDate)?.toLocaleDateString() : 'TBD'}
                {election?.endTime && ` ${election?.endTime}`}
              </div>
              <div className="text-yellow-400 font-bold text-sm">
                <Icon name="Users" size={16} className="inline mr-2" />
                {election?.numberOfWinners || 1} Winner{election?.numberOfWinners > 1 ? 's' : ''}
              </div>
            </div>

            {/* Number Display */}
            <div className="flex justify-center gap-2 mb-6">
              {displayNumbers?.map((digit, index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: isSpinning ? [0, -10, 0] : 0,
                    scale: isSpinning ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: isSpinning ? Infinity : 0,
                    delay: index * 0.05
                  }}
                  className="w-16 h-24 bg-gradient-to-b from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg border-2 border-red-400/50"
                >
                  <span className="text-5xl font-bold text-white font-mono">{digit}</span>
                </motion.div>
              ))}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-3">
              {isSpinning && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
              )}
              <span className={`text-sm font-medium ${
                isSpinning ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {isSpinning ? 'SPINNING...' : isElectionEnded ? 'DRAWING COMPLETE' : 'WAITING'}
              </span>
            </div>
          </div>

          {/* Prize Pool Display */}
          {election?.prizePool && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border-2 border-yellow-500/30"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Prize Pool</p>
                <p className="text-3xl font-bold text-yellow-500 font-data">{election?.prizePool}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      {/* Winners Display */}
      <AnimatePresence>
        {showWinners && winners?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card p-6"
          >
            <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Trophy" size={24} className="text-yellow-500" />
              Lucky Voter Winners
            </h3>
            <div className="space-y-3">
              {winners?.map((winner, index) => (
                <motion.div
                  key={winner?.lotteryTicketId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20"
                >
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    #{winner?.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{winner?.userName}</h4>
                    <p className="text-xs text-muted-foreground">Ticket: {winner?.lotteryTicketId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Prize</p>
                    <p className="text-lg font-bold text-yellow-500 font-data">
                      {election?.prizePool ? 
                        `$${(parseFloat(election?.prizePool?.replace(/[^0-9.]/g, '')) / winners?.length)?.toFixed(2)}` :
                        'TBD'
                      }
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => revealWinner(0)}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
            >
              <Icon name="Play" size={16} className="inline mr-2" />
              Replay Winner Reveal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="card p-6 bg-primary/10 border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-2">How It Works</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Slot machine starts spinning after 2 voters participate</li>
              <li>• Numbers displayed are from unique Voter ID numbers</li>
              <li>• At election end date/time, winners are automatically selected</li>
              <li>• Winners revealed one by one in ranking order (1st, 2nd, 3rd...)</li>
              <li>• Each winner receives equal share of prize pool</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine3D;