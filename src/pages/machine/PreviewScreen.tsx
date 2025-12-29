/**
 * PREVIEW SCREEN
 * Shows captured photos in selected grid layout
 * User confirms before proceeding to printing
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, X, RotateCcw } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { useMachineStore } from '@/store/machineStore';
import { useGridStore } from '@/store/gridStore';
import { GridRenderer } from '@/components/machine/GridRenderer';
import type { GridTemplate } from '@/types/grid';



export function PreviewScreen() {
  const navigate = useNavigate();
  const { session } = useMachineStore();
  const { getTemplateById } = useGridStore();

  const capturedPhotos = session?.photos || [];
  let layout = session?.layout;
  
  // Validate layout: if it doesn't have slots array, try to get it from gridStore
  if (layout) {
    const hasSlots = 'slots' in layout;
    const slotsIsArray = hasSlots && Array.isArray((layout as any).slots);
    
    if (!hasSlots || !slotsIsArray) {
      console.warn('⚠️ Invalid layout in session:', {
        hasSlots,
        slotsIsArray,
        layoutType: typeof layout,
        layoutKeys: Object.keys(layout || {}),
        layoutId: (layout as any)?.id
      });
      
      // Try to recover from gridStore using layout ID
      if ('id' in layout && typeof (layout as any).id === 'string') {
        const validGrid = getTemplateById((layout as any).id);
        if (validGrid && Array.isArray(validGrid.slots)) {
          layout = validGrid;
          console.log('✅ Recovered valid grid template from gridStore');
          // Update session with valid layout
          const { setSessionLayout } = useMachineStore.getState();
          setSessionLayout(validGrid);
        } else {
          console.error('❌ Could not recover grid template - clearing layout');
          layout = null;
        }
      } else {
        console.error('❌ Layout missing ID - cannot recover');
        layout = null;
      }
    }
  }

  const handleConfirm = () => {
    // Go to printing screen
    navigate('/printing');
  };

  const handleRetake = () => {
    navigate('/capture');
  };

  const handleCancel = () => {
    navigate('/setup');
  };



  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      <VideoBackground
        overlayOpacity={0.8}
        enableVignette={true}
      />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-black text-white mb-4">
            ✨ Preview Your Photos ✨
          </h1>
          <p className="text-2xl text-pixxel-orange-light font-light">
            Love them? Let's continue! Want to retake? No problem!
          </p>
        </motion.div>

        {/* Photo Grid Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          {layout && 'slots' in layout && Array.isArray((layout as GridTemplate).slots) ? (
            <div
              className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/20"
              style={{
                height: '60vh', // Fixed height responsive constraint
                aspectRatio: `${(layout as GridTemplate).canvasWidth} / ${(layout as GridTemplate).canvasHeight}`
              }}
            >
              <GridRenderer
                template={layout as GridTemplate}
                photos={capturedPhotos.map(p => p.dataUrl)}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="text-white text-center p-8">
              <p className="text-xl mb-4">No valid layout selected.</p>
              {layout && (
                <div className="text-sm text-gray-400 mt-4">
                  <p>Layout type: {typeof layout}</p>
                  <p>Has slots: {'slots' in layout ? 'Yes' : 'No'}</p>
                  {('slots' in layout) && (
                    <p>Slots is array: {Array.isArray((layout as any).slots) ? 'Yes' : 'No'}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6"
        >
          {/* Cancel Button */}
          <GlassButton
            onClick={handleCancel}
            variant="secondary"
            className="px-8 py-6 text-xl"
          >
            <X className="w-6 h-6 mr-2" />
            <span>Cancel</span>
          </GlassButton>

          {/* Retake Button */}
          <GlassButton
            onClick={handleRetake}
            variant="secondary"
            className="px-8 py-6 text-xl"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            <span>Retake Photos</span>
          </GlassButton>

          {/* Confirm Button */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <GlassButton
              variant="primary"
              onClick={handleConfirm}
              className="px-12 py-6 text-2xl font-black w-auto"
              pulse={true}
            >
              <Check className="w-8 h-8 mr-3" />
              <span>Perfect! Print 🖨️</span>
            </GlassButton>
          </motion.div>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xl text-white/60 mt-8"
        >
          Your photos look amazing! Continue to get your QR code.
        </motion.p>
      </div>
    </div>
  );
}
