import { Variants, Transition } from 'framer-motion';

// ====================================================
// DESIGN TOKENS - MOTION
// ====================================================

export const MOTION_DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

export const MOTION_EASE = {
  smooth: [0.4, 0.0, 0.2, 1],
  spring: [0.68, -0.55, 0.265, 1.55],
  bounce: [0.68, -0.6, 0.32, 1.6],
  snappy: [0.25, 0.46, 0.45, 0.94],
} as const;

// ====================================================
// PAGE TRANSITIONS
// ====================================================

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE.smooth,
    },
  },
};

export const slideVariants: Variants = {
  initial: (direction: 'left' | 'right' = 'right') => ({
    x: direction === 'right' ? 100 : -100,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE.smooth,
    },
  },
  exit: (direction: 'left' | 'right' = 'left') => ({
    x: direction === 'left' ? -100 : 100,
    opacity: 0,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE.smooth,
    },
  }),
};

export const fadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATION.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATION.fast,
    },
  },
};

// ====================================================
// MODAL TRANSITIONS
// ====================================================

export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE.spring,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE.smooth,
    },
  },
};

export const backdropVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATION.fast,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATION.fast,
    },
  },
};

// ====================================================
// BUTTON INTERACTIONS
// ====================================================

export const buttonTap = {
  scale: 0.95,
  transition: {
    duration: MOTION_DURATION.instant,
    ease: MOTION_EASE.snappy,
  },
};

export const buttonHover = {
  scale: 1.02,
  transition: {
    duration: MOTION_DURATION.fast,
    ease: MOTION_EASE.smooth,
  },
};

// ====================================================
// CARD INTERACTIONS
// ====================================================

export const cardVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE.smooth,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: MOTION_DURATION.instant,
      ease: MOTION_EASE.snappy,
    },
  },
};

export const cardSelectVariants: Variants = {
  unselected: {
    scale: 1,
    borderColor: 'rgba(229, 231, 235, 1)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  selected: {
    scale: 1.05,
    borderColor: 'rgba(14, 165, 233, 1)',
    boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE.spring,
    },
  },
};

// ====================================================
// TOGGLE INTERACTIONS
// ====================================================

export const toggleVariants: Variants = {
  off: {
    x: 0,
  },
  on: {
    x: 24,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
};

// ====================================================
// LIST ANIMATIONS
// ====================================================

export const listContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE.smooth,
    },
  },
};

// ====================================================
// ALERT ANIMATIONS
// ====================================================

export const alertVariants: Variants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE.spring,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE.smooth,
    },
  },
};

// ====================================================
// SUCCESS ANIMATIONS
// ====================================================

export const successVariants: Variants = {
  initial: {
    scale: 0,
    rotate: -180,
  },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
};

export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: MOTION_DURATION.slower,
      repeat: Infinity,
      ease: MOTION_EASE.smooth,
    },
  },
};

// ====================================================
// LOADING ANIMATIONS
// ====================================================

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const skeletonVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: MOTION_EASE.smooth,
    },
  },
};

// ====================================================
// ERROR SHAKE ANIMATION
// ====================================================

export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: MOTION_DURATION.slow,
      ease: MOTION_EASE.snappy,
    },
  },
};

// ====================================================
// SPRING PRESETS
// ====================================================

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};
