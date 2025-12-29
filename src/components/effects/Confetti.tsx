import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ConfettiProps {
  count?: number;
  duration?: number;
}

export function Confetti({ count = 50, duration = 3 }: ConfettiProps) {
  const confettiPieces = useMemo(() => {
    const colors = ['#00f0ff', '#ff00ff', '#8b5cf6', '#ec4899', '#fbbf24', '#10b981'];
    const shapes = ['circle', 'square', 'triangle'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 200,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'triangle' ? '0' : '2px',
            clipPath: piece.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 50,
            x: piece.drift,
            rotate: piece.rotation * 3,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}
