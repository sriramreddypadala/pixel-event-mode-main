import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMachineStore } from '@/store/machineStore';
import { useBoothStore } from '@/store/boothStore';

import { BoothIdentityScreen } from '@/pages/machine/BoothIdentityScreen';
import { IdleScreen } from '@/pages/machine/IdleScreen';
import { SetupScreen } from '@/pages/machine/SetupScreen';
import { CaptureScreen } from '@/pages/machine/CaptureScreen';
import { PreviewScreen } from '@/pages/machine/PreviewScreen';
import { PaymentScreen } from '@/pages/machine/PaymentScreen';
import { PrintingScreen } from '@/pages/machine/PrintingScreen';
import { QRScreen } from '@/pages/machine/QRScreen';
import { ThankYouScreen } from '@/pages/machine/ThankYouScreen';
import { ViewImagesPage } from '@/pages/machine/ViewImagesPage';
import { TouchInteractive } from '@/components/effects/TouchRippleEffect';

export function App() {
  const { loadConfig, session } = useMachineStore();
  const { hasIdentity } = useBoothStore();

  useEffect(() => {
    loadConfig();
    
    // Cleanup: Validate and fix invalid session layout from localStorage
    if (session?.layout) {
      const layout = session.layout;
      // If layout doesn't have valid slots array, clear it
      if (!('slots' in layout) || !Array.isArray((layout as any).slots)) {
        console.warn('⚠️ Clearing invalid session layout from storage');
        const { clearSession } = useMachineStore.getState();
        clearSession();
      }
    }
  }, [loadConfig, session]);

  return (
    <BrowserRouter>
      <TouchInteractive>
        <Routes>
          {/* PUBLIC ROUTE - No booth identity required */}
          <Route path="/view/:sessionId" element={<ViewImagesPage />} />
          
          {/* PROTECTED ROUTES - Require booth identity */}
          <Route path="/*" element={
            hasIdentity() ? (
              <Routes>
                <Route path="/" element={<IdleScreen />} />
                <Route path="/setup" element={<SetupScreen />} />
                <Route path="/capture" element={<CaptureScreen />} />
                <Route path="/preview" element={<PreviewScreen />} />
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/printing" element={<PrintingScreen />} />
                <Route path="/qr" element={<QRScreen />} />
                <Route path="/thankyou" element={<ThankYouScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            ) : (
              <BoothIdentityScreen />
            )
          } />
        </Routes>
      </TouchInteractive>
    </BrowserRouter>
  );
}
