import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera, Zap, Printer } from 'lucide-react';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import { useMachineStore } from '@/store/machineStore';



export function IdleScreen() {
  const navigate = useNavigate();
  const { printStats } = useMachineStore();

  const handleStart = () => {
    navigate('/setup');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <VideoBackground
        overlayOpacity={0.4}
        enableVignette={true}
      />

      {/* Print Counter Display - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-8 right-8 z-30"
      >
        <GlassPanel
          className="px-6 py-4 rounded-2xl"
          blur="heavy"
          opacity={0.9}
          glow={true}
        >
          <div className="flex items-center gap-4">
            <Printer className="w-8 h-8 text-pixxel-orange" />
            <div className="text-left">
              <p className="text-sm text-white/60 font-semibold mb-1">Print Counter</p>
              <div className="space-y-1">
                <p className="text-2xl font-black text-white">
                  {printStats.totalPrints} <span className="text-sm font-normal text-white/70">Total</span>
                </p>
                <div className="flex gap-4 text-xs text-white/60">
                  <span>Event: {printStats.eventPrints}</span>
                  <span>Normal: {printStats.normalPrints}</span>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-white px-8">
        <GlassPanel
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="px-16 py-12 rounded-3xl text-center max-w-4xl"
          blur="heavy"
          opacity={0.8}
          glow={true}
        >
          <motion.div
            className="flex items-center justify-center gap-8 mb-8"
            animate={{
              filter: [
                'drop-shadow(0 4px 12px rgba(255, 140, 26, 0.4))',
                'drop-shadow(0 6px 20px rgba(255, 140, 26, 0.6))',
                'drop-shadow(0 4px 12px rgba(255, 140, 26, 0.4))',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Camera className="w-20 h-20 text-pixxel-orange" />
            <motion.img
              src="/src/assets/pixel.jpg"
              alt="Pixxel8 Logo"
              className="h-32 w-auto rounded-2xl shadow-orange-strong"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <Sparkles className="w-20 h-20 text-pixxel-orange" />
          </motion.div>

          <p className="text-3xl font-bold text-white/90 mb-3">
            PHOTO BOOTH
          </p>
          <p className="text-xl text-white/70 tracking-widest">
            CREATE • CAPTURE • CELEBRATE
          </p>
        </GlassPanel>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16"
        >
          <GlassButton
            onClick={handleStart}
            variant="primary"
            size="xl"
            pulse={true}
            className="font-black tracking-wider"
          >
            TAP TO START
          </GlassButton>
        </motion.div>

        <motion.div
          className="absolute bottom-16 flex flex-wrap justify-center gap-4 max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: Zap, text: 'INSTANT PRINTS' },
            { icon: Camera, text: 'FUN LAYOUTS' },
            { icon: Sparkles, text: 'DIGITAL COPIES' },
          ].map((feature, i) => (
            <GlassPanel
              key={i}
              className="px-8 py-4 rounded-full flex items-center gap-3"
              blur="medium"
              opacity={0.6}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut'
              }}
            >
              <feature.icon className="w-6 h-6 text-pixxel-orange" />
              <span className="text-lg font-semibold text-white/90">{feature.text}</span>
            </GlassPanel>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

