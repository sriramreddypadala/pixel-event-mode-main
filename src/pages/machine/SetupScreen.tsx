import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GridSelector } from '@/components/machine/GridSelector';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import { useMachineStore } from '@/store/machineStore';
import { useGridStore } from '@/store/gridStore';



export function SetupScreen() {
  const navigate = useNavigate();
  const { startSession } = useMachineStore();
  const { templates } = useGridStore();

  const [selectedGridId, setSelectedGridId] = useState<string | null>(null);

  // Get all enabled grids
  const availableGrids = templates
    .filter(t => t.isEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const selectedGrid = templates.find(t => t.id === selectedGridId);

  const handleGridSelect = (gridId: string) => {
    setSelectedGridId(gridId);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleContinue = () => {
    if (!selectedGrid) return;

    startSession();
    // Set the selected grid layout in session (store GridTemplate directly)
    const { setSessionLayout } = useMachineStore.getState();
    setSessionLayout(selectedGrid);

    // Redirect to payment screen after grid selection
    navigate('/payment');
  };

  const canContinue = selectedGridId !== null;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      <VideoBackground
        overlayOpacity={0.5}
        enableVignette={true}
      />
      <div className="relative z-20 w-full max-w-6xl">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassButton
            onClick={handleBack}
            variant="secondary"
            size="md"
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </GlassButton>

          <GlassPanel
            className="px-12 py-4 rounded-2xl border-2 border-pixxel-orange shadow-orange-strong"
            blur="heavy"
            opacity={0.9}
            glow={true}
          >
            <h1 className="text-4xl font-black text-white tracking-widest uppercase">
              Select Style
            </h1>
          </GlassPanel>

          <div className="w-24" /> {/* Spacer for centering */}
        </motion.div>

        {/* Grid Selection */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GridSelector
            selectedGridId={selectedGridId}
            onSelect={handleGridSelect}
            grids={availableGrids}
          />
        </motion.div>

        {/* Selected Grid Info & Continue Button */}
        {selectedGrid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <GlassPanel
              className="p-4 rounded-2xl"
              blur="heavy"
              opacity={0.9}
              glow={true}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">
                    {selectedGrid.name}
                  </h3>
                  <p className="text-lg text-pixxel-orange-light">
                    📷 {selectedGrid.stillCount} {selectedGrid.stillCount === 1 ? 'Photo' : 'Photos'}
                  </p>
                  <p className="text-sm text-white/70 mt-1">
                    {selectedGrid.aspectRatio}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-pixxel-orange-light text-sm font-semibold mb-1">💰 Price</p>
                  <motion.p
                    className="text-4xl font-black bg-gradient-to-r from-pixxel-orange to-pixxel-amber bg-clip-text text-transparent"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ₹{selectedGrid.price?.toFixed(2) || '0.00'}
                  </motion.p>
                </div>
              </div>

              <motion.div className="mt-4">
                <GlassButton
                  onClick={handleContinue}
                  disabled={!canContinue}
                  variant="primary"
                  size="xl"
                  pulse={canContinue}
                  className="w-full font-black text-3xl py-8 shadow-orange-strong"
                >
                  Confirm Choice 📸
                </GlassButton>
              </motion.div>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}
