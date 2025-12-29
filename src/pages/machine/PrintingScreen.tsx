import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Sparkles, Zap } from 'lucide-react';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useMachineStore } from '@/store/machineStore';



export function PrintingScreen() {
  const navigate = useNavigate();
  const { session, mode, incrementPrintCount } = useMachineStore();
  const [progress, setProgress] = useState(0);
  const [printingComplete, setPrintingComplete] = useState(false);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPrintingComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Handle completion and navigation
  useEffect(() => {
    if (printingComplete) {
      incrementPrintCount(session?.copies || 1, mode);
      const timer = setTimeout(() => {
        navigate('/qr');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [printingComplete, session, mode, incrementPrintCount, navigate]);


  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      {/* Video Background - Matches other pages */}
      <VideoBackground
        overlayOpacity={0.7}
        enableVignette={true}
      />

      <div className="relative z-10 text-center max-w-4xl">
        {/* Creative Photo Assembly Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 relative h-96"
        >
          {/* Flying Photos Animation */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Multiple photo frames flying in and assembling */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 bg-gradient-to-br from-pixxel-orange/30 to-pixxel-amber/30 backdrop-blur-sm rounded-2xl border-4 border-white/40 shadow-2xl"
                initial={{
                  x: (i % 2 === 0 ? -1 : 1) * 800,
                  y: (i < 2 ? -1 : 1) * 400,
                  rotate: (i % 2 === 0 ? -1 : 1) * 180,
                  scale: 0.3,
                  opacity: 0
                }}
                animate={{
                  x: (i % 2 === 0 ? -1 : 1) * 80,
                  y: (i < 2 ? -1 : 1) * 80,
                  rotate: 0,
                  scale: 1,
                  opacity: 1
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
                style={{
                  boxShadow: '0 0 40px rgba(255, 140, 26, 0.6), inset 0 0 20px rgba(255,255,255,0.2)'
                }}
              >
                {/* Photo placeholder with sparkle */}
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  animate={{
                    background: [
                      'linear-gradient(135deg, rgba(255, 140, 26, 0.3) 0%, rgba(255, 184, 77, 0.3) 100%)',
                      'linear-gradient(135deg, rgba(255, 184, 77, 0.3) 0%, rgba(255, 140, 26, 0.3) 100%)',
                      'linear-gradient(135deg, rgba(255, 140, 26, 0.3) 0%, rgba(255, 184, 77, 0.3) 100%)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
              </motion.div>
            ))}

            {/* Central Printer Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              className="relative z-10"
            >
              <motion.div
                animate={{
                  filter: [
                    'drop-shadow(0 0 30px rgba(255, 140, 26, 0.8))',
                    'drop-shadow(0 0 50px rgba(255, 184, 77, 1))',
                    'drop-shadow(0 0 30px rgba(255, 140, 26, 0.8))',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Printer className="w-32 h-32 text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Orbiting Sparkles */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  animate={{
                    rotate: 360,
                    x: Math.cos((i * Math.PI) / 3) * 100,
                    y: Math.sin((i * Math.PI) / 3) * 100,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.1,
                  }}
                >
                  <Zap className="w-6 h-6 text-pixxel-amber" />
                </motion.div>
              ))}
            </motion.div>

            {/* Final Print Emerging */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64 bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              animate={{
                y: progress > 50 ? 0 : 100,
                opacity: progress > 50 ? 1 : 0,
                scale: progress > 50 ? 1 : 0.8,
              }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{
                boxShadow: '0 0 60px rgba(255, 140, 26, 0.8), 0 20px 40px rgba(0,0,0,0.5)'
              }}
            >
              {/* Grid pattern on print */}
              <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-50 p-2">
                <div className="grid grid-cols-2 gap-1 h-full">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-br from-orange-200 to-amber-200 rounded-lg"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: progress > 60 + i * 5 ? 1 : 0,
                        scale: progress > 60 + i * 5 ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Title with Neon Glow */}
        <motion.h1
          className="text-7xl font-black text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            textShadow: [
              '0 0 30px rgba(255, 140, 26, 0.8)',
              '0 0 50px rgba(255, 184, 77, 0.8)',
              '0 0 30px rgba(255, 140, 26, 0.8)',
            ]
          }}
          transition={{
            opacity: { duration: 0.5 },
            y: { duration: 0.5 },
            textShadow: { duration: 2, repeat: Infinity }
          }}
        >
          ⚡ PRINTING MAGIC ⚡
        </motion.h1>

        <motion.p
          className="text-3xl text-pixxel-orange-light font-light mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your memories are coming to life...
        </motion.p>

        {/* Progress Bar with Flowing Gradient */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative bg-white/10 backdrop-blur-md rounded-full h-12 overflow-hidden border-2 border-white/20">
            <motion.div
              className="h-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(90deg, #ff8c1a 0%, #ffc107 100%)',
                backgroundSize: '200% 100%',
              }}
            >
              {/* Flowing Animation */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 0%', '200% 0%'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  backgroundSize: '50% 100%',
                }}
              />

              {/* Sparkles */}
              {progress > 20 && [
                ...Array(Math.floor(progress / 20))
              ].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${(i + 1) * 20}%` }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Progress Percentage */}
          <motion.p
            className="text-6xl font-black mt-6"
            animate={{
              scale: [1, 1.05, 1],
              background: [
                'linear-gradient(135deg, #ff8c1a 0%, #ffb84d 100%)',
                'linear-gradient(135deg, #ffb84d 0%, #ff8c1a 100%)',
                'linear-gradient(135deg, #ff8c1a 0%, #ffb84d 100%)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'linear-gradient(135deg, #ff8c1a 0%, #ffb84d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {progress}%
          </motion.p>
        </div>

        {/* Session Info - Hidden when redirecting */}
        {!printingComplete && (
          <motion.div
            className="space-y-4 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5 }}
            style={{
              boxShadow: '0 0 40px rgba(255, 140, 26, 0.2), inset 0 0 40px rgba(255,255,255,0.05)'
            }}
          >
            <p className="text-2xl text-white font-semibold">
              📦 Printing {session?.copies} {session?.copies === 1 ? 'copy' : 'copies'}
            </p>
            <p className="text-xl text-pixxel-orange-light">
              🎨 Layout: {session?.layout && 'name' in session.layout ? session.layout.name : 'Selected Layout'}
            </p>
          </motion.div>
        )}

        {/* Fun Loading Messages */}
        <motion.div
          className="mt-8"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-2xl text-white/70 font-light">
            {progress < 30 && '✨ Sprinkling magic dust...'}
            {progress >= 30 && progress < 60 && '🎨 Adding colors...'}
            {progress >= 60 && progress < 90 && '⚡ Almost there...'}
            {progress >= 90 && '🎉 Finalizing your masterpiece!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
