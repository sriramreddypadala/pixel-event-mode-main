/**
 * VIEW IMAGES PAGE
 * Public page for viewing shared photos from AWS S3 via QR code
 * Downloads images directly from S3 cloud storage
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Clock, Sparkles, Cloud } from 'lucide-react';
import { s3Service, type S3SessionMetadata } from '@/services/s3.service';
import { GlassButton } from '@/components/ui/GlassButton';

export function ViewImagesPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [metadata, setMetadata] = useState<S3SessionMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setIsExpired(true);
      setLoading(false);
      return;
    }

    // Load session metadata from S3
    const loadSession = async () => {
      console.log('📥 Loading session from S3:', sessionId);
      
      try {
        const sessionData = await s3Service.getSessionMetadata(sessionId);
        
        if (sessionData) {
          console.log('✅ Session loaded from S3:');
          console.log('   Layout:', sessionData.layoutType);
          console.log('   Photos:', sessionData.photoUrls.length);
          setMetadata(sessionData);
          setIsExpired(false);
        } else {
          console.error('❌ Session not found in S3');
          setIsExpired(true);
        }
      } catch (error) {
        console.error('❌ Error loading session from S3:', error);
        setIsExpired(true);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pixxel8-photo-${index + 1}.jpg`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    if (!metadata) return;
    
    metadata.photoUrls.forEach((url: string, index: number) => {
      setTimeout(() => {
        downloadImage(url, index + 1);
      }, index * 300); // Stagger downloads
    });
  };

  const renderGrid = () => {
    if (!metadata) return null;

    // Use layout info to determine grid structure
    const count = metadata.photoCount;
    let gridClass = 'grid-cols-2';
    
    // Map layout types to grid classes
    if (metadata.layoutType === 'single' || count === 1) gridClass = 'grid-cols-1';
    else if (metadata.layoutType === '2x2' || count === 4) gridClass = 'grid-cols-2';
    else if (metadata.layoutType === '3x3' || count === 9) gridClass = 'grid-cols-3';
    else if (metadata.layoutType === '4x4' || count === 16) gridClass = 'grid-cols-4';
    else if (metadata.layoutType === 'strip') gridClass = 'grid-cols-1 md:grid-cols-4';
    else if (count === 2) gridClass = 'grid-cols-2';
    else if (count === 3) gridClass = 'grid-cols-3';
    else if (count === 6) gridClass = 'grid-cols-3';
    else gridClass = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

    return (
      <div className={`grid ${gridClass} gap-4 p-4`}>
        <AnimatePresence>
          {metadata.photoUrls.map((url: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10 group"
            >
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              {/* Download button overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => downloadImage(url, index + 1)}
                  className="px-6 py-3 bg-pixxel-orange hover:bg-pixxel-orange/80 text-white font-bold rounded-full flex items-center gap-2 transform hover:scale-105 transition-transform"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const renderCollage = () => {
    if (!metadata) return null;

    const sizes = [
      'w-64 h-64',
      'w-80 h-80',
      'w-72 h-72',
      'w-56 h-56',
      'w-64 h-64',
      'w-80 h-80'
    ];

    return (
      <div className="flex flex-wrap justify-center items-center gap-4 p-8">
        <AnimatePresence>
          {metadata.photoUrls.map((url: string, index: number) => {
            const size = sizes[index % sizes.length];
            const rotation = (index % 5 - 2) * 8;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0, rotate: rotation - 180 }}
                animate={{ opacity: 1, scale: 1, rotate: rotation }}
                exit={{ opacity: 0, scale: 0, rotate: rotation + 180 }}
                transition={{ 
                  delay: index * 0.15,
                  type: 'spring',
                  stiffness: 100
                }}
                className={`relative ${size} overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10 hover:scale-110 hover:z-10 transition-all group`}
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                {/* Download button overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => downloadImage(url, index + 1)}
                    className="px-4 py-2 bg-pixxel-orange hover:bg-pixxel-orange/80 text-white font-bold rounded-full flex items-center gap-2 transform hover:scale-105 transition-transform"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white"
        >
          <div className="relative mb-8">
            <div className="w-32 h-32 border-8 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <Cloud className="w-16 h-16 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Loading from AWS S3...</h2>
          <p className="text-gray-400">Fetching your photos</p>
        </motion.div>
      </div>
    );
  }

  if (!sessionId || isExpired || !metadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white space-y-6"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <Clock className="w-16 h-16 text-red-400" />
          </div>
          <h1 className="text-4xl font-black">Session Expired</h1>
          <p className="text-xl text-gray-400">
            This sharing link has expired or is no longer available
          </p>
          <p className="text-sm text-gray-500">
            Photos are automatically deleted from AWS S3 after 24 hours
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-pixxel-orange" />
              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-pixxel-orange bg-clip-text text-transparent">
                  {metadata?.layoutName || 'Captured Moments'}
                </h1>
                {metadata && (
                  <p className="text-sm text-gray-400 mt-1">
                    {metadata.layoutType.toUpperCase()} Layout • {metadata.photoUrls.length} photo{metadata.photoUrls.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-400">Stored on AWS S3</span>
              </div>
              
              <GlassButton
                variant="primary"
                size="lg"
                onClick={downloadAllImages}
                className="font-bold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download All
              </GlassButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-8">
        {metadata && (metadata.layoutType === 'strip' || metadata.layoutType === 'single' ||
         metadata.layoutType === '2x2' || metadata.layoutType === '3x3' || metadata.layoutType === '4x4')
          ? renderGrid()
          : renderCollage()}
      </div>

      {/* Footer */}
      {metadata && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-400">
              🌍 Photos stored on AWS S3 • Available for 24 hours • {metadata.photoUrls.length} photo{metadata.photoUrls.length !== 1 ? 's' : ''} captured
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
