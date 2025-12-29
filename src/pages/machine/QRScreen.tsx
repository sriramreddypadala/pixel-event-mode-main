import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Clock, ArrowRight, Smartphone, Upload, CheckCircle, Printer } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { useMachineStore } from '@/store/machineStore';
import { s3Service } from '@/services/s3.service';
import { GridRenderer } from '@/utils/gridRenderer';
import type { GridTemplate } from '@/types/grid';

export function QRScreen() {
  const navigate = useNavigate();
  const { session, setPrintSettings } = useMachineStore();
  // Determine if Print & Cut should be hidden (for 4x6 Single Photo)
  const isSingle4x6 = session?.layout && 'id' in session.layout && session.layout.id === 'single_4x6';
  const [timeLeft, setTimeLeft] = useState(60);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [networkInfo, setNetworkInfo] = useState<string>('');
  const [uploading, setUploading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [printMode, setPrintMode] = useState<'full' | 'cut'>(
    session?.printSettings?.printAndCut ? 'cut' : 'full'
  );

  // Get network information
  useEffect(() => {
    // Check if we have a public URL
    const publicUrl = window.__PUBLIC_URL__;
    
    if (publicUrl && !publicUrl.includes('localhost') && !publicUrl.includes('127.0.0.1') && !publicUrl.includes('192.168')) {
      setNetworkInfo(`🌍 QR Code works from ANYWHERE in the world!`);
    } else {
      setNetworkInfo(`📱 QR works on same WiFi network • Global access ready once ngrok starts`);
    }
  }, []);

  // Create sharing session and generate QR code
  useEffect(() => {
    if (session?.photos && session.photos.length > 0) {
      // Upload to S3
      const uploadToS3 = async () => {
        try {
          setUploading(true);
          setUploadProgress(10);
          
          console.log('📤 Creating composite image and uploading to AWS S3...');
          
          // Check if layout is a GridTemplate (has slots property)
          if (!session.layout || !('slots' in session.layout)) {
            console.error('❌ Invalid layout: missing slots');
            setUploading(false);
            return;
          }
          
          // Get layout template (now guaranteed to be GridTemplate)
          const layoutTemplate = session.layout as GridTemplate;
          const photoDataUrls = session.photos.map(photo => photo.dataUrl);
          
          setUploadProgress(20);
          console.log('🎨 Rendering composite image from grid layout...');
          
          // Create composite image using GridRenderer
          const gridRenderer = new GridRenderer();
          const compositeImage = await gridRenderer.renderGrid(
            layoutTemplate,
            photoDataUrls,
            {
              quality: 0.95,
              format: 'jpeg',
              includeBackground: true,
              includeLogo: true
            }
          );
          
          console.log('✅ Composite image created!');
          setUploadProgress(40);
          
          // Create session ID and layout info
          const layoutInfo = {
            type: layoutTemplate.previewType,
            photoCount: layoutTemplate.stillCount,
            name: layoutTemplate.name
          };
          
          setUploadProgress(50);
          console.log('📤 Uploading composite to S3...');
          
          // Upload composite image to S3 (single image, not multiple)
          const sessionId = await s3Service.createCompositeSession(
            layoutInfo.type,
            layoutInfo.name,
            compositeImage
          );
          
          setUploadProgress(90);
          
          console.log('✅ Uploaded to S3 successfully!');
          console.log('   Session ID:', sessionId);
          console.log('   Composite Image: Single combined image');
          console.log('   Layout:', layoutInfo.type);
          
          // Generate S3 static viewer URL (globally accessible!)
          const s3ViewerUrl = `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/sessions/${sessionId}/view.html`;
          
          console.log('   🌍 Static Viewer URL:', s3ViewerUrl);
          console.log('   ✅ Works from ANYWHERE in the world!');
          console.log('   📱 No server needed - hosted on AWS S3!');
          
          setShareUrl(s3ViewerUrl);
          setUploadProgress(100);
          setUploading(false);
        } catch (error) {
          console.error('❌ Failed to upload to S3:', error);
          setUploading(false);
        }
      };
      
      uploadToS3();
    }
  }, [session]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Navigate when timer expires
  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/thankyou');
    }
  }, [timeLeft, navigate]);

  // Update print settings when toggle changes
  useEffect(() => {
    setPrintSettings({ printAndCut: printMode === 'cut' });
  }, [printMode, setPrintSettings]);

  const handleContinue = () => {
    navigate('/thankyou');
  };

  const handlePrint = async () => {
    if (!session?.photos || session.photos.length === 0) {
      console.error('No photos to print');
      return;
    }

    // Check if layout is valid
    if (!session.layout || !('slots' in session.layout)) {
      console.error('Invalid layout for printing');
      return;
    }

    try {
      const layoutTemplate = session.layout as GridTemplate;
      const photoDataUrls = session.photos.map(photo => photo.dataUrl);
      
      // Get print settings from session
      const printAndCut = printMode === 'cut';
      
      // Calculate aspect ratio from grid dimensions
      const aspectRatio = layoutTemplate.canvasWidth / layoutTemplate.canvasHeight;
      
      // Create print-ready composite image with options
      const gridRenderer = new GridRenderer();
      const compositeImage = await gridRenderer.renderGrid(
        layoutTemplate,
        photoDataUrls,
        {
          quality: 0.95,
          format: 'jpeg',
          includeBackground: true,
          includeLogo: true,
          printAndCut: printAndCut
        }
      );

      // Create a new window with the image for printing (no text, clean print)
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to print');
        return;
      }

      // Calculate print dimensions maintaining aspect ratio
      // For 4x6 prints: 4 inches × 300 DPI = 1200px width
      // For 2x6 prints: 2 inches × 300 DPI = 600px width
      const printWidth = layoutTemplate.canvasWidth;
      const printHeight = layoutTemplate.canvasHeight;

      // Generate printer instructions for Print & Cut
      const cutInstructions = printAndCut ? `
        <div style="display: none;" class="print-instructions">
          <h2>PRINTER SETTINGS FOR CUTTING:</h2>
          <ol>
            <li>In Printer Properties, enable "Cut" or "Auto Cut" option</li>
            <li>Set cut position to: Vertical Center (50% width)</li>
            <li>Ensure cut line aligns with red dashed line on print</li>
            <li>Use registration marks (red L-shapes) for precise alignment</li>
          </ol>
          <p><strong>Note:</strong> Red dashed line indicates cut position</p>
        </div>
      ` : '';

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title></title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
              .print-instructions {
                position: absolute;
                top: -9999px;
                left: -9999px;
              }
              @media print {
                @page {
                  size: ${printWidth}px ${printHeight}px;
                  margin: 0;
                  ${printAndCut ? 'marks: crop cross;' : ''}
                }
                body {
                  margin: 0;
                  padding: 0;
                  width: ${printWidth}px;
                  height: ${printHeight}px;
                }
                img {
                  width: ${printWidth}px;
                  height: ${printHeight}px;
                  object-fit: contain;
                  display: block;
                  page-break-inside: avoid;
                  page-break-after: avoid;
                }
                ${printAndCut ? `
                /* Printer-specific cut instructions */
                @page {
                  marks: crop;
                }
                ` : ''}
              }
              @media screen {
                body {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  margin: 0;
                  padding: 20px;
                  background: #000;
                  color: #fff;
                  font-family: Arial, sans-serif;
                }
                img {
                  max-width: 100%;
                  max-height: 80vh;
                  width: auto;
                  height: auto;
                  object-fit: contain;
                  margin-bottom: 20px;
                }
                .print-instructions {
                  position: relative;
                  top: auto;
                  left: auto;
                  background: rgba(255, 255, 255, 0.1);
                  padding: 20px;
                  border-radius: 8px;
                  max-width: 600px;
                  margin-top: 20px;
                }
                .print-instructions h2 {
                  color: #ff8c1a;
                  margin-bottom: 15px;
                  font-size: 18px;
                }
                .print-instructions ol {
                  margin-left: 20px;
                  margin-bottom: 15px;
                }
                .print-instructions li {
                  margin-bottom: 8px;
                  line-height: 1.5;
                }
                .print-instructions p {
                  color: #ff6b6b;
                  font-weight: bold;
                }
              }
            </style>
          </head>
          <body>
            <img src="${compositeImage}" alt="" />
            ${cutInstructions}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 250);
                window.onafterprint = function() {
                  setTimeout(function() {
                    window.close();
                  }, 100);
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Failed to print:', error);
      alert('Failed to prepare print. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      <VideoBackground
        overlayOpacity={0.7}
        enableVignette={true}
      />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-black text-white mb-4">
            📲 Get Your Photos!
          </h1>
          <p className="text-2xl text-pixxel-orange-light font-light">
            Scan the QR code to download your digital copies instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 w-full max-w-4xl items-center">
          {/* QR Code Section */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex flex-col items-center"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-6 p-12">
                <div className="relative">
                  <div className="w-24 h-24 border-8 border-pixxel-orange/20 border-t-pixxel-orange rounded-full animate-spin"></div>
                  <Upload className="w-12 h-12 text-pixxel-orange absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Please Hold...
                  </h3>
                  <div className="w-64 h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pixxel-orange to-yellow-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-gray-400 mt-2">Processing...</p>
                </div>
              </div>
            ) : shareUrl ? (
              <>
                <div className="relative p-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
                  {/* Scan Me Border Animation */}
                  <div className="absolute inset-0 border-4 border-pixxel-orange rounded-3xl animate-pulse" />

                  <QRCodeSVG
                    value={shareUrl}
                    size={350}
                    level="H"
                    includeMargin={true}
                    className="rounded-xl"
                  />

                  {/* Center Logo/Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg">
                    <Smartphone className="w-8 h-8 text-pixxel-orange" />
                  </div>
                </div>

                <motion.p
                  className="mt-8 text-3xl text-white font-bold flex items-center justify-center gap-3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👆 Scan Here
                </motion.p>
              </>
            ) : (
              <div className="w-full flex items-center justify-center p-8">
                <p className="text-gray-400">Generating QR code...</p>
              </div>
            )}
          </motion.div>

          {/* Info & Actions Section */}
          <div className="space-y-8">
            <GlassPanel className="p-8 rounded-3xl" blur="heavy" glow={true}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-pixxel-orange/20 flex items-center justify-center">
                  <Download className="w-8 h-8 text-pixxel-orange" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    What's Included?
                  </h2>
                  <p className="text-gray-300">High-quality digital downloads</p>
                </div>
              </div>

              <ul className="space-y-4 text-lg text-gray-300 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pixxel-orange rounded-full" />
                  {session?.photos.length || 0} photos ready
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pixxel-orange rounded-full" />
                  📱 Scan QR to download
                </li>
              </ul>

              {/* Print Settings */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-xl text-white font-semibold mb-4">
                  ⚙️ Print Settings
                </h3>
                
                <div className="space-y-4">
                  {/* Print Mode Options */}
                  <div className="pt-2 border-t border-white/10">
                    <label className="text-lg text-white font-medium mb-3 block">
                      Print Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Full Sheet Print Option */}
                      <button
                        onClick={() => setPrintMode('full')}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          printMode === 'full'
                            ? 'bg-pixxel-orange text-white shadow-lg shadow-pixxel-orange/50'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        📄 Full Sheet Print
                      </button>
                      {/* Print & Cut Option - hidden for 4x6 Single Photo */}
                      {!isSingle4x6 && (
                        <button
                          onClick={() => setPrintMode('cut')}
                          className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                            printMode === 'cut'
                              ? 'bg-pixxel-orange text-white shadow-lg shadow-pixxel-orange/50'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          ✂️ Print & Cut
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassPanel>

            <div className="flex flex-col gap-4">
              {/* Print Button */}
              <GlassButton
                variant="primary"
                size="xl"
                onClick={handlePrint}
                className="w-full font-bold text-xl justify-center"
              >
                <Printer className="w-6 h-6 mr-2" />
                Print Photo
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="xl"
                onClick={handleContinue}
                className="w-full font-bold text-xl justify-center"
              >
                I've Downloaded Them! <ArrowRight className="ml-2 w-6 h-6" />
              </GlassButton>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>Auto-skipping in {timeLeft}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
