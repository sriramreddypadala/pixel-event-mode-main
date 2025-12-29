import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { alertVariants } from '@/utils/motion';
import { cn } from '@/utils/helpers';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

type AlertProps = {
  variant: AlertVariant;
  title?: string;
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
};

const variantStyles = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
  warning: 'bg-orange-50 dark:bg-pixxel-orange/20 border-orange-200 dark:border-pixxel-orange text-orange-900 dark:text-pixxel-orange-light',
  info: 'bg-orange-50 dark:bg-pixxel-orange/10 border-orange-200 dark:border-pixxel-orange/50 text-orange-900 dark:text-pixxel-orange-light',
};

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Alert({
  variant,
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}: AlertProps) {
  const Icon = icons[variant];

  React.useEffect(() => {
    if (isVisible && autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={alertVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className={cn(
            'flex items-start gap-3 p-4 rounded-xl border-2 shadow-lg',
            variantStyles[variant]
          )}>
            <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              {title && (
                <h4 className="font-semibold mb-1">{title}</h4>
              )}
              <p className="text-sm">{message}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing alerts
export function useAlert() {
  const [alert, setAlert] = React.useState<{
    variant: AlertVariant;
    title?: string;
    message: string;
    isVisible: boolean;
  }>({
    variant: 'info',
    message: '',
    isVisible: false,
  });

  const showAlert = (
    variant: AlertVariant,
    message: string,
    title?: string
  ) => {
    setAlert({ variant, message, title, isVisible: true });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  };

  return { alert, showAlert, hideAlert };
}

// Import React for useEffect
import React from 'react';
