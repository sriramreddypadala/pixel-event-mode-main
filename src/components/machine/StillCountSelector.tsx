import { motion } from 'framer-motion';
import { Camera, Sparkles } from 'lucide-react';
import { cn } from '@/utils/helpers';

type StillCountSelectorProps = {
  selectedCount: number | null;
  onSelect: (count: number) => void;
  availableCounts: number[];
};

export function StillCountSelector({
  selectedCount,
  onSelect,
  availableCounts,
}: StillCountSelectorProps) {
  return (
    <div className="space-y-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2
          className="text-6xl font-black text-white mb-4"
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 140, 26, 0.5)',
              '0 0 40px rgba(255, 140, 26, 0.7)',
              '0 0 20px rgba(255, 140, 26, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📸 HOW MANY PHOTOS?
        </motion.h2>
        <p className="text-2xl text-pixxel-orange-light font-light tracking-wide">
          Pick your photo count and let's party!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {availableCounts.map((count) => {
          const isSelected = selectedCount === count;

          return (
            <motion.button
              key={count}
              onClick={() => onSelect(count)}
              whileHover={{
                scale: 1.08,
                y: -10,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              animate={isSelected ? {
                y: [0, -8, 0],
                transition: { duration: 1, repeat: Infinity }
              } : {}}
              className={cn(
                'relative p-10 rounded-3xl transition-all duration-300',
                'flex flex-col items-center justify-center gap-4',
                'backdrop-blur-md border-4',
                isSelected
                  ? 'bg-gradient-to-br from-pixxel-orange/20 to-pixxel-amber/20 border-pixxel-orange'
                  : 'bg-white/10 border-white/30 hover:border-pixxel-orange/50'
              )}
              style={isSelected ? {
                boxShadow: '0 0 40px rgba(255, 140, 26, 0.6), 0 0 80px rgba(255, 140, 26, 0.4), inset 0 0 40px rgba(255, 140, 26, 0.2)'
              } : {}}
            >
              {/* Selection Indicator with Sparkle */}
              {isSelected && (
                <>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                    }}
                    className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-pixxel-orange to-pixxel-amber rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: '0 0 30px rgba(255, 140, 26, 0.8), 0 0 60px rgba(255, 140, 26, 0.6)'
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  {/* Rotating Ring */}
                  <motion.div
                    className="absolute inset-0 border-4 border-pixxel-orange rounded-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ borderStyle: 'dashed' }}
                  />
                </>
              )}

              {/* Camera Icon with Glow */}
              <motion.div
                animate={isSelected ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0, repeatDelay: 1 }}
              >
                <Camera
                  className={cn(
                    'w-20 h-20 transition-colors',
                    isSelected
                      ? 'text-pixxel-orange'
                      : 'text-white/60'
                  )}
                  style={isSelected ? {
                    filter: 'drop-shadow(0 0 10px rgba(255, 140, 26, 0.8))'
                  } : {}}
                />
              </motion.div>

              {/* Count with Neon Effect */}
              <div className="text-center">
                <motion.div
                  className={cn(
                    'text-8xl font-black transition-colors',
                    isSelected
                      ? 'text-white'
                      : 'text-white/80'
                  )}
                  animate={isSelected ? {
                    textShadow: [
                      '0 0 20px rgba(255, 140, 26, 0.8), 0 0 40px rgba(255, 140, 26, 0.6)',
                      '0 0 30px rgba(255, 140, 26, 0.8), 0 0 50px rgba(255, 140, 26, 0.6)',
                      '0 0 20px rgba(255, 140, 26, 0.8), 0 0 40px rgba(255, 140, 26, 0.6)',
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {count}
                </motion.div>
                <div
                  className={cn(
                    'text-xl font-bold mt-2 uppercase tracking-wider',
                    isSelected
                      ? 'text-pixxel-orange-light'
                      : 'text-white/60'
                  )}
                >
                  {count === 1 ? 'Photo' : 'Photos'}
                </div>
              </div>

              {/* Pulsing Glow Effect */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 140, 26, 0.2) 0%, transparent 70%)'
                  }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              {/* Ripple on Hover */}
              {!isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-white/50 pointer-events-none"
                  initial={{ scale: 1, opacity: 0 }}
                  whileHover={{
                    scale: [1, 1.2],
                    opacity: [0.5, 0],
                  }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Fun Instruction */}
      <motion.p
        className="text-center text-2xl text-white/70 font-light"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✨ Tap a number to continue ✨
      </motion.p>
    </div>
  );
}
