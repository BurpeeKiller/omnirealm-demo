import { useClock } from '@/hooks/useClock';
import { motion } from 'framer-motion';

export const Clock = () => {
  const { time, date } = useClock();

  return (
    <motion.div
      className="text-center py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-6xl font-bold text-gradient tabular-nums">{time}</div>
      <div className="text-lg text-gray-400 mt-2 capitalize">{date}</div>
    </motion.div>
  );
};
