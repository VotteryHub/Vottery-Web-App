import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SlotMachineReel = ({ targetDigit = 0, isSpinning = false, delay = 0 }) => {
  const [displayDigit, setDisplayDigit] = useState(0);
  
  useEffect(() => {
    let interval;
    if (isSpinning) {
      setTimeout(() => {
        interval = setInterval(() => {
          setDisplayDigit(Math.floor(Math.random() * 10));
        }, 50);
      }, delay);
    } else {
      setDisplayDigit(targetDigit);
    }
    
    return () => clearInterval(interval);
  }, [isSpinning, targetDigit, delay]);

  return (
    <div className="relative w-16 h-28 md:w-20 md:h-32 bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-xl border-2 border-yellow-500/30 overflow-hidden shadow-inner flex items-center justify-center">
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none z-10" />
      
      <motion.div
        key={displayDigit}
        initial={{ y: isSpinning ? -50 : 0, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 150 }}
        className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-data"
      >
        {displayDigit}
      </motion.div>
      
      {/* Glass Reflection */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/20" />
    </div>
  );
};

export default SlotMachineReel;
