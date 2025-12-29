import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, Camera } from 'lucide-react';

interface CountdownTimerProps {
  onComplete: () => void;
  duration?: number;
}

export function CountdownTimer({ onComplete, duration = 3 }: CountdownTimerProps) {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  const getCountdownColor = (num: number) => {
    if (num === 3) return { from: '#FF8C1A', to: '#FFB366' }; // Orange to Light Orange
    if (num === 2) return { from: '#FFB84D', to: '#FF8C1A' }; // Amber to Orange
    return { from: '#FFB366', to: '#E67A00' }; // Light Orange to Dark Orange
  };

  const colors = getCountdownColor(count);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center overflow-hidden">
      {/* Pulsing Background Rings */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.5, 2],
          opacity: [0.5, 0.2, 0],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div
          className="w-96 h-96 rounded-full border-8"
          style={{ borderColor: colors.from }}
        />
      </motion.div>

      {/* Rotating Energy Rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: 200 + i * 100,
            height: 200 + i * 100,
            border: `4px solid ${colors.from}`,
            borderRadius: '50%',
            borderStyle: 'dashed',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3 - i * 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Main Countdown Number */}
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{
            scale: 0,
            opacity: 0,
            rotate: -180,
            filter: 'blur(20px)'
          }}
          animate={{
            scale: [0, 1.3, 1],
            opacity: [0, 1, 1],
            rotate: 0,
            filter: 'blur(0px)'
          }}
          exit={{
            scale: [1, 1.5, 0],
            opacity: [1, 1, 0],
            filter: 'blur(20px)'
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.6, 1],
            ease: 'easeOut'
          }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Glow Effect Behind Number */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${colors.from} 0%, ${colors.to} 50%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />

          {/* The Number */}
          <motion.div
            className="text-[20rem] font-black leading-none"
            style={{
              background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `drop-shadow(0 0 40px ${colors.from}) drop-shadow(0 0 80px ${colors.to})`,
            }}
            animate={{
              textShadow: [
                `0 0 40px ${colors.from}, 0 0 80px ${colors.to}`,
                `0 0 60px ${colors.from}, 0 0 120px ${colors.to}`,
                `0 0 40px ${colors.from}, 0 0 80px ${colors.to}`,
              ]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {count}
          </motion.div>

          {/* Icon Below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            {count === 1 ? (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Camera
                  className="w-32 h-32 text-white"
                  style={{
                    filter: `drop-shadow(0 0 20px ${colors.from})`,
                  }}
                />
              </motion.div>
            ) : (
              <Zap
                className="w-32 h-32 text-white"
                style={{
                  filter: `drop-shadow(0 0 20px ${colors.from})`,
                }}
              />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Corner Sparkles */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full"
          style={{
            backgroundColor: colors.from,
            boxShadow: `0 0 20px ${colors.from}`,
            top: i < 2 ? '10%' : '90%',
            left: i % 2 === 0 ? '10%' : '90%',
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Bottom Text */}
      <motion.div
        className="absolute bottom-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          className="text-4xl font-bold text-white"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{
            textShadow: `0 0 20px ${colors.from}`,
          }}
        >
          {count === 1 ? '📸 GET READY!' : '⚡ SMILE!'}
        </motion.p>
      </motion.div>
    </div>
  );
}
