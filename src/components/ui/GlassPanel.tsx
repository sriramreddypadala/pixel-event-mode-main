/**
 * GLASS PANEL COMPONENT
 * Frosted glass UI element for floating above video backgrounds
 */

import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  blur?: 'light' | 'medium' | 'heavy';
  opacity?: number;
  border?: boolean;
  glow?: boolean;
  animate?: MotionProps['animate'];
  initial?: MotionProps['initial'];
  transition?: MotionProps['transition'];
  onClick?: () => void;
}

const blurLevels = {
  light: 'backdrop-blur-sm',
  medium: 'backdrop-blur-md',
  heavy: 'backdrop-blur-2xl',
};

export function GlassPanel({
  children,
  className = '',
  blur = 'medium',
  opacity = 0.75,
  border = true,
  glow = false,
  animate,
  initial,
  transition,
  onClick,
}: GlassPanelProps) {
  const bgOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      onClick={onClick}
      className={`
        ${blurLevels[blur]}
        ${border ? 'border border-white/10' : ''}
        ${glow ? 'shadow-orange-soft' : 'shadow-xl shadow-black/40'}
        ${className}
      `}
      style={{
        backgroundColor: `#0f0f14${bgOpacity}`,
        backdropFilter: `blur(${blur === 'light' ? '8px' : blur === 'medium' ? '24px' : '32px'}) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blur === 'light' ? '8px' : blur === 'medium' ? '24px' : '32px'}) saturate(180%)`,
      }}
    >
      {border && (
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${glow ? 'via-pixxel-orange/30' : 'via-white/20'} to-transparent`}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {children}
    </motion.div>
  );
}
