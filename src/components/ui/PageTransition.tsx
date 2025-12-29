import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageVariants, slideVariants } from '@/utils/motion';

type PageTransitionProps = {
  children: React.ReactNode;
  variant?: 'fade' | 'slide';
  direction?: 'left' | 'right';
};

export function PageTransition({
  children,
  variant = 'fade',
  direction = 'right',
}: PageTransitionProps) {
  const location = useLocation();
  const variants = variant === 'slide' ? slideVariants : pageVariants;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
