/**
 * VIDEO BACKGROUND COMPONENT
 * Full-screen video background with fallback and performance optimization
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import bgVideo from '@/assets/bg.mp4';

interface VideoBackgroundProps {
  videoSrc?: string;
  overlayOpacity?: number;
  enableVignette?: boolean;
  className?: string;
}

export function VideoBackground({
  videoSrc = bgVideo,
  overlayOpacity = 0.6,
  enableVignette = true,
  className = '',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      setHasError(true);
      console.warn('Video background failed to load, using fallback');
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`}>
      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      )}

      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: overlayOpacity }}
        animate={{ opacity: overlayOpacity }}
        style={{ opacity: overlayOpacity }}
      />

      {enableVignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)',
          }}
        />
      )}
    </div>
  );
}
