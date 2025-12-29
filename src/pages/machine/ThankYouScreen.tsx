import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Camera, Sparkles, Zap } from 'lucide-react';
import { Confetti } from '@/components/effects/Confetti';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { useMachineStore } from '@/store/machineStore';



export function ThankYouScreen() {
  const navigate = useNavigate();
  const { config, mode, clearSession } = useMachineStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    const timer = setTimeout(() => {
      clearSession();
      navigate('/');
    }, 10000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(timer);
    };
  }, [navigate, clearSession]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Video Background - Matches other pages */}
      <VideoBackground
        overlayOpacity={0.6}
        enableVignette={true}
      />

      {/* Epic Confetti */}
      {showConfetti && <Confetti count={100} duration={5} />}

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -800],
              x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
              opacity: [0, 1, 0],
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeOut',
            }}
          >
            {i % 4 === 0 ? (
              <Heart className="w-12 h-12 text-pixxel-orange" fill="currentColor" />
            ) : i % 4 === 1 ? (
              <Star className="w-12 h-12 text-pixxel-amber" fill="currentColor" />
            ) : i % 4 === 2 ? (
              <Camera className="w-12 h-12 text-white" />
            ) : (
              <Sparkles className="w-12 h-12 text-pixxel-orange-light" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white px-8">
        {/* Main Thank You Message */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="text-center mb-16"
        >
          {/* Animated Heart Icon */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="mb-12 relative inline-block"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 40px rgba(255, 140, 26, 0.6)',
                  '0 0 80px rgba(255, 184, 77, 0.8)',
                  '0 0 40px rgba(255, 140, 26, 0.6)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full"
            >
              <Heart className="w-48 h-48 text-pixxel-orange fill-pixxel-orange" />
            </motion.div>

            {/* Orbiting Sparkles */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2"
                animate={{
                  rotate: 360,
                  x: Math.cos((i * Math.PI) / 2) * 100,
                  y: Math.sin((i * Math.PI) / 2) * 100,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.2,
                }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            ))}
          </motion.div>

          {/* Thank You Text with Neon Glow */}
          <motion.h1
            className="text-9xl font-black mb-8"
            animate={{
              textShadow: [
                '0 0 40px rgba(255, 140, 26, 0.8), 0 0 80px rgba(255, 184, 77, 0.6)',
                '0 0 60px rgba(255, 184, 77, 0.8), 0 0 100px rgba(255, 140, 26, 0.6)',
                '0 0 40px rgba(255, 140, 26, 0.8), 0 0 80px rgba(255, 184, 77, 0.6)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'linear-gradient(135deg, #ff8c1a 0%, #ffc107 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🎉 THANK YOU! 🎉
          </motion.h1>

          <motion.p
            className="text-5xl font-light text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {config?.thankYouMessage || "You're amazing!"}
          </motion.p>

          <motion.p
            className="text-3xl text-pixxel-orange-light font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ✨ We hope you enjoyed your Pixxel8 experience! ✨
          </motion.p>
        </motion.div>

        {/* Event Info Card */}
        {mode === 'EVENT' && config?.eventName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 mb-12 max-w-3xl border-2 border-pixxel-orange/50"
            style={{
              boxShadow: '0 0 60px rgba(255, 140, 26, 0.3), inset 0 0 60px rgba(255, 140, 26, 0.1)'
            }}
          >
            <motion.p
              className="text-4xl font-black mb-4"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 140, 26, 0.8)',
                  '0 0 30px rgba(255, 184, 77, 0.8)',
                  '0 0 20px rgba(255, 140, 26, 0.8)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎊 {config.eventName} 🎊
            </motion.p>
            {config.eventMessage && (
              <p className="text-2xl text-pixxel-orange-light font-light">
                {config.eventMessage}
              </p>
            )}
          </motion.div>
        )}

        {/* Social Share & Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center space-y-6 mb-16"
        >
          <motion.p
            className="text-3xl text-white font-semibold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {config?.contactDetails || '📸 Visit us again soon!'}
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-6 text-2xl bg-white/5 backdrop-blur-xl rounded-full px-12 py-6 border-2 border-white/20"
            whileHover={{ scale: 1.05 }}
            style={{
              boxShadow: '0 0 30px rgba(255,255,255,0.2)'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Star className="w-8 h-8 text-pixxel-amber" fill="currentColor" />
            </motion.div>
            <span className="text-white font-bold">Share with #Pixxel8</span>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Star className="w-8 h-8 text-pixxel-amber" fill="currentColor" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          className="absolute bottom-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-white/5 backdrop-blur-xl rounded-full px-10 py-4 border-2 border-white/20"
          >
            <p className="text-2xl text-pixxel-orange-light font-semibold flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Returning to home screen...
              <Zap className="w-6 h-6" />
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
