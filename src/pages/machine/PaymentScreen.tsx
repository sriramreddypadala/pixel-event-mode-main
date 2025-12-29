import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { openRazorpayCheckout } from '@/services/payment.service';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { useMachineStore } from '@/store/machineStore';

export function PaymentScreen() {
  const navigate = useNavigate();
  const { session } = useMachineStore();


  // Handle payment success
  const handlePaymentSuccess = useCallback(() => {
    navigate('/capture');
  }, [navigate]);

  // Start Razorpay payment
  const handlePay = useCallback(() => {
    openRazorpayCheckout({
      amount: session?.layout?.price || 100, // fallback amount
      handler: handlePaymentSuccess,
      prefill: {},
    });
  }, [session, handlePaymentSuccess]);



  const handleBack = () => {
    navigate('/setup');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      <VideoBackground
        overlayOpacity={0.6}
        enableVignette={true}
      />

      <div className="relative z-20 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <GlassButton
              onClick={handleBack}
              variant="secondary"
              size="md"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </GlassButton>

            <GlassPanel className="px-6 py-2 rounded-xl" blur="medium">
              <h1 className="text-2xl font-black text-white">
                Ready to Capture
              </h1>
            </GlassPanel>

            <div className="w-24" />
          </div>

          {/* Razorpay Payment Panel */}
          <GlassPanel className="p-12 rounded-3xl text-center" blur="heavy" glow={true}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-32 h-32 bg-pixxel-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                <Camera className="w-16 h-16 text-pixxel-orange" />
              </div>
            </motion.div>

            <h2 className="text-4xl font-black text-white mb-4">
              Pay & Start Capturing
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Please complete payment to proceed to the photo booth.
            </p>

            {session?.layout && (
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                <p className="text-lg text-gray-300 mb-2">Selected Layout</p>
                <p className="text-2xl font-bold text-white">
                  {'name' in session.layout ? session.layout.name : 'Selected Layout'}
                </p>
                <p className="text-lg text-pixxel-orange font-bold mt-2">
                  ₹{session.layout.price}
                </p>
              </div>
            )}

            <GlassButton
              size="xl"
              onClick={handlePay}
              variant="primary"
              pulse={true}
              className="w-full font-black text-xl"
            >
              Pay Now & Start 📸
            </GlassButton>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
