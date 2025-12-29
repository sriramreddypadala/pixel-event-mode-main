export const neonColors = {
  cyan: '#00f0ff',
  magenta: '#ff00ff',
  violet: '#8b5cf6',
  pink: '#ec4899',
  yellow: '#fbbf24',
  green: '#10b981',
};

export const glowStyles = {
  neonCyan: 'shadow-[0_0_20px_rgba(0,240,255,0.5),0_0_40px_rgba(0,240,255,0.3)]',
  neonMagenta: 'shadow-[0_0_20px_rgba(255,0,255,0.5),0_0_40px_rgba(255,0,255,0.3)]',
  neonViolet: 'shadow-[0_0_20px_rgba(139,92,246,0.5),0_0_40px_rgba(139,92,246,0.3)]',
  neonPink: 'shadow-[0_0_20px_rgba(236,72,153,0.5),0_0_40px_rgba(236,72,153,0.3)]',
  neonYellow: 'shadow-[0_0_20px_rgba(251,191,36,0.5),0_0_40px_rgba(251,191,36,0.3)]',
  neonWhite: 'shadow-[0_0_30px_rgba(255,255,255,0.6),0_0_60px_rgba(255,255,255,0.4)]',
};

export const partyGradients = {
  cyberpunk: 'bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-600',
  neonNight: 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600',
  electricBlue: 'bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500',
  sunsetParty: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
  darkFuture: 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900',
};

export const animationVariants = {
  float: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  glow: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
  shimmer: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const touchFeedback = {
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

export const countdownVariants = {
  initial: { scale: 0, opacity: 0, rotate: -180 },
  animate: { 
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    rotate: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    scale: [1, 1.5, 0],
    opacity: [1, 1, 0],
    transition: { duration: 0.3 }
  },
};

export const flashVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: [0, 1, 0.8, 0],
    transition: { duration: 0.5, times: [0, 0.1, 0.3, 1] }
  },
};

export const celebrationVariants = {
  confetti: {
    y: [0, 800],
    x: [-100, 100],
    rotate: [0, 360],
    opacity: [1, 1, 0],
    transition: {
      duration: 3,
      ease: 'easeIn',
    },
  },
  sparkle: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
};
