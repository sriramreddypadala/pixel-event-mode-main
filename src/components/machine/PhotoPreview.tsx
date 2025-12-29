import { motion } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import type { CapturedPhoto } from '@/types';

interface PhotoPreviewProps {
  photo: CapturedPhoto;
  onRetake: () => void;
  onRemove: () => void;
  index: number;
}

export function PhotoPreview({ photo, onRetake, onRemove, index }: PhotoPreviewProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative group"
    >
      <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg">
        <img
          src={photo.dataUrl}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRetake}
          className="p-2 bg-primary-500 rounded-full"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className="p-2 bg-error rounded-full"
        >
          <X className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
        {index + 1}
      </div>
    </motion.div>
  );
}
