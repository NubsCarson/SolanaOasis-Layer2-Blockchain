import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.75,
        }}
        variants={{
          initialState: {
            opacity: 0,
            clipPath: 'circle(0% at 50% 50%)',
          },
          animateState: {
            opacity: 1,
            clipPath: 'circle(100% at 50% 50%)',
          },
          exitState: {
            opacity: 0,
            clipPath: 'circle(0% at 50% 50%)',
          },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Layout; 