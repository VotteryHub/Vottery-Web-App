// Casino Aesthetic Theme Tokens for Premium 2D Carousels

export const casinoTheme = {
  colors: {
    gold: {
      primary: '#FFD700',
      light: '#FFFACD',
      dark: '#B8860B',
      metallic: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)'
    },
    neon: {
      pink: '#FF10F0',
      blue: '#00F0FF',
      green: '#39FF14',
      purple: '#BF00FF',
      orange: '#FF6600',
      yellow: '#FFFF00'
    },
    casino: {
      red: '#DC143C',
      black: '#0A0A0A',
      green: '#006400',
      purple: '#4B0082'
    }
  },

  gradients: {
    goldShimmer: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFA500 75%, #FFD700 100%)',
    neonGlow: 'linear-gradient(135deg, #FF10F0 0%, #00F0FF 50%, #BF00FF 100%)',
    casinoNight: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #16213E 100%)',
    jackpotPrize: 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
    royalFlush: 'linear-gradient(135deg, #4B0082 0%, #8B008B 50%, #FF1493 100%)',
    luckyGreen: 'linear-gradient(135deg, #006400 0%, #228B22 50%, #32CD32 100%)',
    slotMachine: 'linear-gradient(135deg, #DC143C 0%, #FF6347 50%, #FFD700 100%)'
  },

  shadows: {
    goldGlow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
    neonPink: '0 0 20px rgba(255, 16, 240, 0.6), 0 0 40px rgba(255, 16, 240, 0.4)',
    neonBlue: '0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.4)',
    cardElevation: '0 10px 30px rgba(0, 0, 0, 0.3), 0 1px 8px rgba(0, 0, 0, 0.2)',
    innerGlow: 'inset 0 0 20px rgba(255, 215, 0, 0.3)',
    deepShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)'
  },

  glassmorphism: {
    light: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
    },
    casino: {
      background: 'rgba(26, 26, 46, 0.4)',
      backdropFilter: 'blur(40px)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(255, 215, 0, 0.1)'
    }
  },

  animations: {
    shimmer: {
      keyframes: {
        '0%': { backgroundPosition: '-200% center' },
        '100%': { backgroundPosition: '200% center' }
      },
      duration: '3s',
      timingFunction: 'linear',
      iterationCount: 'infinite'
    },
    pulse: {
      keyframes: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.7 }
      },
      duration: '2s',
      timingFunction: 'ease-in-out',
      iterationCount: 'infinite'
    },
    glow: {
      keyframes: {
        '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' },
        '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.8)' }
      },
      duration: '2s',
      timingFunction: 'ease-in-out',
      iterationCount: 'infinite'
    },
    spin: {
      keyframes: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      },
      duration: '3s',
      timingFunction: 'linear',
      iterationCount: 'infinite'
    }
  },

  typography: {
    jackpot: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 900,
      fontSize: '2.5rem',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    neon: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 700,
      textShadow: '0 0 10px currentColor, 0 0 20px currentColor'
    }
  },

  spacing: {
    cardGap: '16px',
    stackOffset: '15px',
    blobSpacing: '12px'
  },

  borderRadius: {
    card: '16px',
    blob: '50%',
    button: '12px'
  },

  transitions: {
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    snap: 'all 0.2s ease-out'
  }
};

export default casinoTheme;