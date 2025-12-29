import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, Sparkles } from 'lucide-react';
import { PoseSuggestionOverlay } from '@/components/machine/PoseSuggestionOverlay';
import { PhotoPreview } from '@/components/machine/PhotoPreview';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useMachineStore } from '@/store/machineStore';
import { generatePhotoId } from '@/utils/helpers';
import { InstructionModal } from '@/components/machine/InstructionModal';

export function CaptureScreen() {
  const navigate = useNavigate();
  const { session, addCapturedPhoto, removeCapturedPhoto } = useMachineStore();
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [waitCountdown, setWaitCountdown] = useState(5);
  const [showFlash, setShowFlash] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastHandledPhotoCount = useRef(-1); // Fix for continuous capture
  const [isShowingInstructions, setIsShowingInstructions] = useState(true);

  // Initialize Camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: 'user'
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        // alert("Could not access camera. Check permissions."); // Optional: avoid alert loops if persistent
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Get total frames needed - handle both GridTemplate and PhotoLayout
  const totalFrames = (session?.layout && 'slots' in session.layout)
    ? (session.layout as any).stillCount
    : (session?.layout as any)?.photoCount || (session?.layout as any)?.stillCount || 4;
  const capturedPhotos = session?.photos || [];

  // DEBUG LOGGING removed

  const capturePhoto = useCallback(() => {
    // DEBUG: Check session validity
    if (!session) {
      console.error("CAPTURE ERROR: No active session");
      alert("Session Error: Please restart the session.");
      navigate('/'); // Go to Idle
      return;
    }

    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    // Ensure video is potentially ready and has dimensions (Relaxed check)
    if (video && video.videoWidth > 0 && video.videoHeight > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        // Validation: Check if dataUrl is valid
        if (dataUrl === 'data:,' || dataUrl.length < 100) {
          console.error('[Capture] Generated empty/invalid dataURL', dataUrl);
          alert("Capture failed (empty image). Please try again.");
          return;
        }

        console.log('[CaptureScreen] Adding photo to session. Current count:', session.photos.length);

        addCapturedPhoto({
          id: generatePhotoId(),
          dataUrl,
          timestamp: Date.now(),
          frameNumber: currentFrame + 1,
        });

        setCurrentFrame(currentFrame + 1);
      }
    } else {
      console.warn('[Capture] Video stream not ready', {
        readyState: video?.readyState,
        width: video?.videoWidth,
        height: video?.videoHeight
      });
      alert("Camera not ready. Please wait.");
    }
  }, [currentFrame, addCapturedPhoto, session, navigate]);

  // Handle countdown and capture trigger
  // Handle countdown and capture trigger
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (showCountdown && countdown > 0) {
      // Tick countdown
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showCountdown && countdown === 0) {
      // Countdown success - Trigger Capture
      // We explicitly decouple the capture timeout from this effect's cleanup
      // to prevents state updates (re-renders) from cancelling the capture.

      const performCaptureSequence = () => {
        setShowCountdown(false);
        setShowFlash(true);

        // Use a standard timeout that won't be cleared by effect cleanup
        setTimeout(() => {
          capturePhoto();
          setShowFlash(false);
        }, 100);
      };

      performCaptureSequence();
    }

    return () => clearTimeout(timer);
  }, [showCountdown, countdown, capturePhoto]);

  // Auto-navigate to preview after celebration
  useEffect(() => {
    if (capturedPhotos.length === totalFrames && !showCountdown && !isWaitingForNext) {
      const timer = setTimeout(() => {
        handleContinue();
      }, 5000); // 5 seconds of celebration before auto-continuing
      return () => clearTimeout(timer);
    }
  }, [capturedPhotos.length, totalFrames, showCountdown, isWaitingForNext]);

  const handleTakePhoto = useCallback(() => {
    if (showCountdown || isShowingInstructions) return; // Prevent double clicks and block if instructions visible
    setIsWaitingForNext(false); // Safety reset for manual triggers
    setCountdown(3);
    setShowCountdown(true);
  }, [showCountdown, isShowingInstructions]);

  const handleRetake = (photoId: string) => {
    removeCapturedPhoto(photoId);
    // Reset last handled count to allow auto-advance to trigger again for this step
    if (lastHandledPhotoCount.current >= capturedPhotos.length - 1) {
      lastHandledPhotoCount.current = capturedPhotos.length - 2;
    }
    setCurrentFrame(currentFrame - 1);
  };

  const handleContinue = () => {
    // Navigate to preview screen to show photos in grid layout
    navigate('/preview');
  };

  // EFFECT 1: Trigger the Wait State
  // This effect purely watches for "Frame Captured" events and decides if we should START waiting.
  useEffect(() => {
    if (
      capturedPhotos.length > 0 &&
      capturedPhotos.length < totalFrames &&
      !showCountdown &&
      !isWaitingForNext &&
      lastHandledPhotoCount.current < capturedPhotos.length
    ) {
      console.log('[Capture] Auto-advance trigger. Photo count:', capturedPhotos.length);
      lastHandledPhotoCount.current = capturedPhotos.length;
      setWaitCountdown(5);
      setIsWaitingForNext(true);
    }
  }, [capturedPhotos.length, totalFrames, showCountdown, isWaitingForNext]);

  // EFFECT 2: Run the Countdown Interval
  // This effect runs ONLY when isWaitingForNext is true. It handles the tick.
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isWaitingForNext) {
      interval = setInterval(() => {
        setWaitCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // It's crucial we do this outside the render phase of the set state
            // setTimeout ensures we break out of the state update cycle
            setTimeout(() => {
              setIsWaitingForNext(false);
              handleTakePhoto();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWaitingForNext, handleTakePhoto]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Epic Flash Effect */}
      {showFlash && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            transition={{ duration: 0.5, times: [0, 0.1, 0.3, 1] }}
            className="absolute inset-0 bg-white z-30"
          />
          {/* Flash Burst */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="w-full h-full bg-gradient-radial from-cyan-400 via-fuchsia-400 to-transparent" />
          </motion.div>
          {/* Light Rays */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-t from-transparent via-pixxel-orange to-transparent origin-bottom z-30"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          ))}
        </>
      )}

      <motion.div
        className="absolute inset-8 border-2 border-pixxel-orange/30 rounded-3xl pointer-events-none z-20"
        animate={{
          boxShadow: [
            '0 0 20px rgba(255,140,26,0.2)',
            '0 0 30px rgba(255,140,26,0.3)',
            '0 0 20px rgba(255,140,26,0.2)',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 z-10" />

      <div className="relative z-20 min-h-screen flex flex-col">
        <div className="p-8">
          <GlassPanel
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-8 py-6 rounded-2xl"
            blur="medium"
            opacity={0.7}
          >
            <div className="text-white">
              <h1 className="text-5xl font-black mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                📸 STRIKE A POSE!
              </h1>
              <p className="text-2xl text-white/80 font-semibold">
                Photo {capturedPhotos.length + 1} of {totalFrames}
              </p>
            </div>

            <div className="flex gap-4">
              {[...Array(totalFrames)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 ${i < capturedPhotos.length
                    ? 'bg-pixxel-orange border-pixxel-orange/80 shadow-orange-soft'
                    : 'bg-white/20 border-white/40'
                    }`}
                  whileHover={{ scale: 1.2 }}
                >
                  {i < capturedPhotos.length && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {capturedPhotos.length < totalFrames ? (
            <div className="relative">
              <AnimatePresence>
                {isWaitingForNext && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    className="absolute -top-32 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <div className="bg-pixxel-orange text-white px-8 py-4 rounded-2xl font-black text-3xl shadow-orange-strong flex items-center gap-4">
                      <span>NEXT PHOTO IN</span>
                      <motion.span
                        key={waitCountdown}
                        initial={{ scale: 1.5 }}
                        animate={{ scale: 1 }}
                        className="text-5xl"
                      >
                        {waitCountdown}s
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTakePhoto}
                disabled={isWaitingForNext}
                className={`relative w-40 h-40 rounded-full flex items-center justify-center backdrop-blur-md ${isWaitingForNext ? 'bg-white/20' : 'bg-pixxel-orange/90'
                  }`}
                animate={{
                  boxShadow: isWaitingForNext ? 'none' : [
                    '0 0 30px rgba(255,140,26,0.4)',
                    '0 0 50px rgba(255,140,26,0.6)',
                    '0 0 30px rgba(255,140,26,0.4)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {!isWaitingForNext && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-pixxel-orange"
                    animate={{
                      scale: [1, 1.2],
                      opacity: [0.8, 0],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                <Camera className={`w-16 h-16 ${isWaitingForNext ? 'text-white/40' : 'text-white'}`} strokeWidth={3} />
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="mb-8"
              >
                <Zap className="w-32 h-32 text-yellow-400 mx-auto" style={{
                  filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.8))'
                }} />
              </motion.div>
              <motion.p
                className="text-white text-6xl font-black mb-8"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255,140,26,0.8)',
                    '0 0 40px rgba(255,140,26,1)',
                    '0 0 20px rgba(255,140,26,0.8)',
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎉 AMAZING!
              </motion.p>
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-8 rounded-2xl bg-pixxel-orange text-white text-3xl font-black shadow-orange-strong"
              >
                CONTINUE 🚀
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Photo Thumbnails at Bottom */}
        <div className="p-8">
          <motion.div
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence>
              {capturedPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', damping: 15 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="relative"
                >
                  <PhotoPreview
                    photo={photo}
                    index={index}
                    onRetake={() => handleRetake(photo.id)}
                    onRemove={() => handleRetake(photo.id)}
                  />
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255,140,26,0.5)',
                        '0 0 30px rgba(255,140,26,0.7)',
                        '0 0 20px rgba(255,140,26,0.5)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Pose Suggestion Overlay */}
      <PoseSuggestionOverlay
        currentPhoto={capturedPhotos.length + 1}
        totalPhotos={totalFrames}
        countdown={countdown}
        isVisible={showCountdown}
      />

      {/* Instruction Pop-up */}
      <InstructionModal
        isVisible={isShowingInstructions}
        onDismiss={() => setIsShowingInstructions(false)}
      />
    </div>
  );
}
