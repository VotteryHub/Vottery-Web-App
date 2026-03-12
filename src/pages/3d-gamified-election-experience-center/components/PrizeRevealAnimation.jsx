import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { motion, AnimatePresence } from 'framer-motion';

const PrizeRevealAnimation = ({
  winner,
  prizePool,
  totalWinners,
  currentIndex,
  onNext,
  soundEnabled
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRevealed(true);
      setShowConfetti(true);
      if (soundEnabled) {
        playWinSound();
      }
    }, 500);
  }, [winner, soundEnabled]);

  const playWinSound = () => {
    const audioContext = new (window?.AudioContext || window?.webkitAudioContext)();
    const oscillator = audioContext?.createOscillator();
    const gainNode = audioContext?.createGain();

    oscillator?.connect(gainNode);
    gainNode?.connect(audioContext?.destination);

    oscillator.frequency.value = 1200;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.2;

    oscillator?.start(audioContext?.currentTime);
    oscillator?.stop(audioContext?.currentTime + 0.3);
  };

  const prizeAmount = prizePool ? `$${(parseFloat(prizePool?.replace(/[^0-9.]/g, '')) / totalWinners)?.toFixed(2)}` : 'Prize';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
      >
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)]?.map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * window?.innerWidth, opacity: 1 }}
                animate={{ 
                  y: window?.innerHeight + 100, 
                  rotate: Math.random() * 360,
                  opacity: 0
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  delay: Math.random() * 0.5,
                  ease: 'easeOut'
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']?.[Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}

        {/* Prize Box */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="relative z-10 max-w-2xl w-full mx-4"
        >
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12">
              {/* Rank Badge */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-16 h-16 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl font-heading font-bold text-white">#{winner?.rank}</span>
                </div>
              </motion.div>

              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: revealed ? 1 : 0 }}
                transition={{ type: 'spring', delay: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
                  <Icon name="Trophy" size={48} className="text-white" />
                </div>
              </motion.div>

              {/* Congratulations Text */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-4xl md:text-5xl font-heading font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 mb-4"
                style={{
                  textShadow: '0 0 30px rgba(250, 204, 21, 0.5)'
                }}
              >
                🎉 Congratulations! 🎉
              </motion.h2>

              {/* Winner Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col items-center gap-4 mb-6"
              >
                <Image
                  src={winner?.userAvatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={`${winner?.userName} profile picture`}
                  className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-lg"
                />
                <div className="text-center">
                  <h3 className="text-2xl font-heading font-bold text-white mb-1">{winner?.userName}</h3>
                  <p className="text-yellow-400 font-medium">Lucky Winner #{winner?.rank}</p>
                </div>
              </motion.div>

              {/* Prize Amount */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: revealed ? 1 : 0 }}
                transition={{ type: 'spring', delay: 1.1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-center shadow-xl"
              >
                <p className="text-white/80 text-sm mb-2">Prize Amount</p>
                <p className="text-5xl font-heading font-bold text-white font-data">{prizeAmount}</p>
              </motion.div>

              {/* Lottery Ticket ID */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Winning Ticket ID:</span>
                  <span className="text-yellow-400 font-heading font-bold font-data text-lg">{winner?.lotteryTicketId}</span>
                </div>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center mb-6"
              >
                <p className="text-white/60 text-sm">
                  Winner {currentIndex + 1} of {totalWinners}
                </p>
                <div className="flex gap-2 justify-center mt-2">
                  {[...Array(totalWinners)]?.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i <= currentIndex ? 'bg-yellow-400' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Next Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.7 }}
                onClick={onNext}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-heading font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {currentIndex < totalWinners - 1 ? 'Next Winner →' : 'View All Results →'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Golden light rays */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)]?.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.3, 0], scale: [0, 2, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: 'easeOut'
              }}
              className="absolute top-1/2 left-1/2 w-1 h-96 bg-gradient-to-t from-yellow-400/50 to-transparent"
              style={{
                transform: `rotate(${i * 45}deg)`,
                transformOrigin: 'top center'
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrizeRevealAnimation;