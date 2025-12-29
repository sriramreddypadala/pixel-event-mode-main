import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

type ProgressBarProps = {
  progress: number; // 0-100
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
};

const variantColors = {
  primary: 'bg-gradient-to-r from-pixxel-orange to-pixxel-amber shadow-glow',
  success: 'bg-green-500',
  warning: 'bg-pixxel-orange',
  danger: 'bg-red-500',
};

const sizeClasses = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

export function ProgressBar({
  progress,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'relative overflow-hidden rounded-full bg-pixxel-surface',
        sizeClasses[size]
      )}>
        <motion.div
          className={cn('h-full rounded-full', variantColors[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-medium text-pixxel-orange-light mt-2"
        >
          {Math.round(clampedProgress)}%
        </motion.div>
      )}
    </div>
  );
}

