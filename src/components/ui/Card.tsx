import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        'bg-white dark:bg-pixxel-surface rounded-2xl shadow-lg border border-gray-200 dark:border-pixxel-charcoal',
        hover && 'hover:border-pixxel-orange/50 hover:shadow-orange-soft transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

