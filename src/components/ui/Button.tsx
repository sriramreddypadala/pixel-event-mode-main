import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { buttonTap, buttonHover } from '@/utils/motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pixxel-orange focus:ring-offset-2 focus:ring-offset-pixxel-black';

  const variants = {
    primary: 'bg-gradient-to-r from-pixxel-orange to-pixxel-orange-dark text-white hover:from-pixxel-orange-dark hover:to-pixxel-orange shadow-lg hover:shadow-glow',
    secondary: 'bg-gradient-to-r from-pixxel-amber to-pixxel-orange text-white hover:from-pixxel-orange hover:to-pixxel-orange-dark shadow-lg hover:shadow-orange-soft',
    outline: 'border-2 border-pixxel-orange text-pixxel-orange hover:bg-pixxel-orange/10',
    ghost: 'text-gray-300 hover:bg-pixxel-surface hover:text-pixxel-orange',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-6 text-xl',
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled || isLoading ? {} : buttonHover}
      whileTap={disabled || isLoading ? {} : buttonTap}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}

