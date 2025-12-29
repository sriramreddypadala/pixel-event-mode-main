import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { pulseVariants } from '@/utils/motion';

type IdleWarningModalProps = {
  isOpen: boolean;
  timeLeft: number;
  onContinue: () => void;
};

export function IdleWarningModal({
  isOpen,
  timeLeft,
  onContinue,
}: IdleWarningModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onContinue}
      title="Are you still there?"
      size="md"
    >
      <div className="text-center py-6">
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
        </motion.div>

        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          Your session will end in
        </p>

        <motion.div
          key={timeLeft}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-bold text-yellow-600 dark:text-yellow-400 mb-6"
        >
          {timeLeft}
        </motion.div>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Touch anywhere to continue your session
        </p>

        <Button size="xl" fullWidth onClick={onContinue}>
          Continue Session
        </Button>
      </div>
    </Modal>
  );
}
