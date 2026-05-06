import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import SlotMachineReel from '../../../components/ui/SlotMachineReel';

const SlotMachine3D = ({
  election,
  isSpinning,
  winners,
  animationSpeed,
  soundEnabled,
  motionReduced,
  onWinnerReveal
}) => {
  const canvasRef = useRef(null);
  const [displayNumbers, setDisplayNumbers] = useState(['0', '0', '0', '0', '0']);
  const [isRevealing, setIsRevealing] = useState(false);
  const animationFrameRef = useRef(null);
  const spinIntervalRef = useRef(null);

  useEffect(() => {
    if (isSpinning && !motionReduced) {
      startSpinning();
    } else if (!isSpinning) {
      stopSpinning();
    }

    return () => {
      if (spinIntervalRef?.current) {
        clearInterval(spinIntervalRef?.current);
      }
      if (animationFrameRef?.current) {
        cancelAnimationFrame(animationFrameRef?.current);
      }
    };
  }, [isSpinning, animationSpeed, motionReduced]);

  const startSpinning = () => {
    spinIntervalRef.current = setInterval(() => {
      setDisplayNumbers(prev => 
        prev?.map(() => Math.floor(Math.random() * 10)?.toString())
      );
    }, animationSpeed);
  };

  const stopSpinning = () => {
    if (spinIntervalRef?.current) {
      clearInterval(spinIntervalRef?.current);
    }

    if (winners?.length > 0 && !isRevealing) {
      revealWinners();
    }
  };

  const revealWinners = async () => {
    setIsRevealing(true);

    for (let i = 0; i < winners?.length; i++) {
      const winner = winners?.[i];
      const ticketId = winner?.lotteryTicketId || '00000';
      const digits = ticketId?.split('')?.slice(0, 5);

      // Animate each digit stopping with a premium flash
      for (let j = 0; j < digits?.length; j++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setDisplayNumbers(prev => {
          const newNumbers = [...prev];
          newNumbers[j] = digits?.[j];
          return newNumbers;
        });

        // Trigger a visual flash (handled via CSS class or state if needed, but we'll use a simple scale bump here)
        if (soundEnabled) {
          playStopSound();
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      onWinnerReveal?.(winner);

      if (i < winners?.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        startSpinning();
        await new Promise(resolve => setTimeout(resolve, 1000));
        stopSpinning();
      }
    }

    setIsRevealing(false);
  };

  const playStopSound = () => {
    // Simple beep sound using Web Audio API
    const audioContext = new (window?.AudioContext || window?.webkitAudioContext)();
    const oscillator = audioContext?.createOscillator();
    const gainNode = audioContext?.createGain();

    oscillator?.connect(gainNode);
    gainNode?.connect(audioContext?.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;

    oscillator?.start(audioContext?.currentTime);
    oscillator?.stop(audioContext?.currentTime + 0.1);
  };

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden">
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-500/20 via-transparent to-transparent animate-pulse" />
      
      {/* Slot machine frame */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Top display */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-4 bg-black/50 backdrop-blur-lg px-6 py-3 rounded-lg border border-yellow-500/30">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={20} className="text-yellow-400" />
              <span className="text-sm text-white/70">End Date:</span>
              <span className="text-sm text-white font-data">
                {election?.endDate ? new Date(`${election?.endDate}T${election?.endTime}`)?.toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2">
              <Icon name="Users" size={20} className="text-yellow-400" />
              <span className="text-sm text-white/70">Lucky Winners:</span>
              <span className="text-lg text-yellow-400 font-heading font-bold font-data">{election?.numberOfWinners || 0}</span>
            </div>
          </div>
        </div>

        {/* Main slot display */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 border-4 border-yellow-500/50 shadow-2xl">
          {/* Metallic shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
          
          {/* Number reels using modular SlotMachineReel */}
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {displayNumbers?.map((number, index) => (
              <SlotMachineReel
                key={index}
                targetDigit={parseInt(number)}
                isSpinning={isSpinning || isRevealing}
                delay={index * 100}
              />
            ))}
          </div>

          {/* Status indicator */}
          <div className="mt-8 text-center">
            {isSpinning ? (
              <div className="flex items-center justify-center gap-3 text-yellow-400">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#facc15]" />
                <span className="text-xl font-heading font-bold tracking-wider uppercase">Drawing Winners...</span>
              </div>
            ) : isRevealing ? (
              <div className="flex items-center justify-center gap-3 text-green-400">
                <Icon name="Trophy" size={28} className="animate-bounce" />
                <span className="text-xl font-heading font-bold tracking-wider uppercase">Winner Revealed!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-white/40">
                <Icon name="Clock" size={20} />
                <span className="text-sm font-medium uppercase tracking-widest">Waiting for election to end...</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse shadow-lg" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 animate-pulse shadow-lg" style={{ animationDelay: '0.2s' }} />
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse shadow-lg" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* Particle effects */}
      {isRevealing && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)]?.map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotMachine3D;