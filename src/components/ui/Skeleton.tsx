import { motion } from 'framer-motion';
import { skeletonVariants } from '@/utils/motion';
import { cn } from '@/utils/helpers';

type SkeletonProps = {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
};

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%'),
  };

  return (
    <motion.div
      variants={skeletonVariants}
      animate="animate"
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4">
      <Skeleton variant="rectangular" height="200px" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" height="40px" className="flex-1" />
        <Skeleton variant="rectangular" height="40px" className="flex-1" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
          <Skeleton variant="circular" width="48px" height="48px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}
