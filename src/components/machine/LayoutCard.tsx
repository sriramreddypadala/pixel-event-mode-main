import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { formatCurrency } from '@/utils/helpers';
import type { PhotoLayout } from '@/types';

interface LayoutCardProps {
  layout: PhotoLayout;
  isSelected: boolean;
  onSelect: () => void;
}

export function LayoutCard({ layout, isSelected, onSelect }: LayoutCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative p-6 rounded-2xl border-4 cursor-pointer transition-all',
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 shadow-glow'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
      )}
      onClick={onSelect}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-6 h-6 text-white" />
        </motion.div>
      )}

      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl mb-4 flex items-center justify-center">
        <div className="text-4xl font-bold text-gray-400 dark:text-gray-500">
          {layout.type.toUpperCase()}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {layout.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {layout.photoCount} photos
      </p>
      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
        {formatCurrency(layout.price)}
      </p>
    </motion.div>
  );
}
