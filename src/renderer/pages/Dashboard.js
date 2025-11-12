import React from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10,
      }}
    ></motion.div>
  );
}
