import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  speed?: 'slow' | 'medium' | 'fast';
}

export function ParticleField({ 
  count = 30, 
  colors = ['#00f0ff', '#ff00ff', '#8b5cf6'],
  speed = 'medium'
}: ParticleFieldProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
      duration: speed === 'slow' ? 8 : speed === 'fast' ? 3 : 5,
    }));
  }, [count, colors, speed]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -50, -100],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
