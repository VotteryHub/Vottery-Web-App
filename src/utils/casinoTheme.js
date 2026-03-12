export const casinoTheme = {
  colors: {
    gold: {
      50: '#FFFACD',
      100: '#FFF8DC',
      200: '#FFE4B5',
      300: '#FFD700',
      400: '#FFC700',
      500: '#FFB700',
      600: '#FFA500',
      700: '#FF8C00',
      800: '#FF7F00',
      900: '#FF6F00'
    },
    neon: {
      pink: '#FF10F0',
      blue: '#00D9FF',
      green: '#39FF14',
      purple: '#BF00FF',
      orange: '#FF6600',
      yellow: '#FFFF00'
    },
    casino: {
      primary: '#FFD700',
      secondary: '#FF6600',
      accent: '#BF00FF',
      success: '#39FF14',
      error: '#FF0040',
      warning: '#FFFF00'
    }
  },
  shadows: {
    gold: {
      sm: '0 0 10px rgba(255, 215, 0, 0.3)',
      md: '0 0 20px rgba(255, 215, 0, 0.4)',
      lg: '0 0 30px rgba(255, 215, 0, 0.5)',
      xl: '0 0 40px rgba(255, 215, 0, 0.6)'
    },
    neon: {
      pink: '0 0 20px rgba(255, 16, 240, 0.6)',
      blue: '0 0 20px rgba(0, 217, 255, 0.6)',
      green: '0 0 20px rgba(57, 255, 20, 0.6)',
      purple: '0 0 20px rgba(191, 0, 255, 0.6)'
    },
    glow: {
      soft: '0 0 15px rgba(255, 255, 255, 0.2)',
      medium: '0 0 25px rgba(255, 255, 255, 0.3)',
      strong: '0 0 35px rgba(255, 255, 255, 0.4)'
    }
  },
  glassmorphism: {
    light: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(30px)',
      border: '1px solid rgba(255, 255, 255, 0.4)'
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }
  },
  gradients: {
    gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    neon: 'linear-gradient(135deg, #FF10F0 0%, #00D9FF 100%)',
    casino: 'linear-gradient(135deg, #FFD700 0%, #FF6600 50%, #BF00FF 100%)',
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    sunset: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  animations: {
    pulse: {
      keyframes: '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }',
      duration: '2s',
      timing: 'ease-in-out',
      iteration: 'infinite'
    },
    glow: {
      keyframes: '@keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4); } 50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); } }',
      duration: '2s',
      timing: 'ease-in-out',
      iteration: 'infinite'
    },
    shimmer: {
      keyframes: '@keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }',
      duration: '2s',
      timing: 'linear',
      iteration: 'infinite'
    }
  },
  physics: {
    snap: {
      stiffness: 400,
      damping: 35,
      mass: 1
    },
    viscous: {
      stiffness: 80,
      damping: 40,
      mass: 2
    },
    bouncy: {
      stiffness: 300,
      damping: 20,
      mass: 0.8
    }
  }
};

export default casinoTheme;