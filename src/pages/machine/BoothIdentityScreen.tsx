/**
 * BOOTH IDENTITY SCREEN
 * First-time setup: Booth ID configuration
 * Shown only once before any other machine screens
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, ArrowRight, AlertCircle } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { useBoothStore } from '@/store/boothStore';

export function BoothIdentityScreen() {
  const { setIdentity } = useBoothStore();
  const [boothId, setBoothId] = useState('');
  const [boothName, setBoothName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!boothId.trim()) {
      setError('Booth ID is required');
      return;
    }

    // Set booth identity (persisted)
    setIdentity({
      boothId: boothId.trim(),
      boothName: boothName.trim() || `Booth ${boothId.slice(0, 8)}`,
      installDate: new Date().toISOString(),
    });

    // Reload to show main app
    window.location.reload();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 backdrop-blur-xl border-2 border-white/10 flex items-center justify-center">
              <Monitor className="w-16 h-16 text-primary-400" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-black text-center mb-4 bg-gradient-to-r from-white via-primary-200 to-accent-200 bg-clip-text text-transparent"
          >
            Booth Setup
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 text-center mb-12"
          >
            Configure your booth identity to get started
          </motion.p>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Booth ID Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Booth ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={boothId}
                onChange={(e) => {
                  setBoothId(e.target.value);
                  setError('');
                }}
                placeholder="Enter unique booth ID (e.g., booth-001)"
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-all"
                autoFocus
              />
            </div>

            {/* Booth Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Booth Name <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={boothName}
                onChange={(e) => setBoothName(e.target.value)}
                placeholder="Enter friendly name (e.g., Main Street Booth)"
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm font-semibold">{error}</span>
              </motion.div>
            )}

            {/* Info Box */}
            <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-300 text-sm">
                💡 This booth ID will be used to identify this device and fetch its configuration.
                Choose a unique ID that you'll use in the admin portal.
              </p>
            </div>

            {/* Submit Button */}
            <GlassButton
              onClick={handleSubmit}
              className="w-full py-6 text-xl font-bold"
              variant="primary"
            >
              <span>Continue to Setup</span>
              <ArrowRight className="w-6 h-6 ml-2" />
            </GlassButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
