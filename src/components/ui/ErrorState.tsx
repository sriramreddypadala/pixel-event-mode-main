import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';
import { successVariants, shakeVariants } from '@/utils/motion';

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  onHome?: () => void;
  icon?: React.ReactNode;
  retryLabel?: string;
};

export function ErrorState({
  title,
  message,
  onRetry,
  onHome,
  icon,
  retryLabel = 'Try Again',
}: ErrorStateProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={successVariants}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <motion.div
        variants={shakeVariants}
        animate="shake"
        className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6"
      >
        {icon || <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />}
      </motion.div>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>

      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
        {message}
      </p>

      <div className="flex gap-4">
        {onRetry && (
          <Button size="lg" onClick={onRetry}>
            <RefreshCw className="w-5 h-5 mr-2" />
            {retryLabel}
          </Button>
        )}
        {onHome && (
          <Button variant="outline" size="lg" onClick={onHome}>
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </motion.div>
  );
}
