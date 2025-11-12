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
        backgroundColor: 'red',
        display: 'flex',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          gap: '1rem',
          backgroundColor: 'blue',
          alignSelf: 'end',
          justifyContent: 'space-evenly',
        }}
      >
        <div>sdsdsd</div>
        <div>sdsdsd</div>
        <div>sdsdsd</div>
      </div>
    </motion.div>
  );
}
